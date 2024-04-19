import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tipo } from './entidad/Tipo.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { DtoTipo } from './dto/DtoTipo.dto';

@Injectable()
export class TipoService {
    constructor(@InjectRepository(Tipo) private readonly tipoRepository: Repository <Tipo>) {}

    async getTipos(): Promise <Tipo[]> {
        try {
            const criterio : FindManyOptions = { relations: ['productos']};
            const tipos: Tipo[] = await this.tipoRepository.find(criterio);
            if(tipos) return tipos;
            throw new NotFoundException(`No hay tipos registrados en la base de datos`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer los tipos en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async getTipoById(id:number): Promise <Tipo>{
        try {
            const criterio: FindOneOptions = { 
                relations: ['productos'],
                where: { idTipo: id }
            }
            const tipo: Tipo = await this.tipoRepository.findOne(criterio);
            if(tipo) return tipo;
            throw new NotFoundException(`No se encontre un tipo con el id ${id}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar leer el tipo de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    private async comprobacionTipo(datos:DtoTipo): Promise <void> {
        if(!datos.nombre){
            throw new BadRequestException(`El campo nombre no puede estar vacío`);
        }
        const existente:Tipo = await this.tipoRepository.findOne({where:{nombre:datos.nombre}});
        if (existente) {
            throw new ConflictException(`El nombre ingresado ya existe en la base de datos`);
        }
    }

    async crearTipo(datos:DtoTipo): Promise <Tipo> {
        try {
            await this.comprobacionTipo(datos);
            const nuevoTipo: Tipo = await this.tipoRepository.save(new Tipo(datos.nombre));
            if (nuevoTipo) return nuevoTipo;
            throw new NotFoundException(`No se pudo crear el tipo con nombre ${datos.nombre}`);
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar crear el tipo de nombre ${datos.nombre} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async actualizarTipo(id:number, datos:DtoTipo): Promise <Tipo> {
        try {
            await this.comprobacionTipo(datos);
            let tipoActualizar: Tipo = await this.getTipoById(id);
            if (tipoActualizar) {
                tipoActualizar.nombre=datos.nombre;
                tipoActualizar = await this.tipoRepository.save(tipoActualizar);
                return tipoActualizar;
            }
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar actualizar el tipo de ${id} con el nombre ${datos.nombre} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    async eliminarTipo(id:number): Promise <Boolean> {
        try {
            const tipoEliminar: Tipo = await this.getTipoById(id);
            if (tipoEliminar) {
               await this.tipoRepository.remove(tipoEliminar);
               return true; 
            }
        } catch (error) {
            throw new HttpException({ status: HttpStatus.NOT_FOUND,
                error: `Error al intentar eliminar el tipo de id ${id} en la base de datos; ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }
}
