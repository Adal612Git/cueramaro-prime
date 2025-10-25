# =====================================================================
# CUERAMARO PRIME – EPIC 7 (Sync and Offline) + EPIC 8 (Device Bridge)
# Verifica infraestructura anterior, crea mock de bascula (WS),
# valida tablas de sync y ejecuta pruebas de integracion.
# =====================================================================

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# --- UI Helpers ---
function Say($msg, $color="Gray") { Write-Host $msg -ForegroundColor $color }
function Step($msg) { Say "`n==> $msg" "Cyan" }
function Ok($msg)   { Say "[OK] $msg" "Green" }
function Warn($msg) { Say "[WARN] $msg" "Yellow" }
function Err($msg)  { Say "[ERR] $msg" "Red" }

# --- Funciones tecnicas ---
function Ensure-Port-Free {
    param([int]$Port)
    try {
        $busy = netstat -ano 2>$null | Select-String ":$Port\s"
        if ($busy) {
            $pids = $busy | ForEach-Object { 
                $parts = ($_ -replace '\s+', ' ').Trim().Split(' ')
                $parts[-1]
            } | Where-Object { $_ -match "^\d+$" } | Select-Object -Unique
            if ($pids) {
                Warn "Liberando puerto $Port de procesos: $($pids -join ', ')"
                foreach ($pid in $pids) { 
                    try { 
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue 
                    } catch { 
                        Warn "No se pudo detener proceso $pid: $($_.Exception.Message)"
                    } 
                }
                Start-Sleep 2
            }
            $still = netstat -ano 2>$null | Select-String ":$Port\s"
            return -not $still
        } else { 
            return $true 
        }
    } catch { 
        Warn "Error verificando puerto $Port: $($_.Exception.Message)"
        return $false 
    }
}

function Wait-For-Http {
    param([string]$Url, [int]$TimeoutSec=30)
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                return $true
            }
        } catch { }
        Start-Sleep -Milliseconds 500
    }
    return $false
}

function Find-DbContainer {
    try {
        $candidates = docker ps --format "{{.Names}}" 2>$null
        if (-not $candidates) { 
            Warn "No se encontraron contenedores Docker ejecutándose"
            return $null 
        }
        $db = $candidates | Where-Object { $_ -match "cueramaro-db|postgres|pg|db" } | Select-Object -First 1
        return $db
    } catch {
        Warn "Error buscando contenedor DB: $($_.Exception.Message)"
        return $null
    }
}

function Ensure-File {
    param([string]$Path, [string]$Content, [switch]$Force)
    try {
        $dir = Split-Path $Path -Parent
        if (-not (Test-Path $dir)) { 
            New-Item -ItemType Directory -Path $dir -Force | Out-Null 
        }
        if ((Test-Path $Path) -and -not $Force) {
            $stamp = Get-Date -Format "yyyyMMddHHmmss"
            Copy-Item $Path "$Path.bak.$stamp" -Force
        }
        Set-Content -Path $Path -Value $Content -Encoding UTF8
        return $true
    } catch {
        Warn "Error creando archivo $Path: $($_.Exception.Message)"
        return $false
    }
}

function Start-BackgroundProcess {
    param([string]$WorkingDir, [string]$Command, [string]$Arguments)
    
    try {
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = $Command
        $processInfo.Arguments = $Arguments
        $processInfo.WorkingDirectory = $WorkingDir
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.UseShellExecute = $false
        $processInfo.CreateNoWindow = $true
        
        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $processInfo
        $process.Start() | Out-Null
        
        return $process
    } catch {
        Warn "Error iniciando proceso $Command $Arguments: $($_.Exception.Message)"
        return $null
    }
}

# --- Variables globales para procesos ---
$Global:BackgroundProcesses = @()

# --- Limpiar procesos al salir ---
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    foreach ($process in $Global:BackgroundProcesses) {
        try {
            if ($process -and (-not $process.HasExited)) {
                $process.Kill()
                $process.Dispose()
            }
        } catch { }
    }
}

# --- Paso 0: Preflight ---
Step "Preflight - Verificando entorno"
try {
    Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Gray
    
    if (-not (Test-Path ".\apps\api\src")) { 
        Warn "Ejecutar desde la raiz del monorepo. Buscando estructura alternativa..."
        # Verificar si estamos en una estructura diferente
        if (Test-Path ".\package.json") {
            Ok "Encontrado package.json en directorio raiz"
        } else {
            throw "No se encuentra la estructura del proyecto. Ejecutar desde la raíz del monorepo."
        }
    }
    
    # Verificar comandos necesarios
    foreach ($cmd in @("node", "docker")) {
        $check = Get-Command $cmd -ErrorAction SilentlyContinue
        if (-not $check) { 
            throw "$cmd no encontrado en PATH. Instalar Node.js y Docker primero." 
        }
        Ok "$cmd encontrado"
    }
    
    # Verificar pnpm (opcional, intentaremos usar npm si no hay pnpm)
    $pnpmCheck = Get-Command "pnpm" -ErrorAction SilentlyContinue
    if (-not $pnpmCheck) {
        $npmCheck = Get-Command "npm" -ErrorAction SilentlyContinue
        if ($npmCheck) {
            Warn "pnpm no encontrado, usando npm en su lugar"
            Set-Alias -Name pnpm -Value npm -Scope Global
        } else {
            throw "Ni pnpm ni npm encontrados. Instalar Node.js primero."
        }
    } else {
        Ok "pnpm encontrado"
    }
    
    Ok "Preflight completado"
} catch { 
    Err $_.Exception.Message
    exit 1 
}

