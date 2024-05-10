import { Body, Controller, Delete, Get, Patch, HttpCode, Request, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { TipoService } from './tipo.service';
import { Tipo } from './entidad/Tipo.entity';
import { DtoTipo } from './dto/DtoTipo.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';
import { UsuarioGuard } from 'src/auth/guard/usuario.guard';

@Controller('tipo')
export class TipoController {
    constructor(private readonly tipoService: TipoService) {}

    @Get()
    @UseGuards(UsuarioGuard)
    @HttpCode(200)
    async getTipos(@Request() req: Request & {user:RequestLoginDto}): Promise<Tipo[]> {
        // req obtiene los datos que tiene el Guard
        const usuario=req.user;        
        if (usuario && usuario.role=="admin"){
            return await this.tipoService.getTipos();
        } else {
            return await this.tipoService.getTiposActivos();
        }
    }
    
    @Get(':id')
    @UseGuards(UsuarioGuard)
    @HttpCode(200)
    async getTipoById(@Request() req: Request & {user:RequestLoginDto}, @Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Tipo> {
            const usuario=req.user;
            if (usuario && usuario.role=="admin"){
            return await this.tipoService.getTipoById(id);
        } else {
            return await this.tipoService.getTipoByIdActivo(id); 
        }  
    }

    @Post()
    @UseGuards(AdminGuard)
    @HttpCode(201)
    async crearTipo(@Body() datos: DtoTipo): Promise<Tipo> {
        return await this.tipoService.crearTipo(datos);
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async activarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.tipoService.softReactivarTipo(id);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async actualizarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoTipo): Promise<Tipo> {
        return await this.tipoService.actualizarTipo(id, datos);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async softEliminarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.tipoService.softEliminarTipo(id);
    }
}
