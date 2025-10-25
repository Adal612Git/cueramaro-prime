import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsOptional()
  rfc?: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  contacto?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
