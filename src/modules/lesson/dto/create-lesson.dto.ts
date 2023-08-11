import { IsOptional, IsString } from 'class-validator';
export class CreateLessonDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  link: string;
  @IsString()
  @IsOptional()
  text: string;
}
