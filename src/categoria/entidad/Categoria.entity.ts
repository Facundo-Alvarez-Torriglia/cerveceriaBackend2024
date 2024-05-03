import { Producto } from "src/producto/entidad/Producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categoria')
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column()
    nombre:string;

    @OneToMany(()=> Producto, producto => producto.categoria)
    productos:Producto [];

    @Column({ type: Boolean, nullable: false, default: false })
    deleted?: boolean;
    
    constructor(nombre:string){
        this.nombre=nombre;
    }
}