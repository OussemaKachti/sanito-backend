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

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) throw new NotFoundException('User not found');
      return this.generateTokens(user);
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    // TODO: Invalidate token or add to blacklist
    await this.userRepository.save(user);
    return { message: 'Logged out successfully' };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) throw new BadRequestException('Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async resetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'reset' },
      { expiresIn: '15m' }
    );
    // TODO: Send email with reset token
    return { resetToken, message: 'Reset token sent to email' };
  }

  async verifyResetToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'reset') throw new BadRequestException('Invalid token type');
      return { valid: true, userId: payload.sub };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async enableTwoFactor(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // TODO: Generate TOTP secret and return QR code
    const secret = require('speakeasy').generateSecret({
      name: `SANITIO (${user.email})`,
      issuer: 'SANITIO',
    });

    return { secret: secret.base32, qrCode: secret.qr_code_url };
  }

  async verifyTwoFactor(userId: string, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // TODO: Verify TOTP code against stored secret
    const verified = require('speakeasy').totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (!verified) throw new BadRequestException('Invalid 2FA code');
    
    user.twoFactorEnabled = true;
    await this.userRepository.save(user);
    return { message: '2FA enabled successfully' };
  }
}
