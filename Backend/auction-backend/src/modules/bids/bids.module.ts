import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BidsService]
})
export class BidsModule {}
