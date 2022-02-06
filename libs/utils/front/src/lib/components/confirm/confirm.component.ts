import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-utils-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {

  @Input() title = 'Подтверждение';
  @Input() message = 'Продолжить?';
  @Input() cancelText = 'Нет';
  @Input() confirmText = 'Да';

  constructor(
    public readonly modal: NgbActiveModal,
  ) {
  }

}
