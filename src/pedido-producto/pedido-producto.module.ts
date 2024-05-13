import { Module } from '@nestjs/common';
import { PedidoProductoController } from './pedido-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoProductoService } from './pedido-producto.service';
import { PedidoProducto } from './entity/pedido-producto';
import { PedidoService } from 'src/pedido/pedido.service';
import { PedidoModule } from 'src/pedido/pedido.module';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoProducto]), PedidoModule],
  controllers: [PedidoProductoController],
  providers: [PedidoProductoService],
})
export class PedidoProductoModule {}
