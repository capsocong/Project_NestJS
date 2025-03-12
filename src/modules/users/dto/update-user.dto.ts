
import { IsMongoId, IsNotEmpty, IsOptional} from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({message: 'Id is not valid'})  
  @IsNotEmpty({message: 'Id is not null'})
  _id: string;
  @IsOptional()
  name: string;
  @IsOptional()
  birth: Date;
  @IsOptional()
  phone: string;
  @IsNotEmpty()
  address: string;
  @IsOptional()
  image: string;
  @IsOptional()
  updatedAt: Date;  
}