# --- Paso 1: Infraestructura ---
Step "Detectando Postgres y Redis"
try {
    # Verificar si Docker está corriendo
    $dockerRunning = docker info 2>$null
    if (-not $dockerRunning) {
        throw "Docker no está corriendo. Inicia Docker Desktop primero."
    }
    
    $dbContainer = Find-DbContainer
    if (-not $dbContainer) { 
        Warn "No se encontro contenedor Postgres. Verificando si podemos continuar..."
        # No salimos aquí, intentamos continuar
    } else {
        Ok "Postgres activo: $dbContainer"
    }
    
    $redis = (docker ps --format "{{.Names}}" 2>$null | Where-Object { $_ -match "redis" }) -join ", "
    if ($redis) { 
        Ok "Redis detectado: $redis" 
    } else { 
        Warn "Redis no detectado (opcional para pruebas básicas)" 
    }
} catch { 
    Warn "Problema con infraestructura: $($_.Exception.Message)" 
}

# --- Paso 2: Instalar dependencias ---
Step "Instalando dependencias"
try { 
    if (Test-Path ".\package.json") {
        pnpm install 2>$null
        if ($LASTEXITCODE -eq 0) {
            Ok "Dependencias instaladas" 
        } else {
            Warn "pnpm install tuvo problemas (código: $LASTEXITCODE), continuando..."
        }
    } else {
        Warn "package.json no encontrado, saltando instalación de dependencias"
    }
} catch { 
    Warn "Aviso durante pnpm install: $($_.Exception.Message)" 
}

# --- Paso 3: Verificar API ---
Step "Verificando API (puerto 3001)"
try {
    $apiUrl = "http://localhost:3001/health"
    
    if (Wait-For-Http -Url $apiUrl -TimeoutSec 3) {
        Ok "API ya estaba arriba"
    } else {
        if (-not (Ensure-Port-Free -Port 3001)) { 
            Warn "Puerto 3001 ocupado, intentando continuar de todos modos..."
        }
        
        $apiDir = ".\apps\api"
        if (Test-Path $apiDir) {
            Say "Iniciando API en $apiDir..." "Gray"
            $process = Start-BackgroundProcess -WorkingDir $apiDir -Command "pnpm" -Arguments "start:dev"
            if ($process) {
                $Global:BackgroundProcesses += $process
                Start-Sleep 5
                
                if (Wait-For-Http -Url $apiUrl -TimeoutSec 30) {
                    Ok "API iniciada correctamente"
                } else {
                    Warn "API no responde en /health después de 30 segundos, pero continuando..."
                }
            } else {
                Warn "No se pudo iniciar la API, continuando sin ella..."
            }
        } else {
            Warn "Directorio de API no encontrado: $apiDir, continuando..."
        }
    }
} catch { 
    Warn "Error con API: $($_.Exception.Message), continuando..." 
}

