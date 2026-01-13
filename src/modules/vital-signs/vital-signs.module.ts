import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSign } from './entities/vital-sign.entity';
import { VitalSignsService } from './vital-signs.service';
import { VitalSignsController } from './vital-signs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSign])],
  controllers: [VitalSignsController],
  providers: [VitalSignsService],
  exports: [VitalSignsService],
})
export class VitalSignsModule {}
