import { Producto } from "src/producto/entidad/Producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo')
export class Tipo {
    @PrimaryGeneratedColumn()
    idTipo: number;

    @Column({ length: 55})
    nombre:string;

    @OneToMany(()=> Producto, producto => producto.tipo)
    productos:Producto [];

    constructor( nombre:string ){
        this.nombre= nombre;
    }
}