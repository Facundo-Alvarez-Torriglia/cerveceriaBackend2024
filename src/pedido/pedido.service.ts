import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoDto } from './dto/pedido';
import { Pedido } from './entity/pedido.entity';


@Injectable()
export class PedidoService {
    constructor(@InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>) {}

    async getPedidos(): Promise<Pedido[]> {
        try {
            const pedidos: Pedido[] = await this.pedidoRepository.find();
            if (pedidos.length > 0) return pedidos;
            throw new NotFoundException(`No hay pedidos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ 
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los pedidos en la base de datos: ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }

    async getPedidoById(id: number): Promise<Pedido> {
        try {
            const criterio: FindOneOptions = { where: { id: id } };
            const pedido: Pedido = await this.pedidoRepository.findOne(criterio);
            if (pedido) return pedido;
            throw new NotFoundException(`No se encontró un pedido con el id ${id}`);
        } catch (error) {
            throw new HttpException({ 
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el pedido de id ${id} en la base de datos: ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }

    async crearPedido(datos: PedidoDto): Promise<Pedido> {
        try {
            // Convertir PedidoDto a un objeto parcial de Pedido
            const nuevoPedido: Partial<Pedido> = datos;
            // Crear el pedido en la base de datos
            const pedidoGuardado: Pedido = await this.pedidoRepository.save(
                nuevoPedido,
            );
            // Devolver el pedido guardado
            return pedidoGuardado;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `Error al intentar crear el pedido: ${error}`,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarPedido(id: number, datos: PedidoDto): Promise<Pedido> {
        try {
            const pedidoActualizar: Pedido = await this.getPedidoById(id);
            if (pedidoActualizar) {
                Object.assign(pedidoActualizar, datos);
                const pedidoActualizado: Pedido = await this.pedidoRepository.save(pedidoActualizar);
                return pedidoActualizado;
            }
        } catch (error) {
            throw new HttpException({ 
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar el pedido de id ${id} en la base de datos: ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }

    async eliminarPedido(id: number): Promise<boolean> {
        try {
            const pedidoEliminar: Pedido = await this.getPedidoById(id);
            if (pedidoEliminar) {
                await this.pedidoRepository.remove(pedidoEliminar);
                return true;
            }
        } catch (error) {
            throw new HttpException({ 
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar eliminar el pedido de id ${id} en la base de datos: ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }
}



function InjectRepository(Pedido: any): (target: typeof PedidoService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error('Function not implemented.');
}

