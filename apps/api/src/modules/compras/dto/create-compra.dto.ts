import { IsNotEmpty, IsUUID, IsNumber } from "class-validator";

export class CreateCompraDto {
  @IsNotEmpty()
  folio: string;

  @IsNumber()
  total: number;

  @IsUUID()
  proveedorId: string;
}
