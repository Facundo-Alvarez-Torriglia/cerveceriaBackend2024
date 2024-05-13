import { Module } from '@nestjs/common';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { Pedido } from './entity/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { MetodoPago } from 'src/metodoPago/entities/MetodoPago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Usuario, MetodoPago])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService]
})
export class PedidoModule {}
