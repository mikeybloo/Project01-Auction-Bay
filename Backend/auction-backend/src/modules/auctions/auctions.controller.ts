import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { Auction, Bid } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { AuctionsService } from './auctions.service';
import { BidsService } from '../bids/bids.service';
import { Request } from 'express';

@Controller('auctions')
export class AuctionsController {
    constructor (
        private readonly auctionsService: AuctionsService,
        private readonly bidsService: BidsService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async get(@Param('id') id: string): Promise<Auction> {
        return this.auctionsService.auction({ id: id });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query('page') page: number): Promise<Auction[]> {
        // Pagination using Prisma. Takes the page number minus one and skips as many elements. 
        return this.auctionsService.auctions({ 
            skip: page - 1 * 10, // Page 1 = 0 element skips
            take: 10
        });
    }

    @Public()
    @Get('demo')
    @HttpCode(HttpStatus.OK)
    async demo(): Promise<Auction[]> {
        const auctions =  this.auctionsService.auctions({ 
            take: 20
        });

        const shuffleList = (await auctions).sort(() => 0.5 - Math.random());
        
        return shuffleList.slice(0, 4);
    }

    @Post(':id/bid')
    @HttpCode(HttpStatus.CREATED)
    async placeBid(@Body() bidBody: Bid, @Param('id') id: string, @Req() request: Request): Promise<Bid> {
        const auctionId = id;

        const user = request.user as any;
        const userId = user.userId;

        return this.bidsService.createBid({
            offer: bidBody.offer,
            published_on: new Date(),
            auction: {
                connect: { id: auctionId }
            },
            author: {
                connect: { id: userId }
            }
        });
    }
}
