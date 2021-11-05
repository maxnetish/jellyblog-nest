import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FindUserRequest } from '@jellyblog-nest/auth/model';

@Injectable()
export class FindUserRequestPipe implements PipeTransform {
  transform(value: FindUserRequest, metadata: ArgumentMetadata) {
    value.page = parseInt(value.page + '', 10);
    value.size = parseInt(value.size + '', 10);
    return value;
  }
}
