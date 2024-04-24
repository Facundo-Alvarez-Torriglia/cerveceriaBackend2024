import { Module } from '@nestjs/common';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { Pedido } from './entity/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Usuario])],
  controllers: [PedidoController],
  providers: [PedidoService]
})
export class PedidoModule {}
