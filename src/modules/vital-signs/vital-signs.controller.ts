import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VitalSignsService } from './vital-signs.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('vital-signs')
@UseGuards(JwtAuthGuard)
export class VitalSignsController {
  constructor(private readonly vitalSignsService: VitalSignsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVitalSignDto: any) {
    return this.vitalSignsService.create(createVitalSignDto);
  }

  @Get()
  findAll() {
    return this.vitalSignsService.findAll();
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.vitalSignsService.findByPatient(patientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vitalSignsService.findOne(id);
  }
}
