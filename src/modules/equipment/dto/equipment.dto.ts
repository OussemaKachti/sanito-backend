import { IsString, IsOptional, IsDate, IsEnum, IsUUID, IsNumber } from 'class-validator';
import { EquipmentStatus } from '@common/enums';
import { Type } from 'class-transformer';

export class CreateEquipmentDto {
  @IsOptional()
  @IsString()
  rfidTagId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  equipmentType?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  warrantyUntil?: Date;

  @IsOptional()
  @IsUUID()
  currentLocationId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalCost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEquipmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsUUID()
  currentLocationId?: string;

  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastMaintenanceDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextMaintenanceDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
