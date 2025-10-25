import { IsNotEmpty, IsUUID, IsNumber } from "class-validator";

export class CreateLoteDto {
  @IsNotEmpty()
  codigo_barras: string;

  @IsNumber()
  peso_kg: number;

  @IsNumber()
  costo_unitario: number;

  @IsUUID()
  compraId: string;
}
