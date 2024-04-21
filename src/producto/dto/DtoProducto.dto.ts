import { IsNumber, IsString } from "class-validator";

export class DtoProducto {
    @IsString()
    titulo:string;
    @IsString()
    img:string;
    @IsString()
    descripcion:string;
    @IsString()
    ingredientes:string;
    @IsNumber()
    price:number;
    @IsNumber()
    valoracion:number;
    @IsNumber()
    categoria:number;
    @IsNumber()
    tipo:number;
}