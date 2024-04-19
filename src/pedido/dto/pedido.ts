import { IsNotEmpty, IsNumber } from "class-validator";

export class pedidoDto {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    idProducto: number;

    @IsNumber()
    @IsNotEmpty()
    idUsuario: number;

    @IsDate()
    @IsNotEmpty()
    fecha: Date;

    @IsNumber()
    @IsNotEmpty()
    idMetodo: number;

    @IsString()
    @IsNotEmpty()
    detalle: string;
}
