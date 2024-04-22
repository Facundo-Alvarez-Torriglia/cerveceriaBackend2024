import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PedidoDto {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsDate()
    @IsNotEmpty()
    fecha: Date;

    @IsString()
    @IsNotEmpty()
    detalle: string;
}
