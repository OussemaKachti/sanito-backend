import { Controller, Get, Post, Body, Param, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlertDto: any) {
    return this.alertsService.create(createAlertDto);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.alertsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Patch(':id/acknowledge')
  acknowledge(@Param('id') id: string, @CurrentUser() user: any) {
    return this.alertsService.acknowledge(id, user.sub);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.alertsService.resolve(id, user.sub, body.notes);
  }
}
