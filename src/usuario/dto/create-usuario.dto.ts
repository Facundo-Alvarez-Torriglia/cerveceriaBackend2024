import { IsEmail, IsNumber, IsString } from "class-validator";
import { Pedido } from "src/pedido/entity/pedido.entity";
import { Reserva } from "src/reservas/entities/Reserva.entity";
import { Role } from "src/rol/rol.enum";


export class UsuarioDto {
    @IsString()
    name: string;

    @IsString()
    lastname: string;
    
    @IsString()
    username: string;
    
    @IsNumber()
    age: number;

    @IsString()
    direccion: string;
    
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: Role;

}
