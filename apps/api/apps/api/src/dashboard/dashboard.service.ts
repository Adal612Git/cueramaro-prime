import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  
  async getEstadisticas() {
    // Datos de prueba est�ticos - FUNCIONA SIEMPRE
    return {
      inventarioKg: 1245,
      ventasCount: 12,
      ventasTotal: 18450,
      clientesActivos: 42,
      cxcVencidas: 3,
      comprasPendientes: 3,
      stockBajo: 2
    };
  }

  async getAlertas() {
    return {
      alertas: [
        '2 productos con stock bajo',
        '3 cuentas por cobrar vencidas', 
        '1 compra pendiente de recepci�n'
      ],
      actividad: [
        'Venta registrada � Cliente: Juan P�rez',
        'Lote recibido � Producto: Res Molida',
        'Abono aplicado � Cliente: Mar�a Garc�a'
      ]
    };
  }
}
