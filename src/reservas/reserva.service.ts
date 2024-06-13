import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Reserva } from './entities/Reserva.entity';
import { ReservaDto } from './dto/create-reserva.dto';
import { ReservaResponseDto } from './dto/reserva-response.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { MetodoPago } from 'src/metodoPago/entities/MetodoPago.entity';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva) private readonly reservaRepository: Repository<Reserva>,
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(MetodoPago) private readonly metodoPagoRepository: Repository<MetodoPago>,
      ) {}

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
                where: { id: id }
            }
            const reserva: Reserva = await this.reservaRepository.findOne(criterio);
            if (reserva) return reserva;
            throw new NotFoundException(`No se encuentra la reserva con el id ${id}`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer la reserva con id ${id} en la base de datos; ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }

    private async comprobacionReserva(datos: ReservaDto): Promise<void> {
        if (!datos.fecha || !datos.hora || !datos.cantidad || !datos.numeroMesa || !datos.idUsuario || !datos.idMetodoPago) {
            throw new BadRequestException(`No puede tener campos vacíos`);
        }
    }

    async crearReserva(datos: ReservaDto): Promise<Reserva> {
        try {
            await this.comprobacionReserva(datos);

            const usuario = await this.usuarioRepository.findOne({ where: { id: datos.idUsuario } });
            const metodoPago = await this.metodoPagoRepository.findOne({ where: { id: datos.idMetodoPago } });

            if (!usuario) {
                throw new NotFoundException(`Usuario no encontrado`);
            }

            if (!metodoPago) {
                throw new NotFoundException(`Método de pago no encontrado`);
            }

            const nuevaReserva = new Reserva(datos.fecha, datos.hora, datos.cantidad, datos.numeroMesa);
            nuevaReserva.usuario = usuario;
            nuevaReserva.metodoPago = metodoPago;

            const reservaGuardada = await this.reservaRepository.save(nuevaReserva);

            if (reservaGuardada) return reservaGuardada;
            throw new NotFoundException(`No se pudo crear la reserva para el usuario ${datos.idUsuario}`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar crear la reserva para el usuario ${datos.idUsuario} en la base de datos; ${error}`,
            }, HttpStatus.NOT_FOUND);
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
                reservaActualizar.usuario = await this.usuarioRepository.findOne({ where: { id: datos.idUsuario } });
                reservaActualizar = await this.reservaRepository.save(reservaActualizar);
                return reservaActualizar;
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar la reserva con id ${id} a nombre del usuario con id ${datos.idUsuario} en la base de datos; ${error}`

            },
                HttpStatus.NOT_FOUND);
        }
    }

    async SoftEliminarReserva(id: number): Promise<Boolean> {
        
        const reservaExist: Reserva = await this.getReservaById(id);
        
        if (reservaExist.deleted) {
            throw new ConflictException('La reserva ya fue borrada con anterioridad');
        }
        
        const rows: UpdateResult = await this.reservaRepository.update(
            { id: id },
            { deleted: true }
        );
        
        return rows.affected == 1;
    }
}


