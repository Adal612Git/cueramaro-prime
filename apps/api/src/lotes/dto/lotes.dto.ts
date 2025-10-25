import { IsString, IsNumber, IsDate, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoteDto {
  @IsString()
  codigo_lote: string;

  @IsNumber()
  @Min(0)
  precio_compra: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_venta?: number;

  @IsInt()
  @Min(1)
  cantidad_inicial: number;

  @IsInt()
  @Min(0)
  cantidad_actual: number;

  @IsDate()
  @Type(() => Date)
  fecha_entrada: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_caducidad?: Date;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsInt()
  compra_detalle_id: number;
}

export class UpdateLoteDto {
  @IsOptional()
  @IsString()
  codigo_lote?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_compra?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_venta?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cantidad_actual?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_caducidad?: Date;

  @IsOptional()
  @IsString()
  estado?: string;
}
