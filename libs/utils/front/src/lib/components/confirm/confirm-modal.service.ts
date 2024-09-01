import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from './confirm.component';
import { map, race } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmModalService {

  private readonly ngbModalService = inject(NgbModal);

  show(
    {
      title = 'Подтверждение',
      message = 'Продолжить?',
      confirmText = 'Да',
      cancelText = 'Отставить',
    }: ConfirmOptions = {}) {
    const modalRef = this.ngbModalService.open(
      ConfirmComponent,
      {
        backdrop: false,
        size: 'sm',
        modalDialogClass: 'shadow',
      },
    );
    const componentInstance = modalRef.componentInstance as ConfirmComponent;
    componentInstance.title.set(title);
    componentInstance.message.set(message);
    componentInstance.confirmText.set(confirmText);
    componentInstance.cancelText.set(cancelText);

    return race(
      modalRef.closed,
      modalRef.dismissed,
    ).pipe(
      map((result) => {
        return result === 'confirm';
      }),
    );
  }
}
