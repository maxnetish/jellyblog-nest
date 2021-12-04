import { Injectable } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCreateComponent } from './user-create.component';
import { map, race, switchMap } from 'rxjs';

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

    return race(
      modalRef.closed,
      modalRef.dismissed,
    ).pipe(
      map((resultOrCancel) => {
        if (resultOrCancel === true) {
          return true;
        }
        return false;
      }),
    );

  }
}
