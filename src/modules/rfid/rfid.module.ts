import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RfidScan } from './entities/rfid-scan.entity';
import { RfidService } from './rfid.service';
import { RfidController } from './rfid.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RfidScan])],
  controllers: [RfidController],
  providers: [RfidService],
  exports: [RfidService],
})
export class RfidModule {}
