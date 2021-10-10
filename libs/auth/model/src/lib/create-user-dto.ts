import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@jellyblog-nest/utils/common';

export class CreateUserDto {
  @ApiProperty({
    example: 'flutty',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  username: string;

  @ApiProperty({
    required: true,
    enum: UserRole,
    example: UserRole.READER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: 'top secret',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password: string;
}
