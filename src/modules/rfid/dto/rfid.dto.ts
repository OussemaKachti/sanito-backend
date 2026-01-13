import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { RfidType } from '@common/enums';
import { Type } from 'class-transformer';

export class CreateRfidScanDto {
  @IsString()
  rfidId: string;

  @IsString()
  rfidType: RfidType;

  @IsUUID()
  locationId: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  signalStrength?: number;

  @IsOptional()
  @IsString()
  readerId?: string;

  @IsOptional()
  @IsString()
  readerName?: string;
}
