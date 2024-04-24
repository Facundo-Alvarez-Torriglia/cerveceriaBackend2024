import { Pedido } from "src/pedido/entity/pedido.entity";
import { Reserva } from "src/reservas/entities/Reserva.entity";
import { Role } from "src/rol/rol.enum";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    username: string;

    @Column()
    age: number;

    @Column()
    direccion: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: string;

    @OneToMany(() => Reserva, reserva => reserva.usuario)
    @JoinColumn({ name: "idReserva" })
    reservas: Reserva[];

    @OneToMany(()=> Pedido, pedido=> pedido.usuario )
    pedidos: Pedido[];
    

    constructor(name: string, lastname: string, username: string, email: string, password: string, age: number, direccion: string, role: Role) {
        this.name = name;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
        this.direccion = direccion;
        this.role = role;
    }
}