import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Auction, Bid } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { AuctionsService } from './auctions.service';
import { BidsService } from '../bids/bids.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';

@Controller('auctions')
export class AuctionsController {
    constructor (
        private readonly auctionsService: AuctionsService,
        private readonly bidsService: BidsService,
        private readonly usersService: UsersService) {}

    @Get('myauctions')
    @HttpCode(HttpStatus.OK)
    async myAuctions(@Query('page') page: number, @Req() request: Request): Promise<Auction[]> {
        const user = await this.usersService.currentUser(request.cookies['access_token']);

        return this.auctionsService.auctions({ 
            authorId: user.id
        });
    }

    @Get('bidding')
    @HttpCode(HttpStatus.OK)
    async bidding(@Query('page') page: number, @Req() request: Request): Promise<Auction[]> {
        const user = await this.usersService.currentUser(request.cookies['access_token']);

        return this.auctionsService.auctions({
            bids: {
                some: {
                    authorId: user.id
                }
            }
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async get(@Param('id') id: string): Promise<Auction> {
        return this.auctionsService.auction({ id: id });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query('page') page: number): Promise<Auction[]> {
        // Pagination using Prisma. Takes the page number minus one and skips as many elements. 
        return this.auctionsService.auctionsPaginated({ 
            skip: (page - 1) * 10,
            take: 10
        });
    }

    @Public()
    @Get('demo')
    @HttpCode(HttpStatus.OK)
    async demo(): Promise<Auction[]> {
        const auctions =  this.auctionsService.auctionsPaginated({ 
            take: 20
        });

        const shuffleList = (await auctions).sort(() => 0.5 - Math.random());
        
        return shuffleList.slice(0, 4);
    }

    @Post(':id/bid')
    @HttpCode(HttpStatus.CREATED)
    async placeBid(@Body() bidBody: Bid, @Param('id') id: string, @Req() request: Request): Promise<Bid> {
        const auctionId = id;

        const user = await this.usersService.currentUser(request.cookies['access_token']);

        return this.bidsService.createBid({
            offer: bidBody.offer,
            published_on: new Date(),
            auction: {
                connect: { id: auctionId }
            },
            author: {
                connect: { id: user.id }
            }
        });
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async upload(@UploadedFile() file: Express.Multer.File, @Param('id') productId: string): Promise<Auction> {
        const filename = file?.filename

        if (!filename) throw new BadRequestException('File must be a png, jpg, or jpeg.')

        const imagesFolderPath = join(process.cwd(), 'files')
        const fullImagePath = join(imagesFolderPath + '/' + file.filename)
        if (await isFileExtensionSafe(fullImagePath)) {
            return this.auctionsService.updateProductImage(productId, filename)
        }

        removeFile(fullImagePath)
        throw new BadRequestException('File content does not match extension!')
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') auctionId: string, @Req() request: Request): Promise<Auction> {
        const auction: Auction = await this.auctionsService.auction({ id: auctionId });
        const user = await this.usersService.currentUser(request.cookies['access_token']);
        
        if(auction.authorId !== user.id) {
            throw new ForbiddenException('Modifications to this auction are forbidden!')
        }

        return this.auctionsService.deleteAuction({ id: auctionId });
    }
}