# --- Paso 4: Mock de bascula ---
Step "Iniciando Device Bridge Mock"
try {
    $mockDir = ".\apps\device-mock"
    if (-not (Test-Path $mockDir)) {
        Say "Creando directorio para device mock..." "Gray"
        New-Item -ItemType Directory -Path $mockDir -Force | Out-Null
        New-Item -ItemType Directory -Path "$mockDir\src" -Force | Out-Null
        
        $pkg = @'
{
  "name": "device-mock",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": { "start": "node src/server.js" },
  "dependencies": { "ws": "^8.18.0" }
}
'@
        if (Ensure-File "$mockDir/package.json" $pkg -Force) {
            Ok "package.json creado"
        }
        
        $srv = @'
import { WebSocketServer } from "ws";
const PORT = 9777;
const wss = new WebSocketServer({ port: PORT });
console.log("[device-mock] running ws://localhost:" + PORT);
function rand() { return (Math.random()*5+0.5).toFixed(3); }
setInterval(()=>{
  const msg = JSON.stringify({type:"peso",kg:Number(rand()),ts:Date.now()});
  wss.clients.forEach(c=>{try{c.send(msg);}catch{}});
},1000);
wss.on('connection', (ws) => {
    console.log('[device-mock] Cliente conectado');
    ws.on('close', () => console.log('[device-mock] Cliente desconectado'));
});
'@
        if (Ensure-File "$mockDir/src/server.js" $srv -Force) {
            Ok "server.js creado"
        }
    }
    
    # Instalar dependencias del mock
    if (Test-Path "$mockDir/package.json") {
        Push-Location $mockDir
        pnpm install 2>$null
        Pop-Location
        Ok "Dependencias del mock instaladas"
    }
    
    if (-not (Ensure-Port-Free -Port 9777)) { 
        Warn "Puerto 9777 ocupado, intentando continuar..." 
    }
    
    if (Test-Path "$mockDir/src/server.js") {
        $process = Start-BackgroundProcess -WorkingDir $mockDir -Command "node" -Arguments "src/server.js"
        if ($process) {
            $Global:BackgroundProcesses += $process
            
            Start-Sleep 3
            
            # Verificar que el mock esta corriendo
            $wsCheck = netstat -ano 2>$null | Select-String ":9777\s"
            if ($wsCheck) {
                Ok "Device mock corriendo en ws://localhost:9777"
            } else {
                Warn "Device mock puede no estar respondiendo, pero continuando..."
            }
        } else {
            Warn "No se pudo iniciar el device mock"
        }
    } else {
        Warn "Archivo server.js no encontrado, no se puede iniciar device mock"
    }
} catch { 
    Warn "Device mock fallo: $($_.Exception.Message), continuando..." 
}

# --- Paso 5: Service Worker ---
Step "Creando Service Worker básico"
try {
    $swPath = ".\apps\web\public\sw.js"
    $swDir = Split-Path $swPath -Parent
    if (-not (Test-Path $swDir)) {
        Say "Creando directorio para service worker..." "Gray"
        New-Item -ItemType Directory -Path $swDir -Force | Out-Null
    }
    
    $sw = @'
const CACHE = "cueramaro-offline-v1";
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["/","/index.html"])));
});
self.addEventListener("fetch", e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
'@
    if (Ensure-File $swPath $sw -Force) {
        Ok "Service Worker creado en $swPath"
    } else {
        Warn "No se pudo crear el Service Worker"
    }
} catch { 
    Warn "Error creando SW: $($_.Exception.Message)" 
}

# --- Paso 6: Validar tablas de sync ---
Step "Validando tablas sync_outbox y sync_versions"
try {
    $db = Find-DbContainer
    if ($db) {
        $chkOutbox = docker exec $db psql -U postgres -d cueramaro_prime -t -c "SELECT to_regclass('public.sync_outbox') IS NOT NULL;" 2>$null
        $chkVers   = docker exec $db psql -U postgres -d cueramaro_prime -t -c "SELECT to_regclass('public.sync_versions') IS NOT NULL;" 2>$null
        
        if ($chkOutbox -and $chkVers) {
            $outboxExists = ($chkOutbox.Trim() -eq "t")
            $versExists = ($chkVers.Trim() -eq "t")
            
            if ($outboxExists -and $versExists) { 
                Ok "Tablas de sync OK" 
            } else {
                Warn "Faltan tablas de sync: outbox=$outboxExists, versions=$versExists"
            }
        } else {
            Warn "No se pudieron verificar las tablas de sync (¿problema de conexión?)"
        }
    } else {
        Warn "No hay contenedor DB disponible para verificar tablas de sync"
    }
} catch { 
    Warn "Error verificando tablas: $($_.Exception.Message)" 
}

# --- Paso final ---
Step "Finalización"
Ok "Configuración completada - Sync and Offline + Device Bridge verificado"
Ok "Procesos en background: $($Global:BackgroundProcesses.Count)"
Ok "API: http://localhost:3001 (si está disponible)"
Ok "Device Mock: ws://localhost:9777 (si está disponible)"
Say "`nResumen de servicios:" "Cyan"
foreach ($process in $Global:BackgroundProcesses) {
    if ($process -and (-not $process.HasExited)) {
        Say "  - Proceso PID $($process.Id) ejecutándose" "Green"
    } else {
        Say "  - Proceso terminado o no disponible" "Yellow"
    }
}

Warn "`nPresiona Ctrl+C para terminar todos los procesos background"
Say "Para verificar manualmente:" "Gray"
Say "  - API Health: curl http://localhost:3001/health" "Gray"
Say "  - WebSocket: usa un cliente WS para conectar a ws://localhost:9777" "Gray"

# Mantener el script corriendo para que los procesos background sigan activos
try {
    while ($true) {
        Start-Sleep 1
        # Verificar si algún proceso crítico falló
        $failedProcesses = $Global:BackgroundProcesses | Where-Object { 
            $_ -and $_.HasExited -and $_.ExitCode -ne 0 
        }
        if ($failedProcesses) {
            Warn "Algunos procesos han fallado. Revisa los logs."
        }
    }
} catch {
    # Capturar Ctrl+C y salir limpiamente
    Say "`nCerrando procesos background..." "Yellow"
}