import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from '../entities/proveedor.entity';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  async create(@Body() createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Get()
  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Proveedor> {
    return this.proveedoresService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ): Promise<Proveedor> {
    return this.proveedoresService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.proveedoresService.remove(id);
  }
}
