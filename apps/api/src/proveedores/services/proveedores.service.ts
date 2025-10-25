import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../entities/proveedor.entity';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    // Verificar si ya existe un proveedor con el mismo RFC
    const existingProveedor = await this.proveedoresRepository.findOne({
      where: { rfc: createProveedorDto.rfc, estado: 'activo' },
    });

    if (existingProveedor) {
      throw new ConflictException('Ya existe un proveedor con este RFC');
    }

    const proveedor = this.proveedoresRepository.create(createProveedorDto);
    return await this.proveedoresRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return await this.proveedoresRepository.find({
      where: { estado: 'activo' },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({
      where: { id, estado: 'activo' },
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);

    // Verificar RFC único si se está actualizando
    if (updateProveedorDto.rfc && updateProveedorDto.rfc !== proveedor.rfc) {
      const existingProveedor = await this.proveedoresRepository.findOne({
        where: { rfc: updateProveedorDto.rfc, estado: 'activo' },
      });

      if (existingProveedor) {
        throw new ConflictException('Ya existe un proveedor con este RFC');
      }
    }

    Object.assign(proveedor, updateProveedorDto);
    return await this.proveedoresRepository.save(proveedor);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    proveedor.estado = 'inactivo';
    await this.proveedoresRepository.save(proveedor);
  }

  async findByRfc(rfc: string): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({
      where: { rfc, estado: 'activo' },
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con RFC ${rfc} no encontrado`);
    }

    return proveedor;
  }
}
