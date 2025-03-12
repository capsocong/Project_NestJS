import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helper/utils';
import aqp from 'api-query-params';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { FindAllUserDto } from './dto/findAllUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailerservice: MailerService,
  ) {}
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) {
      return true;
    }
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, birth, email, password, phone, address, image } = createUserDto;

    //check email exist
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email is exist ${email}. try again`);
    }
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      birth,
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

  async findAll(params: FindAllUserDto) {
    const { query, current = 1, pagesize = 10, sort } = params;
    const { filter } = aqp(query || {});
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pagesize);
    const skip = (current - 1) * pagesize;
    const results = await this.userModel
      .find(filter)
      .limit(pagesize)
      .skip(skip)
      .sort(sort)
      .select('-password');
    // return { results, totalItems, totalPages };
    const formattedUsers = results.map((user) => {
      const userObj = user.toObject();
      return {
          _id: userObj._id,
          name: userObj.name,
          birth: userObj.birth,  
          email: userObj.email,
          phone: userObj.phone,
          address: userObj.address,
          image: userObj.image,
          account_type: userObj.account_type,
          role: userObj.role,
          is_active: userObj.is_active,
          __v: userObj.__v
      };
  });
  return {formattedUsers, totalItems, totalPages};
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).select('-password');
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async update(updateUserDto: UpdateUserDto) {
    //check id

    const { _id, updatedAt, ...updateData } = updateUserDto;

    const updateUser = await this.userModel
      .findByIdAndUpdate({ _id: _id }, { $set: updateData }, { new: true })
      .select('-password');

    return updateUser;
  }

  async remove(id: string) {
    //check id
    if (mongoose.isValidObjectId(id)) {
      return this.userModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException(`Id is not valid ${id}`);
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { username, email, password } = registerDto;
    //check email exist
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email is exist ${email}. try again`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(30, 'second'),
    });
    //send email
    await this.mailerservice.sendMail({
      to: user.email, // list of receivers
      from: 'noreply@nestjs.com', // sender address
      subject: 'Activate your account ✔', // Subject line
      template: 'register.hbs',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return {
      _id: user._id,
    };

  }
  async findUsersWithBirthdayToday() {
    const today = new Date();
    const todayMonthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    console.log('todayMonthDay', todayMonthDay);
    return this.userModel.find({
      $expr: {
        $eq: [
          { 
            $dateToString: { 
              format: "%m-%d", 
              date: { $dateAdd: { startDate: "$birth", unit: "hour", amount: 7 } } // Chuyển sang UTC+7
            } 
          },
          todayMonthDay
        ]
      }
    }).exec();
  }
}
