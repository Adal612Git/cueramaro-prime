import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, UserRole } from './entities/usuario.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Usuario) private usersRepo: Repository<Usuario>) {}

  async count(): Promise<number> { return this.usersRepo.count(); }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(email: string, password: string, role: UserRole = 'ADMIN'): Promise<Usuario> {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Email ya registrado');
    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password_hash: hash, role });
    return this.usersRepo.save(user);
  }

  async verifyPassword(user: Usuario, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  async getOrThrow(id: number): Promise<Usuario> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}
