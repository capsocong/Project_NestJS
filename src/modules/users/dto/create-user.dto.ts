import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()  
  email: string;
  @IsNotEmpty({message: 'Password is not null'})
  password: string;
  @MinLength(10)
  phone: string;
  address: string;
  image: string;
}
