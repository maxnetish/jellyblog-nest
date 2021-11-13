import { UserRole } from '@jellyblog-nest/utils/common';
import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';

export class UpdateUserDto {
  @ApiProperty({
    example: '95938507-d3cd-4045-92e0-d43d93e8f674',
    required: true,
  })
  @IsString()
  @MaxLength(128)
  @IsUUID()
  uuid = '';

  @ApiProperty({
    example: UserRole.READER,
    enum: UserRole,
    required: true,
  })
  @IsEnum(UserRole)
  role = UserRole.READER;
}
