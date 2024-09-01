import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-utils-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ModalContentComponent {
  activeModal = input<NgbActiveModal>();
  modalTitle = input<string>();

  dismissModal(reason: string) {
    const activeModal = this.activeModal();
    if (activeModal) {
      activeModal.dismiss(reason);
    }
  }
}
