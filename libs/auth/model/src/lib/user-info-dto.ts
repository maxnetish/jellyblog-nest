import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@jellyblog-nest/utils/common';

export class UserInfoDto {
  @ApiProperty()
  uuid = '';

  @ApiProperty()
  username = '';

  @ApiProperty({
    enum: UserRole,
  })
  role = UserRole.READER;
}
