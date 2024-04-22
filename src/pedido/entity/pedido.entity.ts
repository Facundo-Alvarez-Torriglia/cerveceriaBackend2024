import { Column, Entity, PrimaryGeneratedColumn,  } from "typeorm";


@Entity()
export class Pedido {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: Date, nullable: false })
    fecha: Date;

    @Column({ type: Number, nullable: false, default: 0 })
    detalle: number;
}
