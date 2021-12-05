import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-utils-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContentComponent {
  @Input() activeModal?: NgbActiveModal;
  @Input() modalTitle?: string;

  dismissModal(reason: string) {
    if (this.activeModal) {
      this.activeModal.dismiss(reason);
    }
  }
}
