import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Usuario } from '../users/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}
  async validate(email: string, password: string): Promise<Usuario> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales invalidas');
    const ok = await this.users.verifyPassword(user, password);
    if (!ok) throw new UnauthorizedException('Credenciales invalidas');
    return user;
  }
  sign(user: Usuario) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}
