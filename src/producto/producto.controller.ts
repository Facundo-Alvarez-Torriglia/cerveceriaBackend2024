import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './entidad/Producto.entity';
import { DtoProducto } from './dto/DtoProducto.dto';

@Controller('producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    @Get()
    @HttpCode(200)
    async getProductos(): Promise<Producto[]> {
        try {
            return await this.productoService.getProductos();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener los productos: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @HttpCode(200)
    async getProductoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Producto> {
        try {
            return await this.productoService.getProductoById(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener el producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Post()
    @HttpCode(201)
    async crearProducto(@Body() datos: DtoProducto): Promise<Producto> {
        try {           
            return await this.productoService.crearProducto(datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al crear el producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Put(':id')
    async actualizarProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoProducto): Promise<Producto> {
        try {
            return await this.productoService.actualizarProducto(id, datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al actualizar el producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    @Delete(':id')
    async eliminarProducto(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        try {
            return await this.productoService.eliminarProducto(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al eliminar el producto: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

