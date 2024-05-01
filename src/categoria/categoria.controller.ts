import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entidad/Categoria.entity';
import { DtoCategoria } from './dto/DtoCategoria.dto';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    @HttpCode(200)
    async getCategorias(): Promise<Categoria[]> {
        return await this.categoriaService.getCategorias();
    }

    @Get(':id')
    @HttpCode(200)
    async getCategoriaById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Categoria> {
        return await this.categoriaService.getCategoriaById(id); 
    }

    @Post()
    @HttpCode(201)
    async crearCategoria(@Body() datos: DtoCategoria): Promise<Categoria> {
        return await this.categoriaService.crearCategoria(datos);
    }

    @Put(':id')
    async actualizarCategoria(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoCategoria): Promise<Categoria> {
        return await this.categoriaService.actualizarCategoria(id, datos);
    }

    @Delete(':id')
    async eliminarCategoria(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.categoriaService.eliminarCategoria(id);
    }
}
