import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class Usuario {
@PrimaryGeneratedColumn()
id:number;

@Column()
name:string

@Column()
lastname:string

@Column()
username:string

@Column()
email:string

@Column()
password:string

@Column()
age:number

@Column()
direccion:string

constructor(id:number,name:string,lastname:string,username:string,email:string,password:string,age:number,direccion:string){
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.username = username;
    this.email= email;
    this.password = password;
    this.age = age;
    this.direccion = direccion;
}
}
