import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Reserva } from './entities/Reserva.entity';
import { ReservaDto } from './dto/create-reserva.dto';

@Injectable()
export class ReservaService {
    constructor(@InjectRepository(Reserva) private readonly reservaRepository: Repository<Reserva>) { }

    async getReservas(): Promise<Reserva[]> {
        try {
            const criterio: FindManyOptions = { relations: ['usuario', 'metodoPago'] };
            const reservas: Reserva[] = await this.reservaRepository.find(criterio);
            if (reservas) return reservas;
            throw new NotFoundException(`No hay reservas registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer las reservas en la base de datos; ${error}`
            },
                HttpStatus.NOT_FOUND);
        }
    }

    async getReservaById(id: number): Promise<Reserva> {
        try {
            const criterio: FindOneOptions = {
                relations: ['usuario', 'metodoPago'],
                where: { idReserva: id }
            }
            const reserva: Reserva = await this.reservaRepository.findOne(criterio);
            if (reserva) return reserva;
            throw new NotFoundException(`No se encuentra la reserva con el id ${id}`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer la reserva con id ${id} en la base de datos; ${error}`
            },
                HttpStatus.NOT_FOUND);
        }
    }

    private async comprobacionReserva(datos: ReservaDto): Promise<void> {
        if (!datos.fecha || !datos.hora || !datos.cantidad || !datos.numeroMesa) {
            throw new BadRequestException(`No puede tener campos vacíos`);
        }
    }

    async crearReserva(datos: ReservaDto): Promise<Reserva> {
        try {
            await this.comprobacionReserva(datos);
            const nuevaReserva: Reserva = await this.reservaRepository.save(new Reserva(
                datos.fecha, datos.hora, datos.cantidad, datos.numeroMesa));
            if (nuevaReserva) return nuevaReserva;
            throw new NotFoundException(`No se pudo crear la reserva para el usuario ${datos.idUsuario.name}`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar crear la reserva para el usuario ${datos.idUsuario.name} en la base de datos; ${error}`
            },
                HttpStatus.NOT_FOUND);
        }
    }

    async actualizarReserva(id: number, datos: ReservaDto): Promise<Reserva> {
        try {
            await this.comprobacionReserva(datos);
            let reservaActualizar: Reserva = await this.getReservaById(id);
            if (reservaActualizar) {
                reservaActualizar.fecha = datos.fecha;
                reservaActualizar.hora = datos.hora;
                reservaActualizar.cantidad = datos.cantidad;
                reservaActualizar.numeroMesa = datos.numeroMesa;
                reservaActualizar = await this.reservaRepository.save(reservaActualizar);
                return reservaActualizar;
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar la reserva con ${id} a nombre de ${datos.idUsuario.age + datos.idUsuario.lastname} en la base de datos; ${error}`
            },
                HttpStatus.NOT_FOUND);
        }
    }

    async SoftEliminarReserva(id: number): Promise<Boolean> {
        //Busca la serva
        const reservaExist: Reserva = await this.getReservaById(id);
        // Si el producto esta borrado, lanzamos una excepcion
        if (reservaExist.deleted) {
            throw new ConflictException('La reserva ya fue borrada con anterioridad');
        }
        //Actualizamos la propiedad deleted
        const rows: UpdateResult = await this.reservaRepository.update(
            { id: id },
            { deleted: true }
        );
        //Si afecta a un registro, devolvemos true
        return rows.affected == 1;
    }
}


