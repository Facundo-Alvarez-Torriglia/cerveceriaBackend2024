import { IsNotEmpty, IsNumber } from "class-validator";
import { Pedido } from "src/pedido/entity/pedido.entity";
import { Producto } from "src/producto/entidad/Producto.entity";

export class pedidoProductoDto {

    @IsNumber()
    @IsNotEmpty()
    cantidad: number;

    @IsNotEmpty()
    pedido: Pedido

    @IsNotEmpty()
    producto:Producto;
}