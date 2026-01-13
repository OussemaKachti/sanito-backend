import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Public } from '@common/decorators/public.decorator';

@Controller('rfid')
export class RfidController {
  constructor(private readonly rfidService: RfidService) {}

  @Post('scan')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  processScan(@Body() rfidScanDto: any) {
    return this.rfidService.processScan(rfidScanDto);
  }

  @Get('scans')
  @UseGuards(JwtAuthGuard)
  findAllScans() {
    return this.rfidService.findAllScans();
  }

  @Get('location/:rfidId')
  @UseGuards(JwtAuthGuard)
  getCurrentLocation(@Param('rfidId') rfidId: string) {
    return this.rfidService.getCurrentLocation(rfidId);
  }

  @Get(':rfidId')
  @UseGuards(JwtAuthGuard)
  findByRfidId(@Param('rfidId') rfidId: string) {
    return this.rfidService.findByRfidId(rfidId);
  }
}
