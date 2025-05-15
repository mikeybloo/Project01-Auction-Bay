import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auction, Prisma } from '@prisma/client';

@Injectable()
export class AuctionsService {
    constructor (
        private prisma: PrismaService) {}

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
            take,
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
    }

    async createAuction(data: Prisma.AuctionCreateInput): Promise<Auction> {
        return this.prisma.auction.create({
            data,
        })
    }

    async updateAuction(params: {
        where: Prisma.AuctionWhereUniqueInput;
        data: Prisma.AuctionUpdateInput;
    }): Promise<Auction> {
        const { where, data } = params;
        return this.prisma.auction.update({
            data,
            where,
        });
    }

    async deleteAuction(where: Prisma.AuctionWhereUniqueInput): Promise<Auction> {
        return this.prisma.auction.delete({
            where,
        })
    }

    async updateProductImage(id: string, image: string): Promise<Auction> {
        const user = await this.auction({ id });
        return this.updateAuction({ where: { id }, data: { image }});
    }
}
