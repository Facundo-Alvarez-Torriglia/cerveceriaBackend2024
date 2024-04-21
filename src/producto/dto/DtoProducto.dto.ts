import { IsNumber, IsString } from "class-validator";
import { Categoria } from "src/categoria/entidad/Categoria.entity";
import { Tipo } from "src/tipo/entidad/Tipo.entity";

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
    categoria:Categoria;
    tipo:Tipo;
}