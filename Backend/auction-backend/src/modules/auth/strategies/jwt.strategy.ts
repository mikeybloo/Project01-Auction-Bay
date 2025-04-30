import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { TokenPayload } from 'src/interfaces/auth.interface'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { User } from '@prisma/client'
import { UsersService } from 'src/modules/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET') ?? 'default',
    })
  }

  async validate(payload: TokenPayload): Promise<User> {
    return this.usersService.user({ id: payload.sub }) 
  }
}
