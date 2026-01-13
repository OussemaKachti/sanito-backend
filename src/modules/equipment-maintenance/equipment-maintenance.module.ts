import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentMaintenance } from './entities/equipment-maintenance.entity';
import { EquipmentMaintenanceService } from './equipment-maintenance.service';
import { EquipmentMaintenanceController } from './equipment-maintenance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentMaintenance])],
  controllers: [EquipmentMaintenanceController],
  providers: [EquipmentMaintenanceService],
  exports: [EquipmentMaintenanceService],
})
export class EquipmentMaintenanceModule {}
