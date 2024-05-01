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
        return await this.tipoService.getTipos();
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

    @Put(':id')
    async actualizarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: DtoTipo): Promise<Tipo> {
        return await this.tipoService.actualizarTipo(id, datos);
    }

    @Delete(':id')
    async eliminarTipo(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        return await this.tipoService.eliminarTipo(id);
    }
}
