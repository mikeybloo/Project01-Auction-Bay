import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuctionsController } from './auctions.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService]
})
export class AuctionsModule {}
