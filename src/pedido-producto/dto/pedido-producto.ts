import { IsNotEmpty, IsNumber } from "class-validator";

export class pedidoDto {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    cantidad: number;
}