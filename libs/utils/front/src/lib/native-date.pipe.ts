import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nativeDate',
})
export class NativeDatePipe implements PipeTransform {
  transform(value?: Date | number | string | null, options?: Intl.DateTimeFormatOptions): string {
    if (value) {
      const valueAsDate = value instanceof Date
        ? value
        : new Date(value);
      return valueAsDate.toLocaleString(undefined, options);
    }
    return '';
  }

}
