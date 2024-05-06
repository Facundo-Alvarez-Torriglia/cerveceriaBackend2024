import { IsString } from "class-validator";
import { MetodoPagoTipo } from "../metodoPagoEnum/metodoPago.enum";
import { Usuario } from "src/usuario/entities/usuario.entity";


export class MetodoPagoDto {
    
    @IsString()
    metodoPago:MetodoPagoTipo

    usuario:Usuario;
}