import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Request, ConflictException } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoDto } from './dto/pedido';
import { Pedido } from './entity/pedido.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RequestLoginDto } from './dto/request-login-dto.dto';


@Controller('pedido')
export class PedidoController {
    constructor(private readonly pedidoService: PedidoService) { }

    @Get()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async getPedidos(@Request() req: Request & {user:RequestLoginDto}): Promise<Pedido[]> {
        const usuario: RequestLoginDto=req.user;
        console.log(usuario.role);
        if (usuario.role=='admin') {
            return await this.pedidoService.getPedidos();
        }
        else {            
            return await this.pedidoService.getPedidosUser(usuario.sub);
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async getPedidoById(@Request() req: Request & {user:RequestLoginDto},@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Pedido> {
        const usuario: RequestLoginDto=req.user;
        console.log(usuario.role);
        if (usuario.role=='admin') {
            return await this.pedidoService.getPedidoById(id);
        }
        else {            
            return await this.pedidoService.getPedidoByIdUser(id,usuario.sub);
        }
    }

    @Post()
    @UseGuards(AuthGuard)
    async crearPedido(@Request() req: Request & {user:RequestLoginDto}, @Body() datos: PedidoDto): Promise<Pedido> {
        // Obtener el usuario autenticado desde el objeto de solicitud
        
        const usuarioAutenticado = req.user;
        if (datos.usuario.id === usuarioAutenticado.sub) {
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
        
        if (datos.usuario.id === usuarioAutenticado.sub) {
            
            return await this.pedidoService.actualizarPedido(id, datos, Number(usuarioAutenticado.sub));
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

