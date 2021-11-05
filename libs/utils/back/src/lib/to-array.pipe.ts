import { Injectable, PipeTransform } from '@nestjs/common';
import { never } from 'rxjs';

@Injectable()
export class ToArrayPipe implements PipeTransform {
  transform(value: never | never[]) {
    if (!value) {
      return [];
    }
    return Array.isArray(value)
      ? value
      : [value];
  }
}
