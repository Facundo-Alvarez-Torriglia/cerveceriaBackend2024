import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../Rol enum/role decorador/rol.enum";

@Entity('rol')
export class Rol {
@PrimaryGeneratedColumn()
id:number

@Column()
role:string
}
