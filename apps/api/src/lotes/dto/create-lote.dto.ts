import { IsString, IsNumber, IsPositive, IsOptional, IsDate, Min } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  codigo_barras: string;

  @IsNumber()
  @IsPositive()
  producto_id: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  compra_detalle_id?: number;

  @IsNumber()
  @IsPositive()
  @Min(0.001)
  @IsOptional()
  peso_esperado?: number;

  @IsNumber()
  @IsPositive()
  @Min(0.001)
  peso_real: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  costo_unitario: number;

  @IsDate()
  @IsOptional()
  fecha_vencimiento?: Date;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
