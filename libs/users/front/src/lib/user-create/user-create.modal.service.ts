import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCreateComponent } from './user-create.component';
import { map, race } from 'rxjs';

@Injectable()
export class UserCreateModalService {

  private readonly modalService = inject(NgbModal);

  show() {
    const modalRef = this.modalService.open(
      UserCreateComponent,
      {
        backdrop: true,
        size: 'sm',
        modalDialogClass: 'shadow',
      },
    );

    return race(
      modalRef.closed,
      modalRef.dismissed,
    ).pipe(
      map((resultOrCancel) => {
        return resultOrCancel === true;
      }),
    );

  }
}
