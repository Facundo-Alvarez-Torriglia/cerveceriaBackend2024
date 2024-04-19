import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tipo } from './entidad/Tipo.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { HttpAdapterHost } from '@nestjs/core';
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
                error: `Error al intentar leer los tipos en la base de datos ${error}`},
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
                error: `Error al intentar leer el tipo de id ${id} en la base de datos ${error}`},
                HttpStatus.NOT_FOUND);
        }
    }

    /*private async comprobacionTipo(datos:DtoTipo): Promise <Boolean> {
        if(datos){
            const tipo
        }
    }

    async crearTipo(datos:DtoTipo): Promise <Tipo> {
        
    }*/
}
