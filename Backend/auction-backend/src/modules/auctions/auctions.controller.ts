import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { Auction } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { AuctionsService } from './auctions.service';

@Controller('auctions')
export class AuctionsController {
    constructor (private readonly auctionsService: AuctionsService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async get(@Param('id') id: string): Promise<Auction> {
        return this.auctionsService.auction({ id: id });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query('page') page: number): Promise<Auction[]> {
        return this.auctionsService.auctions({ 
            skip: page - 1 * 10, // Page 1 = 0 element skips
            take: 10
        });
    }

    @Get('/demo')
    @HttpCode(HttpStatus.OK)
    async demo(): Promise<Auction[]> {
        const auctions =  this.auctionsService.auctions({ 
            take: 20
        });

        const shuffleList = (await auctions).sort(() => 0.5 - Math.random());
        
        return shuffleList.slice(0, 4);
    }
}
