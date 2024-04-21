import { IsString } from "class-validator";

export class DtoCategoria {
    @IsString()
    nombre:string;
}