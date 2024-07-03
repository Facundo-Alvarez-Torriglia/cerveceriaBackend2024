import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Request, ConflictException, Patch } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './entidad/Producto.entity';
import { DtoProducto } from './dto/DtoProducto.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';
import { UsuarioGuard } from 'src/auth/guard/usuario.guard';

@Controller('producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    @Get()
    @HttpCode(200)
    @UseGuards(UsuarioGuard)
    async getProductos(@Request() req: Request & {user:RequestLoginDto}): Promise<Producto[]> {
        const usuario=req.user;  
        if (usuario && usuario.role=="admin"){
            return await this.productoService.getProductosAdmin()
        } else {
            return await this.productoService.getProductos();
        }
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(UsuarioGuard)
    async getProductoById(@Request() req: Request & {user:RequestLoginDto}, @Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Producto> {
            const usuario=req.user;  
            if (usuario && usuario.role=="admin"){
                return await this.productoService.getProductoByIdAdmin(id);
            } else {
                return await this.productoService.getProductoById(id);
            }
        }

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard)
    @UseGuards(AdminGuard)
    async crearProducto(@Request() req:Request & {user:RequestLoginDto},@Body() datos: DtoProducto): Promise<Producto> {
        return await this.productoService.crearProducto(datos);
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async activarProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.productoService.softReactivarProducto(id);
    }

  @Put(':id')
    @UseGuards(AdminGuard)
    async actualizarProducto( @Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoProducto): Promise<Producto> {
        return await this.productoService.actualizarProducto(id, datos);
       
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async SoftEliminarProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
            return await this.productoService.softEliminarProducto(id);
        }
    }

