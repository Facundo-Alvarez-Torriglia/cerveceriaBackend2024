import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions, FindManyOptions, UpdateResult } from 'typeorm';
import { PedidoDto } from './dto/pedido';
import { Pedido } from './entity/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';


@Injectable()
export class PedidoService {
    constructor(@InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>) {}

    async getPedidos(): Promise<Pedido[]> {
        try {
            const criterio:FindManyOptions = {relations: ['usuario', 'pedidosProducto', 'metodoPago', 'pedidosProducto.producto']}
            const pedidos: Pedido[] = await this.pedidoRepository.find(criterio);
            if (pedidos.length > 0) return pedidos;
            throw new NotFoundException(`No hay pedidos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ 
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los pedidos en la base de datos: ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }

    async getPedidosUser(usuarioLog:number): Promise<Pedido[]> {
        try {
            console.log(`usuario logueado: ${usuarioLog}`);
            const criterio:FindManyOptions = {relations: ['usuario', 'pedidosProducto', 'metodoPago', 'pedidosProducto.producto'], 
            where:{usuario: { 
                id: usuarioLog 
            }, deleted:false}}
            const pedidos: Pedido[] = await this.pedidoRepository.find(criterio);
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
            const criterio: FindOneOptions = { relations: ['usuario','pedidosProducto', 'metodoPago', 'pedidosProducto.producto'],where: { id: id } };
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

    async getPedidoByIdUser(id: number, idUser:number): Promise<Pedido> {
        try {
            const criterio: FindOneOptions = { relations: ['usuario','pedidosProducto', 'metodoPago', 'pedidosProducto.producto'],
            where: { 
                id: id, 
                deleted:false 
            } };
            const pedido: Pedido = await this.pedidoRepository.findOne(criterio);
            if (pedido){
                if (pedido.usuario.id==idUser) return pedido;
                throw new ConflictException(`El usuario logueado ${idUser} es distinto del usuario dueño del pedido`)
            } 
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
            const nuevoPedido: Pedido = new Pedido(datos.fecha,datos.detalle, datos.usuario, datos.metodoPago);
            // Crear el pedido en la base de datos
            const pedidoGuardado: Pedido = await this.pedidoRepository.save(nuevoPedido);
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

    async actualizarPedido(id: number, datos: PedidoDto, usuario:number): Promise<Pedido> {
        try {
            const pedidoActualizar: Pedido = await this.getPedidoById(id);
            if (pedidoActualizar && pedidoActualizar.usuario.id==usuario) {
                //Object.assign(pedidoActualizar, datos);
                pedidoActualizar.fecha=datos.fecha;
                pedidoActualizar.detalle=datos.detalle;
                pedidoActualizar.usuario=datos.usuario;
                pedidoActualizar.metodoPago=datos.metodoPago;
                const pedidoActualizado: Pedido = await this.pedidoRepository.save(pedidoActualizar);
                return pedidoActualizado;
            } else {                
                throw new NotFoundException(`No puedes actualizar los pedidos de otros usuarios: usuario1 ${pedidoActualizar.usuario.id}, usuario2 ${usuario}`)
            }
        } catch (error) {
            throw new HttpException({ 
                status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar el pedido de id ${id} en la base de datos: ${error}`
            }, HttpStatus.NOT_FOUND);
        }
    }

    async actualizarPedidoAdmin(id: number, datos: PedidoDto): Promise<Pedido> {
        try {
            const pedidoActualizar: Pedido = await this.getPedidoById(id);
            if (pedidoActualizar) {
                //Object.assign(pedidoActualizar, datos);
                pedidoActualizar.fecha=datos.fecha;
                pedidoActualizar.detalle=datos.detalle;
                pedidoActualizar.usuario=datos.usuario;
                pedidoActualizar.metodoPago=datos.metodoPago;
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
    
    async eliminarPedidoUsser(id: number, idUser:number): Promise<boolean> {
        try {
            const pedidoEliminar: Pedido = await this.getPedidoByIdUser(id, idUser);
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

    async softEliminarPedido(id:number): Promise <Boolean> {
        // Busco el producto
        const pedidoExists: Pedido = await this.getPedidoById(id);   
        // Si el producto esta borrado, lanzamos una excepcion
        if(pedidoExists.deleted){
            throw new ConflictException('El pedido ya fue borrado con anterioridad');
        }
        // Actualizamos la propiedad deleted
    const rows: UpdateResult = await this.pedidoRepository.update(
        { id:id },
        { deleted: true }
    );
    // Si afecta a un registro, devolvemos true
    return rows.affected == 1;
}

async softEliminarPedidoUser(id:number, idUser:number): Promise <Boolean> {
    // Busco el producto
    const pedidoExists: Pedido = await this.getPedidoByIdUser(id, idUser);
    // Si el producto esta borrado, lanzamos una excepcion
    if(pedidoExists.deleted){
        throw new ConflictException('El pedido ya fue borrado con anterioridad');
    }
    // Actualizamos la propiedad deleted
const rows: UpdateResult = await this.pedidoRepository.update(
    { id:id },
    { deleted: true }
);
// Si afecta a un registro, devolvemos true
return rows.affected == 1;
}

async softReactvarPedido(id:number): Promise <Boolean> {
    // Busco el producto
    const pedidoExists: Pedido = await this.getPedidoById(id);
    // Si el producto esta borrado, lanzamos una excepcion
    if(!pedidoExists.deleted){
        throw new ConflictException('El pedido ya fue activado con anterioridad');
    }
    // Actualizamos la propiedad deleted
const rows: UpdateResult = await this.pedidoRepository.update(
    { id:id },
    { deleted: false }
);
// Si afecta a un registro, devolvemos true
return rows.affected == 1;
}

}





