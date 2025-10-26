<#!
.SYNOPSIS
  Genera secretos seguros para JWT y Postgres.

.DESCRIPTION
  Produce valores aleatorios criptográficamente seguros y los imprime
  en formato compatible con GitHub Secrets.

.EXAMPLE
  pwsh ./scripts/generate-secrets.ps1

.PARAMETER OutFile
  Opcional. Ruta para escribir un archivo .env con los secretos.

.PARAMETER Clip
  Copia los secretos al portapapeles.
#>

Param(
  [string]$OutFile,
  [switch]$Clip
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function New-Base64Secret([int]$ByteLength) {
  $bytes = New-Object byte[] $ByteLength
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  return [Convert]::ToBase64String($bytes)
}

function New-Password([int]$Length = 24) {
  $chars = ('abcdefghijkmnopqrstuvwxyz','ABCDEFGHJKLMNPQRSTUVWXYZ','23456789','!@#$%^&*()-_=+[]{}')
  $pool = ($chars -join '')
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $bytes = New-Object byte[] $Length
  $rng.GetBytes($bytes)
  $sb = New-Object -TypeName System.Text.StringBuilder
  foreach ($b in $bytes) { $null = $sb.Append($pool[$b % $pool.Length]) }
  return $sb.ToString()
}

$JWT_SECRET = New-Base64Secret -ByteLength 48  # ~64 chars base64
$POSTGRES_PASSWORD = New-Password -Length 24

$lines = @(
  "JWT_SECRET=$JWT_SECRET",
  "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
)

$output = ($lines -join "`n") + "`n"
Write-Output $output

if ($OutFile) {
  Set-Content -Path $OutFile -Value $output -NoNewline -Encoding UTF8
  Write-Host "Secretos escritos en $OutFile (no commitear)" -ForegroundColor Yellow
}

if ($Clip) {
  try { $output | Set-Clipboard; Write-Host "Secretos copiados al portapapeles" -ForegroundColor Green } catch {}
}

Write-Host "Use scripts/setup-github-secrets.ps1 para cargar a GitHub." -ForegroundColor Cyan

