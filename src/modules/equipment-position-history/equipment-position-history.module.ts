import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentPositionHistory } from './entities/equipment-position-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentPositionHistory])],
  exports: [TypeOrmModule],
})
export class EquipmentPositionHistoryModule {}
