import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from '../entities/lote.entity';
import { CreateLoteDto, UpdateLoteDto } from '../dto/lotes.dto';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private lotesRepository: Repository<Lote>,
  ) {}

  async create(createLoteDto: CreateLoteDto): Promise<Lote> {
    const lote = this.lotesRepository.create(createLoteDto);
    return await this.lotesRepository.save(lote);
  }

  async findAll(): Promise<Lote[]> {
    return await this.lotesRepository.find({
      relations: ['compra_detalle'],
    });
  }

  async findOne(id: number): Promise<Lote> {
    const lote = await this.lotesRepository.findOne({
      where: { id },
      relations: ['compra_detalle'],
    });
    
    if (!lote) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    }
    
    return lote;
  }

  async update(id: number, updateLoteDto: UpdateLoteDto): Promise<Lote> {
    const lote = await this.findOne(id);
    
    Object.assign(lote, updateLoteDto);
    
    return await this.lotesRepository.save(lote);
  }

  async remove(id: number): Promise<void> {
    const lote = await this.findOne(id);
    await this.lotesRepository.remove(lote);
  }

  async findByCompraDetalle(compraDetalleId: number): Promise<Lote[]> {
    return await this.lotesRepository.find({
      where: { compra_detalle_id: compraDetalleId },
      relations: ['compra_detalle'],
    });
  }

  async findByEstado(estado: string): Promise<Lote[]> {
    return await this.lotesRepository.find({
      where: { estado },
      relations: ['compra_detalle'],
    });
  }
}
