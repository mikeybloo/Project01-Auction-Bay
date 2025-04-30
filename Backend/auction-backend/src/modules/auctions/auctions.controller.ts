import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Auction } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { AuctionsService } from './auctions.service';

@Controller('auctions')
export class AuctionsController {
    constructor (private readonly auctionsService: AuctionsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async get(@Param('id') id: string): Promise<Auction> {
        return this.auctionsService.auction({ id: id });
    }
}
