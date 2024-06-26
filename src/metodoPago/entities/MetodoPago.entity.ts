import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { MetodoPagoTipo } from '../metodoPagoEnum/metodoPago.enum';
import { Reserva } from 'src/reservas/entities/Reserva.entity';
import { Pedido } from 'src/pedido/entity/pedido.entity';

@Entity()
export class MetodoPago {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: MetodoPagoTipo,
        default: MetodoPagoTipo.TarjetaCredito,
    })
    metodoPago: MetodoPagoTipo;

    @OneToMany(() => Reserva, reserva => reserva.metodoPago)
    reservas: Reserva[];

    @OneToMany(() => Pedido, pedido => pedido.metodoPago)
    pedidos: Pedido[];
  usuario: any;
}