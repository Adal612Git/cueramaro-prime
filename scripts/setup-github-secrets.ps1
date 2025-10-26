<#!
.SYNOPSIS
  Configura GitHub Secrets para el repositorio especificado.

.DESCRIPTION
  Usa GitHub CLI (gh) si está disponible para crear/actualizar secretos.
  Alternativamente, muestra comandos curl para API de GitHub.

.EXAMPLE
  pwsh ./scripts/setup-github-secrets.ps1 -Repo owner/name -JwtSecret "..." -PostgresPassword "..."

.PARAMETER Repo
  Repositorio en formato owner/name.

.PARAMETER JwtSecret
  Valor del JWT_SECRET.

.PARAMETER PostgresPassword
  Valor del POSTGRES_PASSWORD.

.PARAMETER Environment
  (Opcional) Nombre de Environment en GitHub (p.ej. staging, production).
#>

Param(
  [Parameter(Mandatory=$true)][string]$Repo,
  [Parameter(Mandatory=$true)][string]$JwtSecret,
  [Parameter(Mandatory=$true)][string]$PostgresPassword,
  [string]$Environment
)

$ErrorActionPreference = 'Stop'

function Has-Gh() { return (Get-Command gh -ErrorAction SilentlyContinue) -ne $null }

if (Has-Gh) {
  Write-Host "Usando GitHub CLI (gh) para configurar secrets en $Repo" -ForegroundColor Cyan
  gh auth status | Out-Null

  if ($Environment) {
    gh secret set JWT_SECRET -R $Repo -e $Environment -b $JwtSecret
    gh secret set POSTGRES_PASSWORD -R $Repo -e $Environment -b $PostgresPassword
  } else {
    gh secret set JWT_SECRET -R $Repo -b $JwtSecret
    gh secret set POSTGRES_PASSWORD -R $Repo -b $PostgresPassword
  }

  Write-Host "Secrets configurados correctamente en $Repo" -ForegroundColor Green
} else {
  Write-Host "GitHub CLI no encontrado. A continuación, comandos API (curl) de referencia:" -ForegroundColor Yellow
  Write-Host "Requiere: GH_TOKEN con 'repo' y 'admin:repo_hook' scopes, y OpenSSL para cifrar." -ForegroundColor Yellow
  $repoOwner, $repoName = $Repo.Split('/')
  $curlTemplate = @'
# 1) Obtener llave pública del repo
curl -H "Accept: application/vnd.github+json" ^
     -H "Authorization: Bearer $env:GH_TOKEN" ^
     https://api.github.com/repos/%OWNER%/%REPO%/actions/secrets/public-key

# 2) Cifrar valor con la llave (NaCl / libsodium) y enviar (referencia)
# Nota: Implementación de cifrado no incluida en este script.
curl -X PUT -H "Accept: application/vnd.github+json" ^
     -H "Authorization: Bearer $env:GH_TOKEN" ^
     https://api.github.com/repos/%OWNER%/%REPO%/actions/secrets/JWT_SECRET ^
     -d '{"encrypted_value":"<BASE64_NaCl>","key_id":"<KEY_ID>"}'
'@
  $curlTemplate.Replace('%OWNER%', $repoOwner).Replace('%REPO%', $repoName) | Write-Output
}

