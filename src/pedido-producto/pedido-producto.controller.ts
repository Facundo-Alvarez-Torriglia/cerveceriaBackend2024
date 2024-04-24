import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PedidoProductoService } from './pedido-producto.service';
import { PedidoProducto } from './entity/pedido-producto';
import { pedidoProductoDto } from './dto/pedido-producto';

@Controller('pedido-producto')
export class PedidoProductoController {
    constructor(private readonly pedidoProductoService: PedidoProductoService) {}

    @Get()
    @HttpCode(200)
    async getPedidosProductos(): Promise<PedidoProducto[]> {
        try {
            return await this.pedidoProductoService.getPedidosProductos();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener los pedidos de productos: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @HttpCode(200)
    async getPedidoProductoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<PedidoProducto> {
        try {
            return await this.pedidoProductoService.getPedidoProductoById(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener el pedido de producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Post()
    @HttpCode(201)
    async createPedidoProducto(@Body() pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        try {           
            return await this.pedidoProductoService.createPedidoProducto(pedidoDto);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al crear el pedido de producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Put(':id')
    async updatePedidoProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        try {
            return await this.pedidoProductoService.updatePedidoProducto(id, pedidoDto);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al actualizar el pedido de producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    @Delete(':id')
    async deletePedidoProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        try {
            return await this.pedidoProductoService.deletePedidoProducto(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al eliminar el pedido de producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
