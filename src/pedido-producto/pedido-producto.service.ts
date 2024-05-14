import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { PedidoProducto } from './entity/pedido-producto';
import { pedidoProductoDto } from './dto/pedido-producto';
import { PedidoService } from 'src/pedido/pedido.service';
import { Pedido } from 'src/pedido/entity/pedido.entity';

@Injectable()
export class PedidoProductoService {
    constructor(
        @InjectRepository(PedidoProducto) private readonly pedidoProductoRepository: Repository<PedidoProducto>,
        private readonly pedidoServicio: PedidoService
    ) {}

    async getPedidosProductos(): Promise<PedidoProducto[]> {
        try {
            const criterio: FindManyOptions = {relations: ['producto', 'pedido', 'pedido.usuario']};
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

    async getPedidosProductosUser(idUser:number): Promise<PedidoProducto[]> {
        try {
            const criterio: FindManyOptions = {
                relations: ['producto', 'pedido', 'pedido.usuario'],
                where:{
                    deleted:false,
                    pedido: {
                        usuario: {
                            id:idUser
                        }
                    }
                }
            };
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
            const criterio = { relations: ['producto', 'pedido', 'pedido.usuario'], where: { id } };
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

    async getPedidoProductoByIdUser(id: number, idUser:number): Promise<PedidoProducto> {
        try {
            const criterio = { 
                relations: ['producto', 'pedido', 'pedido.usuario'], 
                where: { 
                    id,
                    deleted:false
                } };
            const pedidoProducto: PedidoProducto = await this.pedidoProductoRepository.findOne(criterio);            
            if (pedidoProducto) {
               if(pedidoProducto.pedido.usuario.id===idUser) return pedidoProducto;
               throw new ConflictException(`El usuario logeado ${idUser} es distinto del propietario del producto`)
            }
            throw new NotFoundException(`No se encontró un pedido de producto con el id ${id}`);
        } catch (error) {
            if (error instanceof HttpException) {
                // Si el error es de tipo HttpException, simplemente relanzamos el error
                throw error;
            } else if (error instanceof ConflictException) {
                // Si el error es de tipo ConflictException, lanzamos una excepción HTTP con el mismo mensaje
                throw new HttpException({
                    status: HttpStatus.CONFLICT,
                    error: error.message,
                }, HttpStatus.CONFLICT);
            } else {
                // En caso de cualquier otro error, lanzamos una excepción HTTP genérica
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `Error al intentar leer el pedido de producto: ${error}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

      async createPedidoProducto(pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        try {
            
            // Si no existe, proceder a crear el nuevo pedido de producto
            const nuevoPedidoProducto: PedidoProducto = new PedidoProducto(
                pedidoDto.cantidad, pedidoDto.pedido, pedidoDto.producto
            );
            const pedidoProductoGuardado = await this.pedidoProductoRepository.save(nuevoPedidoProducto);
            if (pedidoProductoGuardado) return pedidoProductoGuardado;

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

    async createPedidoProductoUser(pedidoDto: pedidoProductoDto, idUser:number): Promise<PedidoProducto> {
        try {  
            const pedido: Pedido= await this.pedidoServicio.getPedidoByIdUser(Number(pedidoDto.pedido), idUser);
            // Si no existe, proceder a crear el nuevo pedido de producto
            const nuevoPedidoProducto: PedidoProducto = new PedidoProducto(
                pedidoDto.cantidad, pedidoDto.pedido, pedidoDto.producto
            );
            const pedidoProductoGuardado = await this.pedidoProductoRepository.save(nuevoPedidoProducto);
            if (pedidoProductoGuardado) return pedidoProductoGuardado;
            throw new NotFoundException(`No se pudo crear el pedido de producto`);
        } catch (error) {
            if (error instanceof HttpException) {
                // Si el error es de tipo HttpException, simplemente relanzamos el error
                throw error;
            } else if (error instanceof ConflictException) {
                // Si el error es de tipo ConflictException, lanzamos una excepción HTTP con el mismo mensaje
                throw new HttpException({
                    status: HttpStatus.CONFLICT,
                    error: error.message,
                }, HttpStatus.CONFLICT);
            } else {
                // En caso de cualquier otro error, lanzamos una excepción HTTP genérica
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `Error al intentar crear el pedido de producto: ${error}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updatePedidoProducto(id: number, pedidoDto: pedidoProductoDto): Promise<PedidoProducto> {
        try {
            let pedidoProductoActualizar: PedidoProducto = await this.getPedidoProductoById(id);
            if (pedidoProductoActualizar) {
                pedidoProductoActualizar.cantidad = pedidoDto.cantidad;
                pedidoProductoActualizar.pedido= pedidoDto.pedido;
                pedidoProductoActualizar.producto= pedidoDto.producto;
                await this.pedidoProductoRepository.save(pedidoProductoActualizar);
                return pedidoProductoActualizar;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                // Si el error es de tipo HttpException, simplemente relanzamos el error
                throw error;
            } else if (error instanceof ConflictException) {
                // Si el error es de tipo ConflictException, lanzamos una excepción HTTP con el mismo mensaje
                throw new HttpException({
                    status: HttpStatus.CONFLICT,
                    error: error.message,
                }, HttpStatus.CONFLICT);
            } else {
                // En caso de cualquier otro error, lanzamos una excepción HTTP genérica
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `Error al intentar crear el pedido de producto: ${error}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async updatePedidoProductoUser(id: number, pedidoDto: pedidoProductoDto, idUser:number): Promise<PedidoProducto> {
        try {
            const pedido: Pedido= await this.pedidoServicio.getPedidoByIdUser(Number(pedidoDto.pedido), idUser);
            
            let pedidoProductoActualizar: PedidoProducto = await this.getPedidoProductoByIdUser(id, idUser);
            
            if (pedidoProductoActualizar) {
                pedidoProductoActualizar.cantidad = pedidoDto.cantidad;
                pedidoProductoActualizar.pedido= pedidoDto.pedido;
                pedidoProductoActualizar.producto= pedidoDto.producto;
                await this.pedidoProductoRepository.save(pedidoProductoActualizar);
                return pedidoProductoActualizar;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                // Si el error es de tipo HttpException, simplemente relanzamos el error
                throw error;
            } else if (error instanceof ConflictException) {
                // Si el error es de tipo ConflictException, lanzamos una excepción HTTP con el mismo mensaje
                throw new HttpException({
                    status: HttpStatus.CONFLICT,
                    error: error.message,
                }, HttpStatus.CONFLICT);
            } else {
                // En caso de cualquier otro error, lanzamos una excepción HTTP genérica
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `Error al intentar crear el pedido de producto: ${error}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
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

    async softEliminarPedidoProducto(id:number): Promise <Boolean> {
        // Busco el producto
        const pedidoExists: PedidoProducto = await this.getPedidoProductoById(id);   
        // Si el producto esta borrado, lanzamos una excepcion
        if(pedidoExists.deleted){
            throw new ConflictException('El pedido ya fue borrado con anterioridad');
        }
        // Actualizamos la propiedad deleted
    const rows: UpdateResult = await this.pedidoProductoRepository.update(
        { id:id },
        { deleted: true }
    );
    // Si afecta a un registro, devolvemos true
    return rows.affected == 1;
}

async softEliminarPedidoProductoUser(id:number, idUser:number): Promise <Boolean> {
    // Busco el producto
    const pedidoExists: PedidoProducto = await this.getPedidoProductoByIdUser(id, idUser);
    // Si el producto esta borrado, lanzamos una excepcion
    if(pedidoExists.deleted){
        throw new ConflictException('El pedido ya fue borrado con anterioridad');
    }
    // Actualizamos la propiedad deleted
const rows: UpdateResult = await this.pedidoProductoRepository.update(
    { id:id },
    { deleted: true }
);
// Si afecta a un registro, devolvemos true
return rows.affected == 1;
}

async softReactvarPedidoProducto(id:number): Promise <Boolean> {
    // Busco el producto
    const pedidoExists: PedidoProducto = await this.getPedidoProductoById(id);
    // Si el producto esta borrado, lanzamos una excepcion
    if(!pedidoExists.deleted){
        throw new ConflictException('El pedido ya fue activado con anterioridad');
    }
    // Actualizamos la propiedad deleted
const rows: UpdateResult = await this.pedidoProductoRepository.update(
    { id:id },
    { deleted: false }
);
// Si afecta a un registro, devolvemos true
return rows.affected == 1;
}


}
