import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LotesService } from '../services/lotes.service';
import { CreateLoteDto, UpdateLoteDto } from '../dto/lotes.dto';

@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  findAll() {
    return this.lotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.lotesService.update(id, updateLoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.remove(id);
  }

  @Get('compra-detalle/:compraDetalleId')
  findByCompraDetalle(@Param('compraDetalleId', ParseIntPipe) compraDetalleId: number) {
    return this.lotesService.findByCompraDetalle(compraDetalleId);
  }

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: string) {
    return this.lotesService.findByEstado(estado);
  }
}
