import { Controller, Get } from '@nestjs/common';

@Controller('productos')
export class ProductosController {
  @Get()
  findAll() {
    return { message: '✅ Productos endpoint activo' };
  }
}
