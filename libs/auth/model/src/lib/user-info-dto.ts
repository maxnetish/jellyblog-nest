import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@jellyblog-nest/utils/common';

export class UserInfoDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  username: string;

  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;
}
