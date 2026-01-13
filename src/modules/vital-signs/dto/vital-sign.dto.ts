import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVitalSignDto {
  @IsUUID()
  patientId: string;

  @IsNumber()
  @Type(() => Number)
  temperature: number;

  @IsNumber()
  @Type(() => Number)
  heartRate: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bloodPressureSystolic?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bloodPressureDiastolic?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  respiratoryRate?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  oxygenSaturation?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bloodGlucose?: number;

  @IsOptional()
  @IsUUID()
  recordedById?: string;
}
