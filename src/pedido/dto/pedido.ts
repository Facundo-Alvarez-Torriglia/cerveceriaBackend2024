import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MetodoPago } from "src/metodoPago/entities/MetodoPago.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";

export class PedidoDto {

    @IsDate()
    @IsNotEmpty()
    fecha: Date;

    @IsString()
    @IsNotEmpty()
    detalle: string;

    @IsNotEmpty()
    usuario:Usuario;

    @IsNotEmpty()
    metodoPago: MetodoPago;
}
