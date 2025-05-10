import { Pipe, PipeTransform } from '@angular/core';

/**
 * @see https://github.com/microsoft/TypeScript/issues/44632
 */
@Pipe({
  name: 'nativeDate',
  standalone: true,
})
export class NativeDatePipe implements PipeTransform {
  transform(value?: Date | number | string | null, options?: Parameters<Date['toLocaleString']>[1] | 'iso', locale?: Parameters<Date['toLocaleString']>[0]): string {
    if (value) {
      const valueAsDate = value instanceof Date
        ? value
        : new Date(value);

      if(options === 'iso') {
        return valueAsDate.toISOString();
      }

      return valueAsDate.toLocaleString(locale, options);
    }
    return '';
  }

}
