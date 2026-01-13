import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateActivityLogDto {
  @IsUUID()
  userId: string;

  @IsString()
  action: string;

  @IsString()
  entityType: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
