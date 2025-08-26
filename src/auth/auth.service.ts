import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from 'src/configs/responseDto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Authenticate } from './dto/Authenticate';
import * as bcrypt from 'bcrypt';
import { GenerateTokenParams } from './dto/GenerateToken';
import { SignupParams } from './dto/Signup';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async generateToken(params: GenerateTokenParams): Promise<string> {
        const accessToken = await this.jwtService.signAsync(params)
        return accessToken;
    }

    async validateUser(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email }, relations: ['roles']});
        if (!user) return null
        return user
    }

    async authenticate(signinParams: Authenticate): Promise<ResponseDto> {
        const user = await this.validateUser(signinParams.email);
        if (!user) throw new UnauthorizedException();

        const matchPassword = bcrypt.compareSync(signinParams.password, user.password);
        if (!matchPassword) {
            return {
                errorCode: 400,
                data: '',
                message: 'Password is incorrect'
            }
        }

        const tokenPayload = {
            ...user
        }
        const accessToken = await this.generateToken(tokenPayload);
        return {
            errorCode: 200,
            data: {
                profile: user,
                accessToken
            },
            message: 'Sign in successfully'
        }
    }

    async signup(signupParams: SignupParams): Promise<ResponseDto>{
        const user = await this.validateUser(signupParams.email);
        if(user) {
            return {
                errorCode: 400,
                data: '',
                message: 'User is already exist'
            }
        }
        const hashedPassword = bcrypt.hashSync(signupParams.password, 10);
        const createdUser = this.userRepository.create({...signupParams, password: hashedPassword});
        const savedUser = await this.userRepository.save(createdUser);
        if(!savedUser) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
        return {
            errorCode: 200,
            data: user,
            message: 'Signup successfully'
        }
    }
}
