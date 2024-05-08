import { Controller, Get, Post, Body, Request, Param, Delete, HttpCode, HttpException, HttpStatus, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Sucursal } from './entities/sucursal.entity';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { UsuarioGuard } from 'src/auth/guard/usuario.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) { }

  @Post()
  @HttpCode(201)
  @UseGuards(AdminGuard)  
  async create(@Body() datos: SucursalDto): Promise<Sucursal> {
    return await this.sucursalService.create(datos);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(UsuarioGuard)
  async findAllSucursales(@Request() req: Request & {user:RequestLoginDto}): Promise<Sucursal[]> {
    const usuario = req.user;
    if(usuario && usuario.role == "admin"){
      return await this.sucursalService.findAll();
    } else {
      return await this.sucursalService.getSucursalActiva();

    }
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(UsuarioGuard)
  async findOneSucursal(@Request() req: Request & {user:RequestLoginDto},@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
  ) id: number): Promise<Sucursal> {
    const usuario = req.user;
  if(usuario && usuario.role == "admin"){
    return await this.sucursalService.findOne(id);
  }else {
    return await this.sucursalService.findOneSucursalActiva(id);
  }
  }

  @Put(':id')
  @UseGuards(AdminGuard)  
  async updateSucursal(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})
) id: number, @Body() datos: SucursalDto): Promise<Sucursal> {
  
    return await this.sucursalService.update(id, datos);

  }

  @Delete(':id')
  @UseGuards(AdminGuard)  
  async removeSucursal(@Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}
     )) id: number):Promise<Boolean> {
       return this.sucursalService.softDelete(id)
  }
}
