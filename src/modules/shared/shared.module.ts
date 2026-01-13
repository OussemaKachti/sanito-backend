import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Patient } from '@modules/patients/entities/patient.entity';
import { Equipment } from '@modules/equipment/entities/equipment.entity';
import { Location } from '@modules/locations/entities/location.entity';
import { SharedService } from './shared.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Patient, Equipment, Location])],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
