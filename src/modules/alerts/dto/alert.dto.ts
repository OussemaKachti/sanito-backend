import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { AlertType, AlertSeverity } from '@common/enums';

export class CreateAlertDto {
  @IsEnum(AlertType)
  alertType: AlertType;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsUUID()
  equipmentId?: string;

  @IsOptional()
  @IsUUID()
  locationId?: string;
}

export class UpdateAlertDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AcknowledgeAlertDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ResolveAlertDto {
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
