import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ReservaDto } from './dto/create-reserva.dto';
import { ReservaService } from './reserva.service';
import { Reserva } from './entities/Reserva.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('reserva')
export class ReservaController {
    constructor(private readonly reservaService: ReservaService) {}

    @Get()
    @HttpCode(200)
    async getReservas(): Promise<Reserva[]> {
        try {
            return await this.reservaService.getReservas();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener las reservas: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @HttpCode(200)
    async getReservaById(@Param('id', new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number): Promise<Reserva> {
        try {
            return await this.reservaService.getReservaById(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al obtener la reserva: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Post()
    @UseGuards(AuthGuard) // Autenticación mediante AuthGuard
    @HttpCode(201)
    async crearReserva(@Body() datos: ReservaDto): Promise<Reserva> {
        try {
            return await this.reservaService.crearReserva(datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al crear la reserva: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }  
    }

    @Put(':id')
    @UseGuards(AuthGuard) // Autenticación mediante AuthGuard
    async actualizarReserva(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: ReservaDto): Promise<Reserva> {
        try {
            return await this.reservaService.actualizarReserva(id, datos);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al actualizar la reserva: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        } 
    }

    @Delete(':id')
    async eliminarReserva(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Boolean> {
        try {
            return await this.reservaService.eliminarReserva(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error al eliminar la reserva: ' + error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}