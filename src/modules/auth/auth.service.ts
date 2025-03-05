import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswordHelper } from 'src/helper/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtservice: JwtService
  ) {}
  
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id,email: user.email };
    return {
      access_token: this.jwtservice.sign(payload),
    };
  }
}