import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { AuthService } from './auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { Roles } from 'src/rol/roles.decorador';
import { Role } from 'src/rol/rol.enum';
import { UsuarioGuard } from './guard/usuario.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsuarioService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: UsuarioDto) {
    return this.authService.signIn(signInDto.email, signInDto.password, signInDto.role);
  }



  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard, UsuarioGuard)
  @Roles(Role.Admin, Role.User)
  getProfile(@Request() req) {
    return req.user;
  }

}
