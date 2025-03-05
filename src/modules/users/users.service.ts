import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helper/utils';
import aqp from 'api-query-params';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) {
      return true;
    }
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    //check email exist
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email is exist ${email}. try again`);
    }
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      phone,
      password: hashPassword,
      address,
      image,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(
    query: string,
    current: number,
    pagesize: number,
    sort: string,
  ) {
    const { filter } = aqp(query);
    console.log(query);
    if (!current) current = 1;
    if (!pagesize) pagesize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pagesize);
    const skip = (current - 1) * pagesize;
    const results = await this.userModel
      .find(filter)
      .limit(pagesize)
      .skip(skip)
      .sort(sort)
      .select('-password');
    return { results,totalItems, totalPages };
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async update( updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    //check id
    if(mongoose.isValidObjectId(id)){
      return this.userModel.deleteOne({ _id: id });
    }else{
      throw new BadRequestException(`Id is not valid ${id}`);
    }
    
  }
}
