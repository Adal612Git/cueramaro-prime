Param(
  [switch]$Rebuild,
  [int]$TimeoutSec = 120
)

$ErrorActionPreference = 'Stop'

function Assert-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Herramienta requerida no encontrada: $name"
  }
}

function Test-PortFree([int]$Port) {
  try {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return -not $conn
  } catch {
    # Fallback a netstat si Get-NetTCPConnection falla
    $inUse = (netstat -ano | Select-String ":$Port ")
    return -not $inUse
  }
}

function Ensure-PortsFree([int[]]$Ports) {
  $busy = @()
  foreach ($p in $Ports) { if (-not (Test-PortFree $p)) { $busy += $p } }
  if ($busy.Count -gt 0) {
    Write-Host "Puertos ocupados: $($busy -join ', ')" -ForegroundColor Red
    foreach ($p in $busy) {
      try {
        $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
        foreach ($c in $conns) {
          $proc = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
          if ($proc) { Write-Host (" - {0}: PID {1} ({2})" -f $p, $proc.Id, $proc.ProcessName) }
        }
      } catch {}
    }
    throw "Libere los puertos anteriores e intente de nuevo."
  }
}

function Wait-ContainerHealthy([string]$ContainerName, [int]$TimeoutSec) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
    $status = & docker inspect --format '{{.State.Health.Status}}' $ContainerName 2>$null
    if ($LASTEXITCODE -eq 0) {
      if ($status -eq 'healthy') { return $true }
      if ($status -eq 'unhealthy') { return $false }
    }
    Start-Sleep -Seconds 2
  }
  return $false
}

function Invoke-ApiHealthCheck([string]$Url, [int]$TimeoutSec) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
    try {
      $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
      if ($resp.StatusCode -eq 200) { return $true }
    } catch {}
    Start-Sleep -Seconds 3
  }
  return $false
}

Write-Host "Validando pre-requisitos..." -ForegroundColor Cyan
Assert-Command docker

try {
  # Asegurar plugin compose disponible
  docker compose version | Out-Null
} catch {
  throw "Docker Compose (v2) no disponible. Actualice Docker Desktop."
}

$composeFile = Join-Path $PSScriptRoot 'docker-compose.yml'
if (-not (Test-Path $composeFile)) { throw "No se encontró $composeFile" }

if (-not (Test-Path (Join-Path (Split-Path $PSScriptRoot -Parent) '.env'))) {
  Write-Host "Aviso: no existe .env en la raíz del proyecto. Usando variables por defecto/plantilla." -ForegroundColor Yellow
}

Write-Host "Verificando puertos libres (55432, 6380, 3001, 5173)..." -ForegroundColor Cyan
Ensure-PortsFree @(55432, 6380, 3001, 5173)

Write-Host "Levantando servicios con Docker Compose..." -ForegroundColor Cyan
$args = @('compose', '-f', $composeFile, 'up', '-d')
if ($Rebuild) { $args += '--build' }
& docker @args
if ($LASTEXITCODE -ne 0) { throw "Fallo al ejecutar docker compose up" }

Write-Host "Esperando healthchecks..." -ForegroundColor Cyan
if (-not (Wait-ContainerHealthy -ContainerName 'cueramaro-prime-postgres' -TimeoutSec $TimeoutSec)) {
  throw "Postgres no alcanzó estado healthy en $TimeoutSec s"
}
if (-not (Wait-ContainerHealthy -ContainerName 'cueramaro-prime-redis' -TimeoutSec $TimeoutSec)) {
  throw "Redis no alcanzó estado healthy en $TimeoutSec s"
}
if (-not (Wait-ContainerHealthy -ContainerName 'cueramaro-prime-api' -TimeoutSec $TimeoutSec)) {
  throw "API no alcanzó estado healthy en $TimeoutSec s"
}

Write-Host "Verificando endpoint de salud API..." -ForegroundColor Cyan
if (-not (Invoke-ApiHealthCheck -Url 'http://localhost:3001/health' -TimeoutSec 30)) {
  throw "El endpoint /health no respondió 200 dentro del tiempo esperado"
}

Write-Host "Servicios levantados y saludables. Frontend en http://localhost:5173" -ForegroundColor Green
exit 0

