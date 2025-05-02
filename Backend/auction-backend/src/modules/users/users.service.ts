import { BadRequestException, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService) {}

    async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<any> {
        try {
            return this.prisma.user.findUniqueOrThrow({ 
                where: userWhereUniqueInput,
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    avatar: true,
                    auctions: {
                        orderBy: {
                            published_on: 'desc',
                        },
                        select: {
                            id: true,
                            title: true,
                            starting_price: true,
                            published_on: true,
                            end_date: true,
                            active: true,
                            bids: {
                                orderBy: {
                                    offer: 'desc',
                                }
                            }
                        }
                    },
                    bids: {
                        select: {
                            id: true,
                            offer: true,
                            published_on: true,
                        }
                    }
                }
            });
        } catch (err) {
            console.log(err)
            throw new BadRequestException('Something went wrongwhile finding the user.')
        }
    }

    // User with password for auth 
    async userSecure(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<any> {
        try {
            return await this.prisma.user.findUniqueOrThrow({ 
                where: userWhereUniqueInput,
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    password: true,
                    avatar: true,
                }
            });
        } catch (err) {
            console.log(err)
            throw new BadRequestException('User does not exist')
        }
    }

    async users(params: { 
        skip?: number;
        take?: number
    }): Promise<User[]> {
        const { skip, take } = params;
        return this.prisma.user.findMany({
            skip,
            take
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }

    async currentUser(cookie: string): Promise<User> {
        const data = await this.jwtService.verifyAsync(cookie, { secret: this.configService.get('JWT_SECRET') })
        return this.user({
            id: data['sub']
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where,
        })
    }
}
