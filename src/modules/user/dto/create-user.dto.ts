import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateUserDto {
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
}
