import { Controller, Post, Body, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService, private jwt: JwtService) {}
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (!dto.email || !dto.password) throw new BadRequestException('email y password requeridos');
    const role = dto.role || 'ADMIN';
    const u = await this.users.create(dto.email, dto.password, role as any);
    return { ok: true, id: u.id, email: u.email, role: u.role };
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validate(dto.email, dto.password);
    return this.auth.sign(user);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) { return { ok: true, user: req.user }; }
  @Get('admin-ping')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminPing() { return { ok: true, scope: 'ADMIN' }; }
}
