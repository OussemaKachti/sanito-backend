import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EquipmentMaintenanceService } from './equipment-maintenance.service';
import { EquipmentMaintenance } from './entities/equipment-maintenance.entity';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('equipment-maintenance')
@UseGuards(JwtAuthGuard)
export class EquipmentMaintenanceController {
  constructor(private readonly service: EquipmentMaintenanceService) {}

  @Post()
  create(@Body() data: Partial<EquipmentMaintenance>): Promise<EquipmentMaintenance> {
    return this.service.create(data);
  }

  @Get()
  findAll(): Promise<EquipmentMaintenance[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EquipmentMaintenance | null> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<EquipmentMaintenance>,
  ): Promise<EquipmentMaintenance | null> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
