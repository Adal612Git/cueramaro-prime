import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Compra } from "../entities/compra.entity";
import { Proveedor } from "../../entities/proveedor.entity";
import { Producto } from "../../entities/producto.entity";
import { CompraDetalle } from "../entities/compra-detalle.entity";
import { CreateCompraDto } from "../dto/create-compra.dto";

@Injectable()
export class ComprasService {
  constructor(private readonly dataSource: DataSource) {}

  // ✅ Crear compra
  async create(dto: CreateCompraDto): Promise<Compra> {
    return await (this.dataSource.transaction as any)(async (manager: any) => {
      const proveedor = await manager.findOne(Proveedor, {
        where: { id: dto.proveedor_id },
      });
      if (!proveedor) throw new Error("Proveedor no encontrado");

      const compra = manager.create(Compra, {
        folio: dto.folio,
        proveedor_id: dto.proveedor_id,
        fecha_compra: dto.fecha_compra,
      });

      const compraGuardada = await manager.save(compra);
      const detalles: CompraDetalle[] = [];

      for (const det of dto.detalles) {
        const producto = await manager.findOne(Producto, {
          where: { id: det.producto_id },
        });
        if (!producto) throw new Error("Producto no encontrado");

        const detalle = manager.create(CompraDetalle, {
          compra: compraGuardada,
          producto_id: det.producto_id,
          cantidad_esperada: det.cantidad_esperada,
          costo_unitario: det.costo_unitario,
        });
        detalles.push(await manager.save(detalle));
      }

      await manager.save(compraGuardada);

      const result = await manager.findOne(Compra, {
        where: { id: compraGuardada.id },
        relations: ["proveedor", "detalles", "detalles.producto"],
      });

      return result!;
    });
  }

  // ✅ Listar todas
  async findAll(): Promise<Compra[]> {
    return await this.dataSource.getRepository(Compra).find({
      relations: ["proveedor", "detalles", "detalles.producto"],
    });
  }

  // ✅ Buscar una (no nula)
  async findOne(id: number): Promise<Compra> {
    const result = await this.dataSource.getRepository(Compra).findOne({
      where: { id },
      relations: ["proveedor", "detalles", "detalles.producto"],
    });
    if (!result) throw new Error("Compra no encontrada");
    return result;
  }

  // ✅ Buscar por proveedor
  async findByProveedor(proveedorId: number): Promise<Compra[]> {
    return await this.dataSource.getRepository(Compra).find({
      where: { proveedor_id: proveedorId },
      relations: ["proveedor", "detalles", "detalles.producto"],
    });
  }
}
