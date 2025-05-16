import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareHash, hash } from 'src/utils/bcrypt';
import { User } from '@prisma/client';
import { RegisterUserDTO } from './dto/registerUserDTO';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        console.log('Validating user...');
        const user = await this.usersService.userSecure({ email });
        if(!user) {
            throw new BadRequestException('Invalid credentials');
        };

        if(!(await compareHash(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        };

        console.log('User is valid');
        return user;
    }

    async register(registerUserDTO: RegisterUserDTO): Promise<User> {
        const { email, name, surname, password } = registerUserDTO;
        const hashedPassword = await hash(registerUserDTO.password)
        return this.usersService.createUser({
            email, 
            name,
            surname,
            password: hashedPassword
        })
    }

    async generateJwt(user: User): Promise<string> {
        return this.jwtService.signAsync({ sub: user.id, username: user.email })
    }

    async user(cookie: string): Promise<User> {
        const data = await this.jwtService.verifyAsync(cookie, { secret: this.configService.get('JWT_SECRET') })
        return this.usersService.user({ id: data['sub'] });
    }

    async getUserId(request: Request): Promise<string> {
        const user = request.user as User;
        return user.id;
    }
}
