import { Injectable } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCreateComponent } from './user-create.component';

@Injectable()
export class UserCreateModalService {

  constructor(
    private readonly modalService: NgbModal,
  ) {
  }

  show() {
    const modalRef = this.modalService.open(
      UserCreateComponent,
      {
        backdrop: false,
        size: 'sm',
        modalDialogClass: 'shadow',
      },
    );
    return (
      modalRef.result as Promise<boolean>
    )
      .then(null, (err) => {
        if ([ModalDismissReasons.ESC, ModalDismissReasons.BACKDROP_CLICK, 'cancel'].indexOf(err) > -1) {
          return;
        }
        throw err;
      });
  }
}
