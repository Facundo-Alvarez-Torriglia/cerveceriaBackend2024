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
    return await this.usuarioService.create(datos);
     }

  @Get()
  @HttpCode(200)
  async findAllUsers(): Promise<Usuario[]> {
    return await this.usuarioService.findAllUser();
  
  }

  @Get(':id')
  @HttpCode(200)
  async findOneUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Usuario> {
    return await this.usuarioService.findOne(id);
   
  }

  @Put(':id')
  async updateUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number, @Body() datos: UsuarioDto): Promise<Usuario> {
    return await this.usuarioService.update(id, datos);
   
  }

  @Delete(':id')
  async removeUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<string> {
    return this.usuarioService.remove(id);
  }
}