import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auction, User } from '@prisma/client';
import { AuctionsService } from '../auctions/auctions.service';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';

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

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: string): Promise<User> {
      const filename = file?.filename
  
      if (!filename) throw new BadRequestException('File must be a png, jpg, or jpeg.')
  
      const imagesFolderPath = join(process.cwd(), 'files')
      const fullImagePath = join(imagesFolderPath + '/' + file.filename)
      if (await isFileExtensionSafe(fullImagePath)) {
        return this.usersService.updateUserImageId(id, filename)
      }
  
      removeFile(fullImagePath)
      throw new BadRequestException('File content does not match extension!')
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
