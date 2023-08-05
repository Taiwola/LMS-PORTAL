import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTutorialCategoryDto {
  @IsNotEmpty()
  @IsString()
  category: string;
}
