import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CxcController } from './cxc.controller';
import { CxcService } from './cxc.service';
import { CuentaPorCobrar, AbonoCxc } from './entities/cxc.entities';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaPorCobrar, AbonoCxc])],
  controllers: [CxcController],
  providers: [CxcService],
  exports: [CxcService],
})
export class CxcModule {}
