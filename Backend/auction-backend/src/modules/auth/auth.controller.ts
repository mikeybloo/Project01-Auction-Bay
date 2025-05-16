import { Body, Controller, HttpCode, HttpStatus, Post, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { RegisterUserDTO } from './dto/registerUserDTO';
import { User } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { Response, Request } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterUserDTO): Promise<User> {
        return this.authService.register(body);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<any> {
        const access_token = await this.authService.generateJwt(req.user);
        res.cookie('access_token', access_token, { httpOnly: true });

        const { password, ...userWithoutPassword } = req.user; 

        return userWithoutPassword;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async user(@Req() req: Request): Promise<User> {
        const cookie = req.cookies['access_token'];
        return this.authService.user(cookie);
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Res({ passthrough: true }) res: Response, @Req() req: Request): Promise<{ msg: string }>  {
        res.clearCookie('access_token');
        return { msg: 'ok' }
    }
}
