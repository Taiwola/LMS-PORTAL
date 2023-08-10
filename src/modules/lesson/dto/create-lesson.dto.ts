import { IsOptional, IsString, IsArray } from 'class-validator';
export class CreateLessonDto {
  @IsString()
  @IsOptional()
  link: string;
  @IsString()
  @IsOptional()
  text: string;
}
