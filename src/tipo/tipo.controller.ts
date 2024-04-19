import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TipoService } from './tipo.service';
import { Tipo } from './entidad/Tipo.entity';
import { DtoTipo } from './dto/DtoTipo.dto';

@Controller('tipo')
export class TipoController {
    constructor(private readonly tipoService: TipoService) {}

    @Get()
    @HttpCode(200)
    async getTipos(): Promise<Tipo[]> {
        try {
            return await this.tipoService.getTipos();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener los tipos: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @HttpCode(200)
    async getTipoById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Tipo> {
        try {
            return await this.tipoService.getTipoById(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener el tipo: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Post()
    @HttpCode(201)
    async crearTipo(@Body() datos: DtoTipo): Promise<Tipo> {
        try {
            return await this.tipoService.crearTipo(datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al crear el tipo: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Put(':id')
    async actualizarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoTipo): Promise<Tipo> {
        try {
            return await this.tipoService.actualizarTipo(id, datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al actualizar el tipo: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    @Delete(':id')
    async eliminarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        try {
            return await this.tipoService.eliminarTipo(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al eliminar el tipo: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
