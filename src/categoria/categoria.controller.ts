import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entidad/Categoria.entity';
import { DtoCategoria } from './dto/DtoCategoria.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';
import { UsuarioGuard } from 'src/auth/guard/usuario.guard';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    @UseGuards(UsuarioGuard)
    @HttpCode(200)
    async getCategorias(@Request() req: Request & {user:RequestLoginDto}): Promise<Categoria[]> {
        // req obtiene los datos que tiene el Guard
        const usuario=req.user;        

        
        if (usuario && usuario.role=="admin"){
            return await this.categoriaService.getCategorias();
        } else {
            return await this.categoriaService.getCategoriasActivas();
        }
    }

    @Get(`:id`)
    @UseGuards(UsuarioGuard)
    @HttpCode(200)
    async getCategoriaActivaById(@Request() req: Request & {user:RequestLoginDto}, @Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Categoria> {
            const usuario=req.user;
            if (usuario && usuario.role=="admin"){
                return await this.categoriaService.getCategoriaById(id); 
            } else {
                return await this.categoriaService.getCategoriaByIdActivo(id); 
            }  
    }

    @Post()
    @UseGuards(AdminGuard)
    @HttpCode(201)
    async crearCategoria(@Body() datos: DtoCategoria): Promise<Categoria> {
        return await this.categoriaService.crearCategoria(datos);
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async activarCategoria(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.categoriaService.softReactvarCategoria(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async actualizarCategoria(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoCategoria): Promise<Categoria> {
        return await this.categoriaService.actualizarCategoria(id, datos);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async eliminarCategoria(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.categoriaService.softEliminarCategoria(id);
    }
}
