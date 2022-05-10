import { SortOrder, UserRole } from '@jellyblog-nest/utils/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Pageable } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from './user-info-dto';

type UserInfoDtoWithoutUuid = Omit<UserInfoDto, 'uuid'>;

export class FindUserRequest extends Pageable<UserInfoDtoWithoutUuid> {
  @IsString()
  @MaxLength(128)
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { each: true })
  role?: UserRole[] = [];

  constructor({ name, role, order, size, page }: Partial<FindUserRequest> = {}) {
    super();

    this.name = name || this.name;
    this.role = role || this.role;
    this.order = order || this.order;
    this.size = size || this.size;
    this.page = page || this.page;
  }
}
