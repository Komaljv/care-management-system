import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User, Role, UserStatus } from '@prisma/client';

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;
    if (!phoneRegex.test(trimmed)) {
      throw new BadRequestException('Invalid phone number format');
    }
    return trimmed.replace(/[\s\-()]/g, '');
  }

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private formatUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    };
  }

  async register(dto: RegisterDto) {
    const email = this.validateEmail(dto.email);
    const phoneNumber = this.validatePhoneNumber(dto.phone);
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();

    if (!firstName || !lastName) {
      throw new BadRequestException('First name and last name are required');
    }

    const existingEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException('An account with this email already exists');
    }

    const existingPhone = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      throw new BadRequestException('Phone number is already in use by another account');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const newUser = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          phoneNumber,
          passwordHash,
          firstName,
          lastName,
          role: Role.CLIENT,
          status: UserStatus.ACTIVE,
        },
      });

      await tx.clientProfile.create({
        data: { userId: createdUser.id },
      });

      return createdUser;
    });

    const accessToken = this.generateAccessToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    return {
      accessToken,
      refreshToken,
      user: this.formatUserResponse(newUser),
    };
  }

  async login(dto: LoginDto) {
    const email = this.validateEmail(dto.email);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account has been suspended. Please contact support.');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: this.formatUserResponse(user),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = this.validateEmail(dto.email);
    const genericMessage =
      'If an account exists with this email, a password reset link has been sent.';

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true, message: genericMessage };
    }

    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await this.mailService.sendPasswordResetEmail(email, resetToken, expiresAt);

    return { success: true, message: genericMessage };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(dto.token);

    const resetRecord = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      });

      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      });

      await tx.passwordResetToken.updateMany({
        where: {
          userId: resetRecord.userId,
          usedAt: null,
          id: { not: resetRecord.id },
        },
        data: { usedAt: new Date() },
      });
    });

    return {
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
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
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
