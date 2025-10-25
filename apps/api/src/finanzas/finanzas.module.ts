import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanzasController } from './finanzas.controller';
import { FinanzasService } from './finanzas.service';
import { CuentaBancaria, Gasto, IngresoBancario } from './entities/finanzas.entities';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaBancaria, Gasto, IngresoBancario])],
  controllers: [FinanzasController],
  providers: [FinanzasService],
  exports: [FinanzasService],
})
export class FinanzasModule {}
