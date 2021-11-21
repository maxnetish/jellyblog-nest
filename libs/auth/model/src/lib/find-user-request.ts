import { UserRole } from '@jellyblog-nest/utils/common';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Pageable } from '@jellyblog-nest/utils/common';
import { UserInfoDto } from './user-info-dto';
import { HttpParams } from '@angular/common/http';

export class FindUserRequest extends Pageable<Omit<UserInfoDto, 'uuid'>> {
  @IsString()
  @MaxLength(128)
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { each: true })
  role?: UserRole[] = [];

  constructor(opts: Partial<FindUserRequest> = {}) {
    super();

    Object.keys(opts).forEach((key) => {
      if(opts[key]) {
        this[key] = opts[key];
      }
    });
  }

  toHttpParams() {
    let result = new HttpParams()
      .append('page', this.page)
      .append('size', this.size);

    Object.keys(this.order).forEach((key) => {
      result = result.append(`order[${key}]`, this.order[key]);
    });

    if (this.role && this.role.length) {
      result = result.appendAll({ role: this.role });
    }

    if (this.name) {
      result = result.append('name', this.name);
    }

    return result;
  }
}
