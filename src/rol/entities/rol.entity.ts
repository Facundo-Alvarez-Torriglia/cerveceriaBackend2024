import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../rol.enum";

@Entity('rol')
export class Rol {
@PrimaryGeneratedColumn()
id:number

@Column()
role:Role
}
