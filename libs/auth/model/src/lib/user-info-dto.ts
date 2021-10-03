import { UserRole } from './user-role';
import { ApiProperty } from '@nestjs/swagger';

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
