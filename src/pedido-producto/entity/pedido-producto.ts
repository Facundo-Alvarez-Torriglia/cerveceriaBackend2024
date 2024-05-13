import { Pedido } from "src/pedido/entity/pedido.entity";
import { Producto } from "src/producto/entidad/Producto.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn  } from "typeorm";


@Entity()
export class PedidoProducto {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: Number, nullable: false, default: 0 })
    cantidad: number;

    @Column({ type: Boolean, nullable: false, default: false })
    deleted?: boolean;

    @ManyToOne(()=> Pedido, pedido=> pedido.pedidosProducto)
    @JoinColumn({name:"idPedido"})
    pedido: Pedido;

    @ManyToOne(()=> Producto, producto=> producto.pedidoProductos)
    @JoinColumn({ name:"idProducto" })
    producto:Producto;
}
