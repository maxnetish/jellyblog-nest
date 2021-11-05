import { UserRole } from '@jellyblog-nest/utils/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Pageable } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

export class FindUserRequest extends Pageable<Omit<UserInfoDto, 'uuid'>> {
  @ApiProperty({
    example: 'adm',
    required: false,
    maxLength: 128,
  })
  @IsString()
  @MaxLength(128)
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    enum: UserRole,
    isArray: true,
    example: UserRole.READER,
  })
  @IsEnum(UserRole, { each: true })
  role?: UserRole[] = [];
}
