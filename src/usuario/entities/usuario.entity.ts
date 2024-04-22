import { Reserva } from "src/reservas/entities/Reserva.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    lastname: string

    @Column()
    username: string

    @Column()
    age: number

    @Column()
    direccion: string

    @Column()
    email: string

    @Column()
    password: string


    @ManyToOne(() => Reserva, reserva => reserva.usuario)
    @JoinColumn({ name: "idReserva" })
    reservas: Reserva;

    constructor( name: string, lastname: string, username: string, email: string, password: string, age: number, direccion: string) {
        
        this.name = name;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
        this.direccion = direccion;
    }
}
