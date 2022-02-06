import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '@jellyblog-nest/utils/front';
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
  constructor(
    private readonly ngbModalService: NgbModal,
  ) {
  }

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
    componentInstance.title = title;
    componentInstance.message = message;
    componentInstance.confirmText = confirmText;
    componentInstance.cancelText = cancelText;

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
