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

    getUserFromRequest(request: Request): any {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
          return null; // No se proporcionó encabezado de autorización
        }
    
        // El encabezado de autorización debería tener el formato "Bearer token"
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException('Formato de token no válido');
        }
    
        try {
          // Decodificar el token JWT para obtener los datos del usuario
          const user = this.jwtService.verify(token);
          return user;
        } catch (error) {
          throw new UnauthorizedException('Token inválido');
        }
      }
}