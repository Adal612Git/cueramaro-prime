Write-Host "🚀 Iniciando setup de Cuerámaro Prime..." -ForegroundColor Green

# Verificar que Docker esté corriendo
try {
    docker info *>$null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está corriendo. Inicia Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Iniciar base de datos
Write-Host "📦 Iniciando PostgreSQL..." -ForegroundColor Yellow
docker-compose -f infra/compose/docker-compose.yml up -d postgres

Write-Host "✅ Setup completado!" -ForegroundColor Green
Write-Host "📊 Base de datos corriendo en: localhost:55432" -ForegroundColor Cyan
Write-Host "💡 Puedes conectarte con:" -ForegroundColor Cyan
Write-Host "   Host: localhost:55432"
Write-Host "   DB: cueramaro_prime" 
Write-Host "   User: postgres"
Write-Host "   Password: password123"
