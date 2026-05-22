import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address to verify the OTP for',
    example: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address format' })
  email!: string;

  @ApiProperty({
    description: '6-digit OTP code to verify',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp!: string;
}
