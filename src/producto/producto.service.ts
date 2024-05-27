import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entidad/Producto.entity';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { DtoProducto } from './dto/DtoProducto.dto';

@Injectable()
export class ProductoService {
    constructor(@InjectRepository(Producto) private readonly productoRepository: Repository <Producto>) {}

    async getProductosAdmin(): Promise <Producto[]> {
        try {
            const criterio : FindManyOptions = { relations: ['categoria', 'tipo', 'pedidoProductos', 'pedidoProductos.pedido.usuario']};
            const productos: Producto[] = await this.productoRepository.find(criterio);
            if(productos) return productos;
            throw new NotFoundException(`No hay productos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los productos en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getProductos(): Promise <Producto[]> {
        try {
            const criterio : FindManyOptions = { 
                relations: ['categoria', 'tipo'],
                where: { deleted: false}
            };
            const productos: Producto[] = await this.productoRepository.find(criterio);
            if(productos) return productos;
            throw new NotFoundException(`No hay productos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los productos en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getProductoByIdAdmin(id:number): Promise <Producto>{
        try {
            const criterio: FindOneOptions = { 
                relations: ['categoria', 'tipo','pedidoProductos', 'pedidoProductos.pedido.usuario'],
                where: { idProducto: id }
            }
            const producto: Producto = await this.productoRepository.findOne(criterio);
            if(producto) return producto;
            throw new NotFoundException(`No se encontre un producto con el id ${id}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el producto de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getProductoById(id:number): Promise <Producto>{
        try {
            const criterio: FindOneOptions = { 
                relations: ['categoria', 'tipo'],
                where: { 
                    idProducto: id,
                    deleted: false
                 }
            }
            const producto: Producto = await this.productoRepository.findOne(criterio);
            if(producto) return producto;
            throw new NotFoundException(`No se encontre un producto con el id ${id}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el producto de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    private async comprobacionProducto(datos:DtoProducto): Promise <void> {
        if(!datos.titulo || !datos.img || !datos.descripcion || !datos.ingredientes || !datos.price){
            throw new BadRequestException(`No puede tener campos vacíos`);
        }
        const existente:Producto = await this.productoRepository.findOne({where:{titulo:datos.titulo}});
        if (existente) {
            throw new ConflictException(`El nombre ingresado ya existe en la base de datos`);
        }
    }

    async crearProducto(datos:DtoProducto): Promise <Producto> {
        try {
            await this.comprobacionProducto(datos);
            const nuevoProducto: Producto = await this.productoRepository.save(new Producto(
                datos.titulo, datos.img, datos.descripcion, datos.ingredientes, datos.price, datos.valoracion, datos.categoria, datos.tipo));
            if (nuevoProducto) return nuevoProducto;            
            throw new NotFoundException(`No se pudo crear el producto con nombre ${datos.titulo}`);
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
                    error: `Error al intentar crear el producto de nombre ${datos.titulo} en la base de datos; ${error}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

   async actualizarProducto(id:number, datos:DtoProducto): Promise <Producto> {
        try {
            let productoActualizar: Producto = await this.getProductoByIdAdmin(id);
            if (productoActualizar) {
                productoActualizar.titulo=datos.titulo;
                productoActualizar.img=datos.img;
                productoActualizar.descripcion=datos.descripcion;
                productoActualizar.ingredientes=datos.ingredientes;
                productoActualizar.price=datos.price;
                productoActualizar.valoracion=datos.valoracion;
                productoActualizar.categoria=datos.categoria;
                productoActualizar.tipo=datos.tipo;
                productoActualizar = await this.productoRepository.save(productoActualizar);
                return productoActualizar;
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
                    error: `Error al intentar actualizar el producto de ${id} con el nombre ${datos.titulo} en la base de datos; ${error}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }/*catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar el producto de ${id} con el nombre ${datos.titulo} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }*/
    }

    async softEliminarProducto(id:number): Promise <Boolean> {
        // Busco el producto
            const productoExist: Producto = await this.getProductoByIdAdmin(id);
            // Si el producto esta borrado, lanzamos una excepcion
            if (productoExist.deleted) {
                throw new ConflictException('El producto ya fue borrado con anterioridad');
            }
        // Actualizamos la propiedad deleted
        const rows: UpdateResult = await this.productoRepository.update(
            { idProducto:id },
            { deleted: true }
        );
        // Si afecta a un registro, devolvemos true
        return rows.affected == 1;
    }

    async softReactivarProducto(id:number): Promise <Boolean> {
        // Busco el producto
        const productoExists: Producto = await this.getProductoByIdAdmin(id);
        // Si el producto esta borrado, lanzamos una excepcion
        if(!productoExists.deleted){
            throw new ConflictException('El producto ya fue activado con anterioridad');
        }
        // Actualizamos la propiedad deleted
    const rows: UpdateResult = await this.productoRepository.update(
        { idProducto:id },
        { deleted: false }
    );
    // Si afecta a un registro, devolvemos true
    return rows.affected == 1;
}
}
