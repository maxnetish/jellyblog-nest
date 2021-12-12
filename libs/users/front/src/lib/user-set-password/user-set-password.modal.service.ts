import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSetPasswordComponent } from './user-set-password.component';
import { map, race } from 'rxjs';

@Injectable()
export class UserSetPasswordModalService {

  constructor(
    private readonly modalService: NgbModal,
  ) {
  }

  show({userId, userName}: { userId: string, userName: string }) {
    const modalRef = this.modalService.open(
      UserSetPasswordComponent,
      {
        backdrop: false,
        size: 'sm',
        modalDialogClass: 'shadow',
      },
    );

    const instance = modalRef.componentInstance as UserSetPasswordComponent;
    instance.userId = userId;
    instance.userName = userName;

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
