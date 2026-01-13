import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  recipientUserId: string;

  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  recipientPhone?: string;

  @IsString()
  notificationType: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsUUID()
  alertId?: string;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  status?: string;
}
