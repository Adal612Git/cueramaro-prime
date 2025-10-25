import { Controller, Get } from '@nestjs/common';

@Controller('ventas')
export class VentasController {
  @Get()
  findAll() {
    return { message: '✅ Ventas endpoint activo' };
  }
}
