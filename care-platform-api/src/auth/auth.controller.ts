import { Controller, Post, Body, Get, Headers, UseGuards, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a 6-digit OTP code to email or phone' })
  @ApiResponse({ status: 200, description: 'OTP generated and logged to console.' })
  @ApiResponse({ status: 400, description: 'Invalid input format.' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify the OTP code (Logs in user if already registered)' })
  @ApiResponse({
    status: 200,
    description: 'Verification status. Returns access token, refresh token, and user if registered, otherwise returns short-lived tempToken.',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP code.' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('complete-registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Complete user registration using temporary verification session token' })
  @ApiResponse({ status: 201, description: 'User profile successfully created. Returns login tokens.' })
  @ApiResponse({ status: 400, description: 'Registration failed (invalid role, user already exists).' })
  @ApiResponse({ status: 401, description: 'Stale or invalid temp session token.' })
  @ApiBearerAuth()
  async completeRegistration(
    @Body() dto: CompleteRegistrationDto,
    @Headers('authorization') authHeader?: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header containing Bearer tempToken is required');
    }

    const tempToken = authHeader.split(' ')[1];
    try {
      // Decode and verify the short-lived session token
      const payload = this.jwtService.verify(tempToken);
      
      if (payload.type !== 'registration_temp') {
        throw new UnauthorizedException('Invalid token type. Registration session token required.');
      }

      return this.authService.completeRegistration(dto, { target: payload.target });
    } catch (error) {
      throw new UnauthorizedException('Registration session token has expired or is invalid');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user profile details' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user object with profile details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
