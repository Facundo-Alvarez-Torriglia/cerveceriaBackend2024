import { IsString } from "class-validator";
import { Role } from "../rol.enum";

export class RolDto {
    @IsString()
    role:Role
}
