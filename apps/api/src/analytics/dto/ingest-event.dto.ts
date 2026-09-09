import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnalyticsEventItemDto {
  @IsString()
  eventType: string; // 'landing_view' | 'course_page_view' | 'enrollment_completed' | 'course_completed'

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class IngestEventBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalyticsEventItemDto)
  events: AnalyticsEventItemDto[];

  @IsOptional()
  @IsString()
  workspaceId?: string;
}
