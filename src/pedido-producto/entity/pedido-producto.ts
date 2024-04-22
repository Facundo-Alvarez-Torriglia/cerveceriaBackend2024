import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";


@Entity()
export class PedidoProducto {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: Number, nullable: false, default: 0 })
    cantidad: number;
}
