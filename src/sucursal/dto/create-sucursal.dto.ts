import { IsString } from "class-validator"


export class SucursalDto {
@IsString()
nombre:string;

@IsString()
direccion:number;

@IsString()
telefono:string;

@IsString()
imagen:string

}
