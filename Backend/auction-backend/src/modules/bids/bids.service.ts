import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Bid, Prisma } from '@prisma/client';

@Injectable()
export class BidsService {
    constructor (private prismaService: PrismaService) {}

    // Persumeably no need to fetch bid/bids on their own since they are included in the SELECTs of both users and auctions
    
    async createBid(data: Prisma.BidCreateInput): Promise<Bid> {
        try {
            return await this.prismaService.bid.create({
                data,
            })
        } catch(err) {
            console.log(err)
            throw new BadRequestException('Something went wrong while creating a new bid');
        }
    }
}
