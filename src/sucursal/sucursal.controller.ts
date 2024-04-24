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
    try {
      return await this.sucursalService.create(datos);

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al crear la sucursal:' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  @HttpCode(200)
  async findAllSucursales(): Promise<Sucursal[]> {
    try {
      return await this.sucursalService.findAll();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al obtener las sucursales:' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async findOneSucursal(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
  ) id: number): Promise<Sucursal> {
    try {
      return await this.sucursalService.findOne(id);

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al obtener la sucursal:' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateSucursal(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})
) id: number, @Body() datos: SucursalDto): Promise<Sucursal> {
  try{
    return await this.sucursalService.update(id, datos);
  }catch(error){
    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Error al actualizarla sucursal: ' + error.message,
  }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }

  @Delete(':id')
  async removeSucursal(@Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}
     )) id: number):Promise<string> {
      try{
       return this.sucursalService.remove(id)
      }catch(error){
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al eliminar la sucursal: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
}
