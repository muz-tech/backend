import { Body, Controller, Post, UseGuards, Get, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Signin, Signup } from 'src/utils/type';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('/login')
    login(@Body() signin: Signin) {
        return this.authService.authenticate(signin);
    }

    @Post('/signup')
    signup(@Body() signup: Signup) {
        return this.authService.signup(signup);
    }

    @UseGuards(AuthGuard)
    @Post('/logout')
    logout(@Req() req) {
        return {
            errorCode: 200,
            data: null,
            message: 'Logout sucessfully'
        }
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return {
            errorCode: 200,
            data: req.user
        };
    }
}
