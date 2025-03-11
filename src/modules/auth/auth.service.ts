import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswordHelper } from 'src/helper/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';



@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtservice: JwtService,
   
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if(!user) return null;  
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const token = this.jwtservice.sign(payload);
    // await this.mailservice.sendUserConfirmation(user, token);
    return {
      access_token: token,
    };
    // return {
    //   access_token: this.jwtservice.sign(payload),
      
    // };
  }
  handleRegister(registerDto: CreateAuthDto) {
    return this.usersService.handleRegister(registerDto);
  }
 
}