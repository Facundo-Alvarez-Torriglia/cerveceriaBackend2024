import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/create-usuario.dto';

import { Usuario } from './entities/usuario.entity';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() datos: UsuarioDto): Promise<Usuario> {
    try {
      return await this.usuarioService.create(datos);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al crear el usuario: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(200)
  async findAllUsers(): Promise<Usuario[]> {
    try {
      return await this.usuarioService.findAllUser();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al obtener los usuarios: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async findOneUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Usuario> {
    try {
      return await this.usuarioService.findOne(id);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al obtener el producto: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number, @Body() datos: UsuarioDto): Promise<Usuario> {
    try {
      return await this.usuarioService.update(id, datos);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al actualizar el usuario: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async removeUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<string> {
    try {
      return this.usuarioService.remove(id);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al eliminar el usuario: ' + error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}