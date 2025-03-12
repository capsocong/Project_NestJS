import { IsNumber, IsOptional, IsString } from "class-validator";


export class FindAllUserDto{
    @IsOptional()
    @IsString()
    query?: string;
    @IsOptional()
    @IsNumber()
    current?: number;
    @IsOptional()
    @IsNumber()
    pagesize?: number;
    @IsOptional()
    @IsString()
    sort?: string;
}