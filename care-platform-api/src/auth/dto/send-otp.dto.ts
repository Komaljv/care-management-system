import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Email address to send the OTP verification code to',
    example: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address format' })
  email!: string;

  @ApiProperty({
    description: 'The purpose of requesting the OTP (e.g. registration, login)',
    example: 'registration',
    required: false,
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}
