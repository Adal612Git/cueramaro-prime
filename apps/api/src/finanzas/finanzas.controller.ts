import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FinanzasService } from './finanzas.service';

@Controller('finanzas')
export class FinanzasController {
  constructor(private readonly svc: FinanzasService) {}

  @Post('gastos')
  crearGasto(@Body() body:any){ return this.svc.crearGasto(body); }

  @Post('ingresos')
  crearIngreso(@Body() body:any){ return this.svc.crearIngreso(body); }

  @Get('flujo')
  flujo(@Query('desde') desde?:string, @Query('hasta') hasta?:string){ return this.svc.flujo(desde,hasta); }
}
