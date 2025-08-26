import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { Role } from 'src/entities/role.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User, Role]), JwtModule.register({
    global: true,
    secret: process.env.JWT_TOKEN,
    signOptions: { expiresIn: '1d' }
  })]
})
export class AuthModule {}
