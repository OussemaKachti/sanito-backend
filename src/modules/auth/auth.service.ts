import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(email: string, password: string, firstName: string, lastName: string) {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new BadRequestException('Invalid password');

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION') || '24h';
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: expiresIn as any,
    });
    return { accessToken, user };
  }

  async validateUser(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
}
