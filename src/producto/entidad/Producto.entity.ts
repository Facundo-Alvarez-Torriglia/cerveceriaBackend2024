import { Categoria } from "src/categoria/entidad/Categoria.entity";
import { Tipo } from "src/tipo/entidad/Tipo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('producto')
export class Producto {
    @PrimaryGeneratedColumn()
    idProducto:number;
    @Column({ length: 140 })
    titulo:string;
    @Column()
    img:string;
    @Column()
    descripcion:string;
    @Column()
    ingredientes:string;
    @Column()
    price:number;
    @Column()
    valoracion:number;

    @ManyToOne(()=> Categoria, categoria => categoria.productos)
    @JoinColumn({name: "idCategoria"})
    categoria:Categoria;

    @ManyToOne(()=>Tipo, tipo => tipo.productos)
    @JoinColumn({ name: "idTipo" })
    tipo:Tipo;

    constructor(titulo:string, img:string,descripcion:string,ingredientes:string,price:number,valoracion:number,categoria:Categoria,tipo:Tipo) {
        this.titulo=titulo;
        this.img=img;
        this.descripcion=descripcion;
        this.ingredientes=ingredientes;
        this.price=price;
        this.valoracion=valoracion;
        this.categoria=categoria;
        this.tipo=tipo;
    }
}