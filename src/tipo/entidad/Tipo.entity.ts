import { Producto } from "src/producto/entidad/Producto.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo')
export class Tipo {
    @PrimaryGeneratedColumn()
    idTipo: number;

    @Column({ length: 55})
    nombre:string;

    @ManyToOne(()=> Producto, producto => producto.tipo)
    productos:Producto [];

    constructor( nombre:string ){
        this.nombre= nombre;
    }
}