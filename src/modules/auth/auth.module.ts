import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, 
      JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
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
