import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entidad/Categoria.entity';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { DtoCategoria } from './dto/DtoCategoria.dto';

@Injectable()
export class CategoriaService {
    constructor(@InjectRepository(Categoria) private readonly categoriaRepository: Repository <Categoria>) {}

    async getCategorias(): Promise <Categoria[]> {
        try {            
            const criterio : FindManyOptions = { relations: ['productos']};
            const categorias: Categoria[] = await this.categoriaRepository.find(criterio);
            if(categorias) return categorias;
            throw new NotFoundException(`No hay categorias registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los categorias en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getCategoriasActivas(): Promise <Categoria[]> {
        try {
            const criterio : FindManyOptions = { relations: ['productos'], where:{deleted:false}};
            const categorias: Categoria[] = await this.categoriaRepository.find(criterio);
            if(categorias) return categorias;
            throw new NotFoundException(`No hay categorias registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los categorias en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getCategoriaById(id:number): Promise <Categoria>{
        try {
            const criterio: FindOneOptions = { 
                relations: ['productos'],
                where: { idCategoria: id }
            }
            const categoria: Categoria = await this.categoriaRepository.findOne(criterio);
            if(categoria) return categoria;
            throw new NotFoundException(`No se encontro la categoria con el id ${id}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el categoria de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getCategoriaByIdActivo(id:number): Promise <Categoria>{
        try {
            const criterio: FindOneOptions = { 
                relations: ['productos'],
                where: { idCategoria: id}
            }
            const categoria: Categoria = await this.categoriaRepository.findOne(criterio);
            if(categoria&& !categoria.deleted) return categoria;
            throw new NotFoundException(`No se encontre un categoria con el id ${id}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el categoria de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    private async comprobacionCategoria(datos:DtoCategoria): Promise <void> {
        if(!datos.nombre){
            throw new BadRequestException(`El campo nombre no puede estar vacío`);
        }
        const existente:Categoria = await this.categoriaRepository.findOne({where:{nombre:datos.nombre}});
        if (existente) {
            throw new ConflictException(`El nombre ingresado ya existe en la base de datos`);
        }
    }

    async crearCategoria(datos:DtoCategoria): Promise <Categoria> {
        try {
            await this.comprobacionCategoria(datos);
            const nuevoCategoria: Categoria = await this.categoriaRepository.save(new Categoria(datos.nombre));
            if (nuevoCategoria) return nuevoCategoria;
            throw new NotFoundException(`No se pudo crear el categoria con nombre ${datos.nombre}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar crear el categoria de nombre ${datos.nombre} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async actualizarCategoria(id:number, datos:DtoCategoria): Promise <Categoria> {
        try {
            await this.comprobacionCategoria(datos);
            let categoriaActualizar: Categoria = await this.getCategoriaById(id);
            if (categoriaActualizar) {
                categoriaActualizar.nombre=datos.nombre;
                categoriaActualizar = await this.categoriaRepository.save(categoriaActualizar);
                return categoriaActualizar;
            }
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar el categoria de ${id} con el nombre ${datos.nombre} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async eliminarCategoria(id:number): Promise <Boolean> {
        try {
            const categoriaEliminar: Categoria = await this.getCategoriaById(id);
            if (categoriaEliminar) {
               await this.categoriaRepository.remove(categoriaEliminar);
               return true; 
            }
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar eliminar el categoria de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async softEliminarCategoria(id:number): Promise <Boolean> {
            // Busco el producto
            const categoriaExists: Categoria = await this.getCategoriaById(id);   
            // Si el producto esta borrado, lanzamos una excepcion
            if(categoriaExists.deleted){
                throw new ConflictException('La categoría ya fue borrada con anterioridad');
            }
            // Actualizamos la propiedad deleted
        const rows: UpdateResult = await this.categoriaRepository.update(
            { idCategoria:id },
            { deleted: true }
        );
        // Si afecta a un registro, devolvemos true
        return rows.affected == 1;
    }

    async softReactvarCategoria(id:number): Promise <Boolean> {
        // Busco el producto
        const categoriaExists: Categoria = await this.getCategoriaById(id);
        // Si el producto esta borrado, lanzamos una excepcion
        if(!categoriaExists.deleted){
            throw new ConflictException('La categoría ya fue activado con anterioridad');
        }
        // Actualizamos la propiedad deleted
    const rows: UpdateResult = await this.categoriaRepository.update(
        { idCategoria:id },
        { deleted: false }
    );
    // Si afecta a un registro, devolvemos true
    return rows.affected == 1;
}
}
