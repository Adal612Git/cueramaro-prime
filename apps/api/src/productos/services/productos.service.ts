﻿import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(createProductoDto);
    return await this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productosRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id, activo: true }
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return await this.productosRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    producto.activo = false;
    await this.productosRepository.save(producto);
  }

  async findByCodigo(codigo: string): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { codigo, activo: true }
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con código ${codigo} no encontrado`);
    }
    
    return producto;
  }
}
