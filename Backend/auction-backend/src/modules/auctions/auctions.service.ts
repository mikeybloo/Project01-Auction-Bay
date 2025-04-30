import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auction, Prisma } from '@prisma/client';

@Injectable()
export class AuctionsService {
    constructor (private prisma: PrismaService) {}

    async auction(auctionWhereUniqueInput: Prisma.AuctionWhereUniqueInput): Promise<any> {
        try {
            return this.prisma.auction.findUniqueOrThrow({ 
                where: auctionWhereUniqueInput,
                include: {
                    bids: {
                        orderBy: {
                            offer: 'desc'
                        },
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    name: true,
                                    surname: true,
                                    avatar: true
                                }
                            } 
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            avatar: true
                        }
                    }
                }
            });
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Something went wrong while finding the auction')
        }
    }

    async auctions(params: {
        skip?: number;
        take?: number
    }): Promise<Auction[]> {
        const { skip, take } = params;
        return this.prisma.auction.findMany({
            skip, 
            take
        });
    }

    async createAuction(data: Prisma.AuctionCreateInput): Promise<Auction> {
        return this.prisma.auction.create({
            data,
        })
    }

    
}
