import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpException, HttpStatus, ParseIntPipe, Put } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Sucursal } from './entities/sucursal.entity';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() datos: SucursalDto): Promise<Sucursal> {
    return await this.sucursalService.create(datos);
  }

  @Get()
  @HttpCode(200)
  async findAllSucursales(): Promise<Sucursal[]> {
    return await this.sucursalService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOneSucursal(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
  ) id: number): Promise<Sucursal> {
    return await this.sucursalService.findOne(id);
  }

  @Put(':id')
  async updateSucursal(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})
) id: number, @Body() datos: SucursalDto): Promise<Sucursal> {
  return await this.sucursalService.update(id, datos);
  }

  @Delete(':id')
  async removeSucursal(@Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}
     )) id: number):Promise<string> {
       return this.sucursalService.remove(id)
  }
}
