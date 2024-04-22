import { Body, Controller, Post } from '@nestjs/common';
import { Pedido } from './entity/pedido.entity';

@Controller('pedido')
export class PedidoController {
    constructor(private pedidoService: PedidoService) {
    }    
    @Post()
    createPedido(@Body() product: PedidoDto){
        return this.pedidoService.createPedido(pedido);
      
     
    }

}
