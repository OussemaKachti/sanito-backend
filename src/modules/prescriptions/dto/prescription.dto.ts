import { IsString, IsOptional, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescriptionDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  prescribedById: string;

  @IsString()
  medicationName: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePrescriptionDto {
  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
