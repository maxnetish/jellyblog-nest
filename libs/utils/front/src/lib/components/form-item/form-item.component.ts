import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-utils-form-item',
    imports: [
        ValidationMessageComponent,
        NgTemplateOutlet,
    ],
    templateUrl: './form-item.component.html',
    styleUrl: './form-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormItemComponent {

  readonly layout = input<'vertical' | 'floating'>('floating');
  readonly controlId = input<string>();
  readonly controlLabel = input<string>();
  readonly controlDescription = input<string>();
  readonly controlValidationName = input<string>();

}
