import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NativeDatePipe } from '../../native-date.pipe';

/**
 * Produces element `time` with `datetime` attribute and date formatted in current device locale
 * like "23 июн. 2024 г., 23:59", thus `dateStyle: 'medium', timeStyle: 'short'`
 */
@Component({
  selector: 'app-utils-datetime-view',
  imports: [
    NativeDatePipe,
  ],
  template: `
    <time [attr.datetime]="datetime() | nativeDate : 'iso'">
      {{ datetime() | nativeDate : {dateStyle: 'medium', timeStyle: 'short'} }}
    </time>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeViewComponent {
  datetime = input<Date | number | string | null | undefined>(null);
}
