import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() body: { email: string; password: string; firstName: string; lastName: string },
  ) {
    return this.authService.register(body.email, body.password, body.firstName, body.lastName);
  }

  @Public()
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }

  @Public()
  @Post('verify-token')
  async verifyToken(@Body() body: { token: string }) {
    return this.authService.verifyToken(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(user.id, body.oldPassword, body.newPassword);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string }) {
    return this.authService.resetPassword(body.email);
  }

  @Public()
  @Post('verify-reset-token')
  async verifyResetToken(@Body() body: { token: string }) {
    return this.authService.verifyResetToken(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  async enableTwoFactor(@CurrentUser() user: any) {
    return this.authService.enableTwoFactor(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-2fa')
  async verifyTwoFactor(@CurrentUser() user: any, @Body() body: { code: string }) {
    return this.authService.verifyTwoFactor(user.id, body.code);
  }
}
