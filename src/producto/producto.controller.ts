import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Request, ConflictException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './entidad/Producto.entity';
import { DtoProducto } from './dto/DtoProducto.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';

@Controller('producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    @Get()
    @HttpCode(200)
    async getProductos(): Promise<Producto[]> {
        return await this.productoService.getProductos();
    }

    @Get(':id')
    @HttpCode(200)
    async getProductoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Producto> {
            return await this.productoService.getProductoById(id);
        }

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard)
    @UseGuards(AdminGuard)
    async crearProducto(@Request() req:Request & {user:RequestLoginDto},@Body() datos: DtoProducto): Promise<Producto> {
        
        const usuarioAutenticado = req.user;
        console.log(req);
        if (datos.usuario === usuarioAutenticado.sub) {
            
            return await this.productoService.crearProducto(datos);
        }
        throw new ConflictException(`El usuario ${datos.usuario} es distinto al usuario logueado ${usuarioAutenticado.sub}.`)
    }

  @Put(':id')
    @UseGuards(AuthGuard)
    @UseGuards(AdminGuard)
    async actualizarProducto(@Request() req: Request & {user:RequestLoginDto}, @Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoProducto): Promise<Producto> {
        const usuarioAutenticado = req.user;
        if (datos.usuario === usuarioAutenticado.sub) {
            return await this.productoService.actualizarProducto(id, datos);
        }
        throw new ConflictException(`El usuario ${datos.usuario} es distinto al usuario logueado.`)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @UseGuards(AdminGuard)
    async eliminarProducto(@Request() req: Request & {user:RequestLoginDto}, @Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoProducto): Promise<Boolean> {
        const usuarioAutenticado = req.user;
        if (datos.usuario === usuarioAutenticado.sub) {
            return await this.productoService.eliminarProducto(id);
        }
    }
}

