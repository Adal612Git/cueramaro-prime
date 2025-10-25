import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Compra } from "../../entities/compra.entity";
import { Lote } from "../../entities/lote.entity";
import { CompraDetalle } from "../../entities/compra-detalle.entity";

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,

    @InjectRepository(CompraDetalle)
    private readonly detalleRepository: Repository<CompraDetalle>,

    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  async crearCompra(dto: any) {
    const compra = this.compraRepository.create({
      proveedor_id: dto.proveedor_id ?? null,
      total: dto.total ?? 0,
    });
    return await this.compraRepository.save(compra);
  }

  async crearLote(dto: any) {
    const lote = this.loteRepository.create({
      codigo_lote: dto.codigo_lote,
      producto_id: dto.producto_id,
      compra_detalle_id: dto.compra_detalle_id,
      cantidad_original: dto.cantidad_original,
      cantidad_actual: dto.cantidad_actual,
      precio_compra: dto.precio_compra,
      fecha_caducidad: dto.fecha_caducidad,
      ubicacion: dto.ubicacion,
    });
    return await this.loteRepository.save(lote);
  }

  async listarCompras() {
    return await this.compraRepository.find({
      relations: ["proveedor", "detalles", "detalles.lotes"],
      order: { fecha_compra: "DESC" },
    });
  }
}
