import { MetodoPago } from "src/metodoPago/entities/MetodoPago.entity";
import { PedidoProducto } from "src/pedido-producto/entity/pedido-producto";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,  } from "typeorm";


@Entity()
export class Pedido {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: Date, nullable: false })
    fecha: Date;

    @Column({ type: String, nullable: false })
    detalle: string;

    @ManyToOne(()=>Usuario, usuario => usuario.pedidos)
    @JoinColumn({name: "idUsuario"})
    usuario:Usuario;

    @OneToMany(()=>PedidoProducto, pedProd=> pedProd.pedido)
    pedidosProducto: PedidoProducto[];

    @ManyToOne(() => MetodoPago, metodoPago => metodoPago.pedidos)
    @JoinColumn({ name: "idMetodoPago" })
    metodoPago: MetodoPago;
}
