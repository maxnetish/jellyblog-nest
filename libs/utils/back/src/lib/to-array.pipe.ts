import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToArrayPipe<T> implements PipeTransform<T | T[], T[]> {
  transform(value: T | T[]) {
    if (!value) {
      return [];
    }
    return Array.isArray(value)
      ? value
      : [value];
  }
}
