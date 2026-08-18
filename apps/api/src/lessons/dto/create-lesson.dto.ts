import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsOptional()
  @IsIn(['VIDEO', 'TEXT', 'QUIZ', 'ASSIGNMENT'])
  type?: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';

  @IsOptional()
  isPublished?: boolean;
}
