import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TutorialType } from '../entities/tutorial.entity';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  topicName: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsArray()
  keywords: string[];
  @IsString()
  @IsNotEmpty()
  image: string;
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(TutorialType)
  status: TutorialType;

  @IsOptional()
  @IsNumber()
  price: number;
}
