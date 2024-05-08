import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from './constants';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    //eliminé usuarioModulo por conflicto circular. se chocaba con los datos de authModulo el cual también importa el usuario
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UsuarioService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}