import { Body, Controller, Delete, Get, HttpCode, Request, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Patch } from '@nestjs/common';
import { PedidoProductoService } from './pedido-producto.service';
import { PedidoProducto } from './entity/pedido-producto';
import { pedidoProductoDto } from './dto/pedido-producto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('pedido-producto')
export class PedidoProductoController {
    constructor(private readonly pedidoProductoService: PedidoProductoService) {}

    //solo los usuarios logueados tendrán acceso a estos métodos
    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async getPedidosProductos(@Request() req: Request & {user:RequestLoginDto}): Promise<PedidoProducto[]> {
        const usuarioLog:RequestLoginDto=req.user;
        if (usuarioLog.role==='admin') return await this.pedidoProductoService.getPedidosProductos();
        else return await this.pedidoProductoService.getPedidosProductosUser(usuarioLog.sub);
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async getPedidoProductoById(@Request() req: Request & {user:RequestLoginDto},@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<PedidoProducto> {
            const usuarioLog:RequestLoginDto=req.user;
            if (usuarioLog.role==='admin') return await this.pedidoProductoService.getPedidoProductoById(id);  
            else return this.pedidoProductoService.getPedidoProductoByIdUser(id, usuarioLog.sub);
    }

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard)
    async createPedidoProducto(@Request() req: Request & {user:RequestLoginDto},@Body() pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        const usuarioLog = req.user;
        if (usuarioLog.role=== 'admin') {
            return await this.pedidoProductoService.createPedidoProducto(pedidoDto);  
        } else {
            return await this.pedidoProductoService.createPedidoProductoUser(pedidoDto,usuarioLog.sub);  
        }

    } 

    @Put(':id')
    @UseGuards(AuthGuard)
    async updatePedidoProducto(@Request() req: Request & {user:RequestLoginDto},@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        const usuarioLog = req.user;   
        if (usuarioLog.role=== 'admin') {
            return await this.pedidoProductoService.updatePedidoProducto(id, pedidoDto);
        } else {
            return await this.pedidoProductoService.updatePedidoProductoUser(id, pedidoDto,usuarioLog.sub);
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deletePedidoProducto(@Request() req: Request & {user:RequestLoginDto},@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        const usuarioLog = req.user;        
        if (usuarioLog.role=== 'admin') {
            return await this.pedidoProductoService.softEliminarPedidoProducto(id);
        } else {
            return await this.pedidoProductoService.softEliminarPedidoProductoUser(id, usuarioLog.sub);
        }        
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async reactivarPedidoProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise <Boolean> {
        return await this.pedidoProductoService.softReactvarPedidoProducto(id);
    }
}
