import { Controller, Get } from '@nestjs/common';
import { AltDashboardService } from './alt-dashboard.service';

@Controller('dashboard')
export class AltDashboardController {
  constructor(private readonly dashboardService: AltDashboardService) {}

  @Get()
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('alertas')
  getAlertas() {
    return {
      alertas: [
        '2 productos con stock bajo',
        '3 cuentas por cobrar vencidas', 
        '1 compra pendiente de recepción'
      ],
      actividad: [
        'Venta registrada – Cliente: Juan Pérez',
        'Lote recibido – Producto: Res Molida',
        'Abono aplicado – Cliente: María García'
      ]
    };
  }
}
