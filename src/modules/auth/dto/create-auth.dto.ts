import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsEmail()
  email: string;
  @IsNumber()
  mobile: number;
  @IsString()
  @IsNotEmpty()
  profession: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  about_me: string;
}
