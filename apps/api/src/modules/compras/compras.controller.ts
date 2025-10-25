import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import * as fs from "fs";

interface Compra {
  id: number;
  proveedor_id?: string;
  fecha: Date;
  lotes: Lote[];
}

interface Lote {
  codigo: string;
  peso_kg: number;
  compra_id?: number;
}

@Controller("compras")
export class ComprasController {
  private compras: Compra[] = [];
  private lotes: Lote[] = [];

  @Post()
  crearCompra(@Body() dto: any) {
    const compra: Compra = {
      id: Date.now(),
      proveedor_id: dto.proveedor_id,
      fecha: new Date(),
      lotes: [],
    };
    this.compras.push(compra);
    return { message: "Compra registrada", compra };
  }

  @Post("lotes")
  crearLote(@Body() dto: any) {
    const peso = dto.peso_real ?? Math.random() * 5 + 0.5;
    const codigo = `L-${Date.now()}`;
    const lote: Lote = { codigo, peso_kg: peso, compra_id: dto.compra_id };
    this.lotes.push(lote);

    fs.mkdirSync("./etiquetas", { recursive: true });
    const zpl = "^XA\n" +
                "^FO50,50^ADN,36,20^FDLOTE: " + codigo + "^FS\n" +
                "^FO50,100^ADN,36,20^FDPESO: " + peso.toFixed(3) + " kg^FS\n" +
                "^XZ";
    fs.writeFileSync(`./etiquetas/${codigo}.zpl`, zpl);

    return { message: "Lote generado", lote };
  }

  @Get()
  listarCompras(@Query("desde") desde?: string, @Query("hasta") hasta?: string) {
    return this.compras.filter((c) => {
      const f = new Date(c.fecha);
      return (!desde || f >= new Date(desde)) && (!hasta || f <= new Date(hasta));
    });
  }
}
