import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/rol/rol.enum';


@Injectable()
export class AuthService {
    constructor(private usersService: UsuarioService, private jwtService: JwtService) {}

    async signIn(email: string, pass: string, rol: Role): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneUser(email);
        if (!user || user.password !== pass) {
            throw new UnauthorizedException();
        }
              
           const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}