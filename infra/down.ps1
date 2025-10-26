Param(
  [switch]$WithVolumes
)

$ErrorActionPreference = 'Stop'

function Assert-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Herramienta requerida no encontrada: $name"
  }
}

Assert-Command docker

$composeFile = Join-Path $PSScriptRoot 'docker-compose.yml'
if (-not (Test-Path $composeFile)) { throw "No se encontró $composeFile" }

$args = @('compose', '-f', $composeFile, 'down', '--remove-orphans')
if ($WithVolumes) { $args += '-v' }

& docker @args
if ($LASTEXITCODE -ne 0) { throw "Fallo al ejecutar docker compose down" }

Write-Host "Servicios detenidos. Volúmenes $([bool]$WithVolumes) eliminados: $WithVolumes" -ForegroundColor Green

