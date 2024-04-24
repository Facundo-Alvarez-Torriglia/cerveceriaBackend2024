import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Reserva } from 'src/reservas/entities/Reserva.entity';
import { Pedido } from 'src/pedido/entity/pedido.entity';
import { PedidoService } from 'src/pedido/pedido.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Usuario, Pedido])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
