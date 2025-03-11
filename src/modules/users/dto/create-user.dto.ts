import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  // @ApiProperty({example: 'Nguyen Van A', description: 'The name of user'})
  @IsNotEmpty()
  name: string;
  // @ApiProperty({example: 'nguyenvana@gmail.com', description: 'The email of user'})
  @IsEmail()  
  email: string;
  // @ApiProperty({example: '123456', description: 'The password of user'})
  @IsNotEmpty({message: 'Password is not null'})
  password: string;
  // @ApiProperty({example: '0123456789', description: 'The phone of user'})
  @MinLength(10)
  phone: string;
  // @ApiProperty({example: 'Ha Noi', description: 'The address of user'})
  address: string;
  // @ApiProperty({example: 'https://www.google.com', description: 'The image of user'})
  @IsNotEmpty()  
  image: string;
}
