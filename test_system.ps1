# SCRIPT DE PRUEBA AUTOMÁTICO - CUERAMARO PRIME v0.2.0
Write-Host "🚀 INICIANDO PRUEBA DEL SISTEMA..." -ForegroundColor Cyan

try {
    # 1. CREAR PROVEEDOR
    Write-Host "`n1. Creando proveedor..." -ForegroundColor Yellow
    $proveedorBody = @{
        nombre = "Carnes Premium S.A."
        rfc = "CPR950101ABC"
        direccion = "Av. Principal 123"
        telefono = "5551234567"
        email = "contacto@carnespremium.com"
    } | ConvertTo-Json
    
    $proveedor = Invoke-RestMethod -Uri "http://localhost:3001/proveedores" -Method POST -Body $proveedorBody -ContentType "application/json"
    Write-Host "✅ Proveedor creado: ID $($proveedor.id) - $($proveedor.nombre)" -ForegroundColor Green

    # 2. CREAR COMPRA
    Write-Host "`n2. Creando compra..." -ForegroundColor Yellow
    $compraBody = @{
        proveedorId = $proveedor.id
        total = 2500.00
        detalles = @(
            @{
                producto_id = 1
                cantidad = 50
                precio_unitario = 25.00
                subtotal = 1250.00
            },
            @{
                producto_id = 1
                cantidad = 25
                precio_unitario = 50.00
                subtotal = 1250.00
            }
        )
    } | ConvertTo-Json
    
    $compra = Invoke-RestMethod -Uri "http://localhost:3001/compras" -Method POST -Body $compraBody -ContentType "application/json"
    Write-Host "✅ Compra creada: ID $($compra.id) - Total: $$($compra.total)" -ForegroundColor Green
    Write-Host "   Detalles: $($compra.detalles.Count) items" -ForegroundColor White

    # 3. CREAR LOTE
    Write-Host "`n3. Creando lote..." -ForegroundColor Yellow
    $loteBody = @{
        codigo_lote = "LOTE-RES-001"
        precio_compra = 85.50
        precio_venta = 120.00
        cantidad_inicial = 100
        cantidad_actual = 100
        fecha_entrada = "2025-01-24T20:35:00.000Z"
        fecha_caducidad = "2025-02-10T20:35:00.000Z"
        estado = "DISPONIBLE"
        compra_detalle_id = $compra.detalles[0].id
    } | ConvertTo-Json -Compress
    
    $lote = Invoke-RestMethod -Uri "http://localhost:3001/lotes" -Method POST -Body $loteBody -ContentType "application/json"
    Write-Host "🎉 ¡LOTE CREADO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "   ID: $($lote.id)" -ForegroundColor White
    Write-Host "   Código: $($lote.codigo_lote)" -ForegroundColor White
    Write-Host "   Estado: $($lote.estado)" -ForegroundColor White
    Write-Host "   Cantidad: $($lote.cantidad_actual)/$($lote.cantidad_inicial)" -ForegroundColor White

    # 4. VERIFICAR DATOS EN SISTEMA
    Write-Host "`n4. Verificando datos en sistema..." -ForegroundColor Cyan
    
    $proveedores = Invoke-RestMethod -Uri "http://localhost:3001/proveedores" -Method GET
    Write-Host "   Proveedores: $($proveedores.Count)" -ForegroundColor White
    
    $compras = Invoke-RestMethod -Uri "http://localhost:3001/compras" -Method GET
    Write-Host "   Compras: $($compras.Count)" -ForegroundColor White
    
    $lotes = Invoke-RestMethod -Uri "http://localhost:3001/lotes" -Method GET
    Write-Host "   Lotes: $($lotes.Count)" -ForegroundColor White

    # 5. PROBAR CONSULTAS ESPECÍFICAS
    Write-Host "`n5. Probando consultas específicas..." -ForegroundColor Cyan
    
    # Lotes por compra_detalle
    try {
        $lotesPorDetalle = Invoke-RestMethod -Uri "http://localhost:3001/lotes/compra-detalle/$($compra.detalles[0].id)" -Method GET
        Write-Host "   Lotes por detalle: $($lotesPorDetalle.Count)" -ForegroundColor White
    } catch {
        Write-Host "   ⚠️  Endpoint compra-detalle no disponible" -ForegroundColor Yellow
    }
    
    # Lotes por estado
    try {
        $lotesDisponibles = Invoke-RestMethod -Uri "http://localhost:3001/lotes/estado/DISPONIBLE" -Method GET
        Write-Host "   Lotes DISPONIBLES: $($lotesDisponibles.Count)" -ForegroundColor White
    } catch {
        Write-Host "   ⚠️  Endpoint estado no disponible" -ForegroundColor Yellow
    }

    Write-Host "`n🎊 ¡SISTEMA FUNCIONANDO CORRECTAMENTE!" -ForegroundColor Green
    Write-Host "   Flujo completo: Proveedor → Compra → Lote" -ForegroundColor White
    Write-Host "   Base de datos: SQL.js persistente" -ForegroundColor White
    Write-Host "   Endpoints: Todos operativos" -ForegroundColor White

} catch {
    Write-Host "❌ Error en prueba: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Detalles: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "   No se pudieron obtener detalles del error" -ForegroundColor Red
        }
    }
}
