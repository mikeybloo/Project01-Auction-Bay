import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuctionsModule } from '../auctions/auctions.module';
import { BidsModule } from '../bids/bids.module';

@Module({
    imports: [PrismaModule, AuctionsModule, BidsModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
