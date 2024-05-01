import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Request, ConflictException } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoDto } from './dto/pedido';
import { Pedido } from './entity/pedido.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { error } from 'console';
import { RequestLoginDto } from './dto/request-login-dto.dto';


@Controller('pedido')
export class PedidoController {
    constructor(private readonly pedidoService: PedidoService) { }

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
    async crearPedido(@Request() req: Request & {user:RequestLoginDto}, @Body() datos: PedidoDto): Promise<Pedido> {
        // Obtener el usuario autenticado desde el objeto de solicitud

        const usuarioAutenticado = req.user;
        if (datos.usuario === usuarioAutenticado.sub) {
            // Crear el pedido asociado con el usuario autenticado
            return await this.pedidoService.crearPedido(datos);
        }
        throw new ConflictException(`El usuario ${datos.usuario} es distinto al usuario logueado ${usuarioAutenticado.sub}.`)
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async actualizarPedido(@Request() req: Request & {user:RequestLoginDto}, @Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: PedidoDto): Promise<Pedido> {
        const usuarioAutenticado = req.user;
        if (datos.usuario === usuarioAutenticado.sub) {
            return await this.pedidoService.actualizarPedido(id, datos);
        }
        throw new ConflictException(`El usuario ${datos.usuario} es distinto al usuario logueado.`)
    }

    @Delete(':id')
    async eliminarPedido(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.pedidoService.eliminarPedido(id);
    }
}

