import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComprasService } from "./compras.service";
import { ComprasController } from "./compras.controller";
import { Proveedor } from "../../entities/proveedor.entity";
import { Compra } from "../../entities/compra.entity";
import { Lote } from "../../entities/lote.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor, Compra, Lote])],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
