import { IsNumber, IsString } from "class-validator";
import { MetodoPago } from "src/metodoPago/entities/MetodoPago.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";


export class ReservaDto {
    @IsString()
    fecha: string;

    @IsString()
    hora: string;

    @IsNumber()
    cantidad: number;

    @IsNumber()
    numeroMesa: number; 

    @IsNumber()
    idUsuario: number;

    @IsNumber()
    idMetodoPago: number;
}