import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toStrictBoolean',
  standalone: true,
})
export class ToStrictBooleanPipe implements PipeTransform {

  private readonly falsyValues = [
    'off',
    'false',
    'Off',
    'False',
  ];

  /**
   * Some components receives only strict boolean input (NgbCollapse ex.), but
   * AsyncPipe returns <boolean | null> so we should transform null to false.
   */
  transform<T>(value: T): boolean {
    if (typeof value === 'string' && this.falsyValues.indexOf(value) > -1) {
      return false;
    }
    return !!value;
  }

}
