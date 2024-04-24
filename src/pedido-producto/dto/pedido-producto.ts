import { IsNotEmpty, IsNumber } from "class-validator";

export class pedidoProductoDto {

    @IsNumber()
    @IsNotEmpty()
    id?: number;

    @IsNumber()
    @IsNotEmpty()
    cantidad: number;

}