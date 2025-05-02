import { Module, forwardRef } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuctionsController } from './auctions.controller';
import { BidsModule } from '../bids/bids.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, BidsModule, forwardRef(() => UsersModule),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_SECRET_EXPIRES')}s` }
        }),
    })
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService]
})
export class AuctionsModule {}
