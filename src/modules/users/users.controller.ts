import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorator/customize';
import { ApiBody, ApiOperation } from '@nestjs/swagger';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  // @ApiOperation({ summary: 'Create user' })
  // @ApiBody({ type: CreateUserDto })
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() querys: any
  ) {
    return this.usersService.findAll(querys);
  }
  
  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Patch()
  @Public()
  async update(@Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
