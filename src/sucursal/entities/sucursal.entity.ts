import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sucursal')
export class Sucursal {
@PrimaryGeneratedColumn()
id:number

@Column()
nombre:string

@Column({nullable:true})
direccion: string

@Column({
    nullable:true
})
telefono:string

@Column({nullable:true})
email: string

@Column({nullable:true})
instagram:string

@Column({nullable:true})
facebook:string

@Column()
imagen:string

@Column({ type: Boolean, nullable: false, default: false })
deleted?: boolean;

constructor(nombre: string,direccion:string,telefono:string,email:string, instagram:string,facebook:string, imagen:string){

this.nombre = nombre;
this.direccion = direccion;
this.telefono =telefono;
this.email = email;
this.instagram = instagram;
this.facebook = facebook;
this.imagen = imagen
}
}
