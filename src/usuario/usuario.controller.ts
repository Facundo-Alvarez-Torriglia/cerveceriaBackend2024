import { Request,Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, HttpCode, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/create-usuario.dto';

import { Usuario } from './entities/usuario.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UsuarioGuard } from 'src/auth/guard/usuario.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() datos: UsuarioDto): Promise<Usuario> {
    return await this.usuarioService.create(datos);
     }

  @Get()
   @UseGuards(UsuarioGuard)  
  @HttpCode(200)
  async findAllUsers(@Request() req: Request & {user:RequestLoginDto}): Promise<Usuario[]> {
    const usuario = req.user;
    if(usuario && usuario.role == 'admin'){
      return await this.usuarioService.findAllUser();
    } else {
      return await this.usuarioService.getUsuarioActivo();
    }
  
  }

 
  @Get(':id')
  @UseGuards(UsuarioGuard)  
  @HttpCode(200)
  async findOneUser(@Request() req: Request & {user:RequestLoginDto},@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Usuario> {
   const usuario = req.user;
   if(usuario && usuario.role == 'admin'){
     return await this.usuarioService.findOne(id);
   } else {
     return await this.usuarioService.getUsuarioByIdActivo(id);
   }
   
  } 



  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number, @Body() datos: UsuarioDto): Promise<Usuario> {
    return await this.usuarioService.update(id, datos);
   
  }
  @Delete(':id')
  async delete(@Param('id',new ParseIntPipe(
    {errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number):Promise<Boolean>{
    return await this.usuarioService.softDelete(id);
}


}