import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  costo_base: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  margen: number;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  unidad_medida?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
