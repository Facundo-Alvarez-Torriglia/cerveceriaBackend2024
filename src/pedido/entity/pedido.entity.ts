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
}
