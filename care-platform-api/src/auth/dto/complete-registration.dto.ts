import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CompleteRegistrationDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'Jane',
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'Role of the registering user (CARER or CLIENT)',
    enum: Role,
    example: 'CARER',
  })
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be either CARER or CLIENT' })
  role!: Role;

  @ApiProperty({
    description: 'Contact phone number of the user',
    example: '+919999999999',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;
}
