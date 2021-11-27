import { SortOrder, UserRole } from '@jellyblog-nest/utils/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Pageable } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from './user-info-dto';
import { HttpParams } from '@angular/common/http';

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

  toHttpParams() {
    let result = new HttpParams()
      .append('page', this.page)
      .append('size', this.size);

    if (this.order) {
      Object.entries(this.order).forEach(([key, order]) => {
        result = result.append(`order[${key}]`, order);
      });
    }
    // Object.keys(this.order).forEach((key: keyof UserInfoDtoWithoutUuid) => {
    //   result = this.order[key]
    //     ? result.append(`order[${key}]`, this.order[key])
    //     : result;
    // });

    if (this.role && this.role.length) {
      result = result.appendAll({ role: this.role });
    }

    if (this.name) {
      result = result.append('name', this.name);
    }

    return result;
  }
}
