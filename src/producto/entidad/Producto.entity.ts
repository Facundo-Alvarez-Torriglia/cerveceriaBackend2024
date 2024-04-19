import { Categoria } from "src/categoria/entidad/Categoria.entity";
import { Tipo } from "src/tipo/entidad/Tipo.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    @Column( {length:20} )
    price:number;
    @Column({ length:2} )
    valoracion:number;

    @OneToMany(()=> Categoria, categoria => categoria.productos)
    @JoinColumn({name: "idCategoria"})
    categoria:Categoria;

    @OneToMany(()=>Tipo, tipo => tipo.productos)
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