import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sucursal')
export class Sucursal {
@PrimaryGeneratedColumn()
id:number

@Column()
nombre:string

@Column({nullable:true})
direccion: string

@Column()
telefono:string

@Column()
imagen:string

@Column({ type: Boolean, nullable: false, default: false })
deleted?: boolean;

constructor(nombre: string,direccion:string,telefono:string, imagen:string){

this.nombre = nombre;
this.direccion = direccion;
this.telefono =telefono;
this.imagen = imagen
}
}
