import { IsString } from "class-validator"


export class SucursalDto {
@IsString()
nombre:string;

@IsString()
direccion:string;

@IsString()
telefono:string;

@IsString()
imagen:string

}
