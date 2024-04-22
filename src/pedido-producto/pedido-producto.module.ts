import { Module } from '@nestjs/common';
import { PedidoProductoController } from './pedido-producto.controller';

@Module({
  controllers: [PedidoProductoController]
})
export class PedidoProductoModule {}
