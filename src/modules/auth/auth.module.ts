import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersService, 
      JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
      secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
      signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
      },
     
    }),
    inject: [ConfigService],
  }),
   
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
