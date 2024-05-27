import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ReservaDto } from './dto/create-reserva.dto';
import { ReservaService } from './reserva.service';
import { Reserva } from './entities/Reserva.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RequestLoginDto } from 'src/pedido/dto/request-login-dto.dto';

@Controller('reserva')
export class ReservaController {
    constructor(private readonly reservaService: ReservaService) { }

    @Get()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async getReservas(): Promise<Reserva[]> {
        return await this.reservaService.getReservas();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async getReservaById(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Reserva> {
        return await this.reservaService.getReservaById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async crearReserva(@Body() datos: ReservaDto): Promise<Reserva> {
        return await this.reservaService.crearReserva(datos);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async actualizarReserva(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: ReservaDto): Promise<Reserva> {
        return await this.reservaService.actualizarReserva(id, datos);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async softEliminarReserva(@Request() req: Request & { user: RequestLoginDto }, @Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number, @Body() datos: ReservaDto): Promise<Boolean> {
        const usuarioAutenticado = req.user;
        if (datos.idUsuario === usuarioAutenticado.sub) {
            return await this.reservaService.SoftEliminarReserva(id);
        }
    }
}