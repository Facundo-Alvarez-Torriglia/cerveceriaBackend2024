import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo')
export class Tipo {
    @PrimaryGeneratedColumn()
    idTipo: number;

    @Column({ length: 55})
    nombre:string;

    constructor( nombre:string ){
        this.nombre= nombre;
    }
}