import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { User, Role, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private validateEmail(email: string): string {
    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      throw new BadRequestException('Invalid email format');
    }
    return normalized;
  }

  private validatePhoneNumber(phone: string): string {
    const trimmed = phone.trim();
    // Basic phone validation (digits, plus, spaces, dashes, parentheses)
    const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;
    if (!phoneRegex.test(trimmed)) {
      throw new BadRequestException('Invalid phone number format');
    }
    // Remove spaces, dashes and parentheses for normalized phone number
    return trimmed.replace(/[\s\-()]/g, '');
  }

  async sendOtp(dto: SendOtpDto) {
    const target = this.validateEmail(dto.email);
    
    // Generate a 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save to DB
    await this.prisma.otpCode.create({
      data: {
        target,
        code: otpCode,
        expiresAt,
      },
    });

    // Development Mode Console Log (frees us from SMTP/Twilio configuration on Day 1)
    console.log(`\n======================================================`);
    console.log(`[DEVELOPMENT OTP SERVICE]`);
    console.log(`Sent OTP to: ${target}`);
    console.log(`CODE: ${otpCode}`);
    console.log(`PURPOSE: ${dto.purpose || 'authentication'}`);
    console.log(`EXPIRES AT: ${expiresAt.toISOString()}`);
    console.log(`======================================================\n`);

    return {
      success: true,
      message: `OTP sent successfully to ${target} (check console logs in development)`,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const target = this.validateEmail(dto.email);

    // Find the latest active and unexpired OTP code for the target
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        target,
        code: dto.otp,
        verified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    // Mark as verified
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Check if user exists
    const user = await this.prisma.user.findFirst({
      where: { email: target },
    });

    if (user) {
      if (user.status === UserStatus.SUSPENDED) {
        throw new ForbiddenException('Your account has been suspended. Please contact support.');
      }

      // Generate Access Token and Refresh Token
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        isNewUser: false,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
      };
    }

    // For new users: return a short-lived tempToken (valid for 15 minutes)
    const tempToken = this.jwtService.sign(
      { target, type: 'registration_temp' },
      { expiresIn: '15m' }
    );

    return {
      isNewUser: true,
      tempToken,
    };
  }

  async completeRegistration(dto: CompleteRegistrationDto, tempTokenUser: { target: string }) {
    const target = this.validateEmail(tempTokenUser.target);
    const normalizedPhone = this.validatePhoneNumber(dto.phoneNumber);

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email: target },
    });

    if (existingUser) {
      throw new BadRequestException('User is already registered. Please login.');
    }

    // Check role restriction
    if (dto.role === Role.ADMIN) {
      throw new BadRequestException('Admin accounts cannot be self-registered');
    }

    // Check if phone number is already registered by another user
    const existingPhone = await this.prisma.user.findFirst({
      where: { phoneNumber: normalizedPhone },
    });

    if (existingPhone) {
      throw new BadRequestException('Phone number is already in use by another account');
    }

    // Run user and profile creation in a database transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: target,
          phoneNumber: normalizedPhone,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
          status: dto.role === Role.CARER ? UserStatus.PENDING : UserStatus.ACTIVE,
        },
      });

      if (dto.role === Role.CARER) {
        await tx.carerProfile.create({
          data: {
            userId: createdUser.id,
          },
        });
      } else {
        await tx.clientProfile.create({
          data: {
            userId: createdUser.id,
          },
        });
      }

      return createdUser;
    });

    const accessToken = this.generateAccessToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        status: newUser.status,
      },
    };
  }

  private generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      type: 'access',
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };
    // Refresh token is longer lived, e.g. 7 days
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
