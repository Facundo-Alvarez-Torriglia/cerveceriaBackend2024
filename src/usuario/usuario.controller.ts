import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, HttpCode, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/create-usuario.dto';

import { Usuario } from './entities/usuario.entity';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() datos: UsuarioDto): Promise<Usuario> {
    return await this.usuarioService.create(datos);
     }

  @Get()
   @UseGuards(AdminGuard)  
  @HttpCode(200)
  async findAllUsers(): Promise<Usuario[]> {
    return await this.usuarioService.findAllUser();
  
  }

/*   @Get(':id')
  @UseGuards(AdminGuard)  
  @HttpCode(200)
  async findOneUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Usuario> {
    return await this.usuarioService.findOne(id);
   
  } */

  @Get('user/:id')
  @UseGuards(AuthGuard)  
  @HttpCode(200)
  async findOneUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Usuario> {
    return await this.usuarioService.findOne(id);
   
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number, @Body() datos: UsuarioDto): Promise<Usuario> {
    return await this.usuarioService.update(id, datos);
   
  }
  @Delete(':id')
  async delete(@Param('id') id: number){
    return await this.usuarioService.softDelete(id);
}

 /*  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<string> {
    return this.usuarioService.remove(id);
  } */
}