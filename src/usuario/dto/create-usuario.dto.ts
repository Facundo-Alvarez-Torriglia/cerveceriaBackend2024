import { IsEmail, IsNumber, IsString } from "class-validator";

export class UsuarioDto {
    @IsString()
    name:string;

    @IsString()
    lastname:string;
    
    @IsString()
    username:string;
    
    @IsNumber()
    age:number

    @IsString()
    direccion:string;
    
    
    @IsEmail()
    email:string;

    @IsString()
    password:string;

    

}
