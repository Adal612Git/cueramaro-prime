import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';

@Module({
  controllers: [VentasController],
  providers: [],
})
export class VentasModule {}
