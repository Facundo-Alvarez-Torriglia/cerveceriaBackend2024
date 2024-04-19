import { IsString } from "class-validator";

export class Categoria {
    @IsString()
    nombre:string;
}