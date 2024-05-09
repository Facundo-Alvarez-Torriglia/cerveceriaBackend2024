import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PedidoProductoService } from './pedido-producto.service';
import { PedidoProducto } from './entity/pedido-producto';
import { pedidoProductoDto } from './dto/pedido-producto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('pedido-producto')
export class PedidoProductoController {
    constructor(private readonly pedidoProductoService: PedidoProductoService) {}

    //solo los usuarios logueados tendrán acceso a estos métodos
    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async getPedidosProductos(): Promise<PedidoProducto[]> {
        return await this.pedidoProductoService.getPedidosProductos();
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async getPedidoProductoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<PedidoProducto> {
            return await this.pedidoProductoService.getPedidoProductoById(id);  
    }

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard)
    async createPedidoProducto(@Body() pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        return await this.pedidoProductoService.createPedidoProducto(pedidoDto);  
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async updatePedidoProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        return await this.pedidoProductoService.updatePedidoProducto(id, pedidoDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deletePedidoProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.pedidoProductoService.deletePedidoProducto(id);
    }
}
