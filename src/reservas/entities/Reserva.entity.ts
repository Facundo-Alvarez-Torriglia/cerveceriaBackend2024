import { MetodoPago } from "src/metodoPago/entities/MetodoPago.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('reserva')
export class Reserva {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: string

    @Column()
    hora: string

    @Column()
    cantidad: number

    @Column()
    numeroMesa: number

    @ManyToOne(() => Usuario, usuario => usuario.reservas)
    @JoinColumn({ name: "idUsuario" })
    usuario: Usuario;

    @ManyToOne(() => MetodoPago, metodoPago => metodoPago.reservas)
    @JoinColumn({ name: "idMetodoPago" })
    metodoPago: MetodoPago;

    constructor(fecha: string, hora: string, cantidad: number, numeroMesa: number) {
        this.fecha = fecha;
        this.hora = hora;
        this.cantidad = cantidad;
        this.numeroMesa = numeroMesa;
    }
}