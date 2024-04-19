import { Producto } from "src/producto/dto/DtoProducto.dto";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('categoria')
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column()
    nombre:string;

    @ManyToOne(()=> Producto, producto => producto.categoria)
    productos:Producto [];
}