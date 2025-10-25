import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsArray, IsOptional, ValidateNested, IsPositive } from 'class-validator';
import { CreateCompraDetalleDto } from './create-compra-detalle.dto';

export class CreateCompraDto {
  @IsString()
  folio: string;

  @IsNumber()
  @IsPositive()
  proveedor_id: number;

  @IsDate()
  @Type(() => Date)
  fecha_compra: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fecha_recepcion?: Date;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompraDetalleDto)
  detalles: CreateCompraDetalleDto[];
}
