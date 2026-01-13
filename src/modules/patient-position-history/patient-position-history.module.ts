import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPositionHistory } from './entities/patient-position-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientPositionHistory])],
  exports: [TypeOrmModule],
})
export class PatientPositionHistoryModule {}
