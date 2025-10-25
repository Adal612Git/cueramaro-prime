import { Controller, Get } from '@nestjs/common';

@Controller('compras')
export class ComprasController {
  @Get()
  findAll() {
    return { message: '✅ Compras endpoint activo' };
  }
}
