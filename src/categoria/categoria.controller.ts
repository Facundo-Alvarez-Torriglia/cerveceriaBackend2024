import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entidad/Categoria.entity';
import { DtoCategoria } from './dto/DtoCategoria.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    @HttpCode(200)
    async getCategorias(): Promise<Categoria[]> {
        return await this.categoriaService.getCategorias();
    }

    @Get('/activa')
    @HttpCode(200)
    async getCategoriasActivas(): Promise<Categoria[]> {
        return await this.categoriaService.getCategoriasActivas();
    }

    @Get(`:id`)
    @UseGuards(AdminGuard)
    @HttpCode(200)
    async getCategoriaActivaById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Categoria> {
        return await this.categoriaService.getCategoriaById(id); 
    }

    @Get('/activa/:id')
    @HttpCode(200)
    async getCategoriaById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Categoria> {
          return await this.categoriaService.getCategoriaByIdActivo(id); 
    }


    @Post()
    @HttpCode(201)
    async crearCategoria(@Body() datos: DtoCategoria): Promise<Categoria> {
        return await this.categoriaService.crearCategoria(datos);
    }

    @Patch(':id')
    async activarCategoria(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.categoriaService.softReactvarCategoria(id);
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
        return await this.categoriaService.softEliminarCategoria(id);
    }
}
