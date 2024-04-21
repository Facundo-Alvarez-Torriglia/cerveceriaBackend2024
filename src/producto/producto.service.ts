import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entidad/Producto.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DtoProducto } from './dto/DtoProducto.dto';
import { Categoria } from 'src/categoria/entidad/Categoria.entity';
import { CategoriaService } from 'src/categoria/categoria.service';
import { TipoService } from 'src/tipo/tipo.service';
import { Tipo } from 'src/tipo/entidad/Tipo.entity';

@Injectable()
export class ProductoService {
    constructor(@InjectRepository(Producto) private readonly productoRepository: Repository <Producto>,
                @Inject(CategoriaService) private readonly categoriaService: CategoriaService,
                @Inject(TipoService) private readonly tipoService: TipoService) {}

    async getProductos(): Promise <Producto[]> {
        try {
            const criterio : FindManyOptions = { relations: ['categoria', 'tipo']};
            const productos: Producto[] = await this.productoRepository.find(criterio);
            if(productos) return productos;
            throw new NotFoundException(`No hay productos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los productos en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getProductoById(id:number): Promise <Producto>{
        try {
            const criterio: FindOneOptions = { 
                relations: ['categoria', 'tipo'],
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
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar crear el producto de nombre ${datos.titulo} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

   async actualizarProducto(id:number, datos:DtoProducto): Promise <Producto> {
        try {
            await this.comprobacionProducto(datos);
            let productoActualizar: Producto = await this.getProductoById(id);
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
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar el producto de ${id} con el nombre ${datos.titulo} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async eliminarProducto(id:number): Promise <Boolean> {
        try {
            const productoEliminar: Producto = await this.getProductoById(id);
            if (productoEliminar) {
               await this.productoRepository.remove(productoEliminar);
               return true; 
            }
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar eliminar el producto de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }
}
