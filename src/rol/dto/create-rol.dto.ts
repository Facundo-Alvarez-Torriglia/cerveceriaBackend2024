import { IsString } from "class-validator";
import { Role } from "../Rol enum/role decorador/rol.enum";

export class RolDto {
    @IsString()
    role:Role[]
}
