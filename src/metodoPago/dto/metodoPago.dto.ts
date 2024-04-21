import { IsString } from "class-validator";
import { MetodoPagoTipo } from "../metodoPagoEnum/metodoPago.enum";


export class MetodoPagoDto {
    
    @IsString()
    metodoPago:MetodoPagoTipo
}