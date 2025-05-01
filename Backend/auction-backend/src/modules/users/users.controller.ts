import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auction, User } from '@prisma/client';
import { AuctionsService } from '../auctions/auctions.service';
import { Request } from 'express';

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
    async findAll(@Query('page') page: number): Promise<User[]> {
        // Pagination using Prisma. Takes the page number minus one and skips as many elements. 
        return this.usersService.users({ 
                skip: page - 1 * 10, // Page 1 = 0 element skips
                take: 10
            });
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUser: User): Promise<User> {
        return this.usersService.createUser(createUser);
    }

    @Post('/auction')
    @HttpCode(HttpStatus.CREATED)
    async createAuction(@Body() auctionBody: Auction, @Req() request: Request): Promise<Auction> {
        const user = request.user as any;
        const userId = user.userId;

        return this.auctionsService.createAuction({
            title: auctionBody.title,
            description: auctionBody.description,
            starting_price: auctionBody.starting_price,
            published_on: new Date(),
            end_date: auctionBody.end_date,
            active: true,
            author: userId,
        });
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateUser: User): Promise<User> {
        return this.usersService.updateUser({
            where: { id },
            data: updateUser,
        })
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<User> {
        return this.usersService.deleteUser({ id });
    }
}
