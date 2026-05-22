import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-care-platform',
    });
  }

  async validate(payload: any) {
    // Restrict standard JWT protection to 'access' token types only
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Access token is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        carerProfile: true,
        clientProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    return user;
  }
}
