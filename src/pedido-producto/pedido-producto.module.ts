import { Module } from '@nestjs/common';
import { PedidoProductoController } from './pedido-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoproductoService } from './pedido-producto.service';
import { PedidoProducto } from './entity/pedido-producto';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoProducto])],
  controllers: [PedidoProductoController],
  providers: [PedidoproductoService],
})
export class PedidoProductoModule {}
