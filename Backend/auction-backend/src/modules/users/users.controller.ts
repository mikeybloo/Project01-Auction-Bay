import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auction, User } from '@prisma/client';
import { AuctionsService } from '../auctions/auctions.service';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('me')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly auctionsService: AuctionsService
    ) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.user({ id });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findCurrent(@Req() request: Request): Promise<User[]> {
        const user = await this.usersService.currentUser(request.cookies['access_token']);

        return this.usersService.user({ 
            id: user.id
        });
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUser: User): Promise<User> {
        return this.usersService.createUser(createUser);
    }

    @Post('auction')
    @HttpCode(HttpStatus.CREATED)
    async createAuction(@Body() auctionBody: Auction, @Req() request: Request): Promise<Auction> {
        const user = await this.usersService.currentUser(request.cookies['access_token']);

        return this.auctionsService.createAuction({
            title: auctionBody.title,
            description: auctionBody.description,
            starting_price: auctionBody.starting_price,
            published_on: new Date(),
            end_date: auctionBody.end_date,
            active: true,
            author: {
                connect: { id: user.id }
            },
        });
    }

    @Patch('update-password')
    @HttpCode(HttpStatus.OK)
    async update(@Body() updateUser: User, @Req() request: Request): Promise<User> {
        try{
            const user = request.user as any;
            const userId = user.userId;

            return this.usersService.updateUser({
                where: { id: userId },
                data: updateUser,
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestException('Something went wrong while updating the user data.')
        }
    }

    @Patch('auction/:id')
    @HttpCode(HttpStatus.OK)
    async updateAuction(@Body() updateAuction: Auction, @Param('id') auctionId: string): Promise<Auction> {
        return this.auctionsService.updateAuction({
            where: { id: auctionId },
            data: updateAuction
        })
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<User> {
        return this.usersService.deleteUser({ id });
    }
}
