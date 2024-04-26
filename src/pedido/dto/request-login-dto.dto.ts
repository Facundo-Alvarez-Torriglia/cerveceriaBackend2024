import { Usuario } from "src/usuario/entities/usuario.entity";

export class RequestLoginDto{
    sub: Usuario;
    email: string;
    role: string;
    

}