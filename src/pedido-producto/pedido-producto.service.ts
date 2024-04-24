import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoProducto } from './entity/pedido-producto';
import { pedidoProductoDto } from './dto/pedido-producto';

@Injectable()
export class PedidoProductoService {
    constructor(
        @InjectRepository(PedidoProducto) private readonly pedidoProductoRepository: Repository<PedidoProducto>,
    ) {}

    async getPedidosProductos(): Promise<PedidoProducto[]> {
        try {
            const criterio = {};
            const pedidosProductos: PedidoProducto[] = await this.pedidoProductoRepository.find(criterio);
            if (pedidosProductos) return pedidosProductos;
            throw new NotFoundException(`No hay pedidos de productos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los pedidos de productos en la base de datos: ${error}`,
            }, HttpStatus.NOT_FOUND);
        }
    }

    async getPedidoProductoById(id: number): Promise<PedidoProducto> {
        try {
            const criterio = { where: { id } };
            const pedidoProducto: PedidoProducto = await this.pedidoProductoRepository.findOne(criterio);
            if (pedidoProducto) return pedidoProducto;
            throw new NotFoundException(`No se encontró un pedido de producto con el id ${id}`);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el pedido de producto con id ${id} en la base de datos: ${error}`,
            }, HttpStatus.NOT_FOUND);
        }
    }

    async comprobacionPedidoProducto(pedidoDto: pedidoProductoDto): Promise<void> {
        if (!pedidoDto || !pedidoDto.cantidad) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `El nombre y la cantidad son campos obligatorios para el pedido de producto`,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async createPedidoProducto(pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        try {
            // Asignar un nuevo ID si no se proporciona uno en el DTO
            if (!pedidoDto.id) {
                const ultimoPedido: PedidoProducto = await this.pedidoProductoRepository.findOne({ order: { id: 'DESC' } });
                pedidoDto.id = ultimoPedido ? ultimoPedido.id + 1 : 1;
            }

            // Comprobar si ya existe un pedido con el ID proporcionado
            const pedidoExistente: PedidoProducto = await this.pedidoProductoRepository.findOne({ where: { id: pedidoDto.id } });
            if (pedidoExistente) {
                throw new ConflictException(`Ya existe un pedido de producto con el ID ${pedidoDto.id}`);
            }

            // Si no existe, proceder a crear el nuevo pedido de producto
            await this.comprobacionPedidoProducto(pedidoDto);
            const nuevoPedidoProducto: PedidoProducto = await this.pedidoProductoRepository.save(pedidoDto);
            if (nuevoPedidoProducto) return nuevoPedidoProducto;

            throw new NotFoundException(`No se pudo crear el pedido de producto`);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Error al intentar crear el pedido de producto: ${error}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePedidoProducto(id: number, pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        try {
            await this.comprobacionPedidoProducto(pedidoDto);
            let pedidoProductoActualizar: PedidoProducto = await this.getPedidoProductoById(id);
            if (pedidoProductoActualizar) {
                pedidoProductoActualizar = Object.assign(pedidoProductoActualizar, pedidoDto);
                await this.pedidoProductoRepository.save(pedidoProductoActualizar);
                return pedidoProductoActualizar;
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Error al intentar actualizar el pedido de producto con id ${id}: ${error}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deletePedidoProducto(id: number): Promise<boolean> {
        try {
            const pedidoProductoEliminar: PedidoProducto = await this.getPedidoProductoById(id);
            if (pedidoProductoEliminar) {
                await this.pedidoProductoRepository.remove(pedidoProductoEliminar);
                return true;
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Error al intentar eliminar el pedido de producto con id ${id}: ${error}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
