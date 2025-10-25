import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCompraDetalleDto {
  @IsNumber()
  producto_id: number;

  @IsNumber()
  @IsPositive()
  @Min(0.001)
  cantidad_esperada: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  costo_unitario: number;
}
