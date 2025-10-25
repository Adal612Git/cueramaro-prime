import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ComprasService } from '../services/compras.service';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { Compra } from '../entities/compra.entity';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  create(@Body() createCompraDto: CreateCompraDto): Promise<Compra> {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  findAll(): Promise<Compra[]> {
    return this.comprasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Compra> {
    return this.comprasService.findOne(id);
  }

  @Get('proveedor/:proveedorId')
  findByProveedor(@Param('proveedorId', ParseIntPipe) proveedorId: number): Promise<Compra[]> {
    return this.comprasService.findByProveedor(proveedorId);
  }
}
