import { Body, Controller, Delete, Get, Patch, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TipoService } from './tipo.service';
import { Tipo } from './entidad/Tipo.entity';
import { DtoTipo } from './dto/DtoTipo.dto';

@Controller('tipo')
export class TipoController {
    constructor(private readonly tipoService: TipoService) {}

    @Get()
    @HttpCode(200)
    async getTipos(): Promise<Tipo[]> {
        return await this.tipoService.getTipos();
    }

    //Este es solo para los usuarios
    @Get('tipoUsuarios')
    @HttpCode(200)
    async getTiposUsuarios(): Promise<Tipo[]> {
        return await this.tipoService.getTiposUsuarios();
    }
    
    @Get(':id')
    @HttpCode(200)
    async getTipoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Tipo> {
            return await this.tipoService.getTipoById(id);
    }

    @Post()
    @HttpCode(201)
    async crearTipo(@Body() datos: DtoTipo): Promise<Tipo> {
        return await this.tipoService.crearTipo(datos);
    }

    @Patch(':id')
    async activarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.tipoService.softReactivarTipo(id);
    }

    @Put(':id')
    async actualizarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoTipo): Promise<Tipo> {
        return await this.tipoService.actualizarTipo(id, datos);
    }

    @Delete(':id')
    async softEliminarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.tipoService.softEliminarTipo(id);
    }
}
