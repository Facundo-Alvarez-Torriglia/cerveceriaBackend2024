import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { AuthService } from './auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Roles } from 'src/rol/roles.decorador';
import { Role } from 'src/rol/rol.enum';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsuarioService) { }

  //login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password, signInDto.role);
  }


//acceso al perfil
  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  getProfile(@Request() req) {
    return req.user;
  }

}
