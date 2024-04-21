import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MetodoPagoService } from './metodoPago.service';
import { MetodoPagoDto } from './dto/metodoPago.dto';

@Controller('metodoPago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  @Get()
  async findAll(): Promise<MetodoPagoDto[]> {
    return this.metodoPagoService.findAll();
  }

  @Post()
  async create(@Body() metodoPagoDTO: MetodoPagoDto): Promise<MetodoPagoDto> {
    return this.metodoPagoService.create(metodoPagoDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MetodoPagoDto> {
    return this.metodoPagoService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() metodoPagoDTO: MetodoPagoDto): Promise<MetodoPagoDto> {
    return this.metodoPagoService.update(id, metodoPagoDTO);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.metodoPagoService.remove(id);
  }
}