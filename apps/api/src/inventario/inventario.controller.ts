import { Controller, Get } from '@nestjs/common';

@Controller('inventario')
export class InventarioController {
  @Get()
  findAll() {
    return { message: '✅ Inventario endpoint activo' };
  }
}
