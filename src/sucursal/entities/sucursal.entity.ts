import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sucursal')
export class Sucursal {
@PrimaryGeneratedColumn()
id:number

@Column()
nombre:string

@Column()
dirección: string

@Column()
telefono:string

@Column()
imagen:string

constructor(id:number,nombre: string,direccion:string,telefono:string, imagen:string){
this.id = id;
this.nombre = nombre;
this.dirección = direccion;
this.telefono =telefono;
this.imagen = imagen
}
}
