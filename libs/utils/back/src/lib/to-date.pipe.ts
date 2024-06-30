import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToDatePipe implements PipeTransform<string, Date> {
  transform(value) {
    if (!value) {
      return null;
    }
    const tryParseDt = new Date(value);
    if (isNaN(tryParseDt.valueOf())) {
      return null;
    }
    return tryParseDt;
  }
}
