import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoDto } from './dto/pedido';
import { Pedido } from './entity/pedido.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';


@Controller('pedido')
export class PedidoController {
    constructor(private readonly pedidoService: PedidoService) {}

    @Get()
    @HttpCode(200)
    async getPedidos(): Promise<Pedido[]> {
        try {
            return await this.pedidoService.getPedidos();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener los pedidos: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @HttpCode(200)
    async getPedidoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Pedido> {
        try {
            return await this.pedidoService.getPedidoById(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener el pedido: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async crearPedido(@Body() datos: PedidoDto): Promise<Pedido> {
        try {           
            return await this.pedidoService.crearPedido(datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al crear el pedido: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Put(':id')
    async actualizarPedido(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: PedidoDto): Promise<Pedido> {
        try {
            return await this.pedidoService.actualizarPedido(id, datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al actualizar el pedido: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    @Delete(':id')
    async eliminarPedido(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        try {
            return await this.pedidoService.eliminarPedido(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al eliminar el pedido: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

