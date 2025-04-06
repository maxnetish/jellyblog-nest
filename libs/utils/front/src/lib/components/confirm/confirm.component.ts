import { Component, ViewEncapsulation, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../modal-content/modal-content.component';

@Component({
    selector: 'app-utils-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ModalContentComponent,
    ]
})
export class ConfirmComponent {

  readonly title = signal('Подтверждение');
  readonly message = signal('Продолжить?');
  readonly cancelText = signal('Нет');
  readonly confirmText = signal('Да');

  protected readonly modal = inject(NgbActiveModal);
}
