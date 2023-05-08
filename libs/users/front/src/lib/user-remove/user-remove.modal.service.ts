import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRemoveComponent } from './user-remove.component';
import { map, race } from 'rxjs';

@Injectable()
export class UserRemoveModalService {
  constructor(
    private readonly modalService: NgbModal,
  ) {
  }

  show({userId, userName}: {userId: string, userName: string}) {
    const modalRef = this.modalService.open(
      UserRemoveComponent,
      {
        backdrop: true,
        size: 'sm',
        modalDialogClass: 'shadow',
      },
    );

    const instance = modalRef.componentInstance as UserRemoveComponent;
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
