import { IsString, IsOptional, IsDate, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEquipmentMaintenanceDto {
  @IsUUID()
  equipmentId: string;

  @IsString()
  maintenanceType: string;

  @IsDate()
  @Type(() => Date)
  scheduledDate: Date;

  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEquipmentMaintenanceDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
