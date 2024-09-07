import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserUpdateComponent } from './user-update.component';
import { map, race } from 'rxjs';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

@Injectable()
export class UserUpdateModalService {

  private readonly modalService = inject(NgbModal);

  show(user: UserInfoDto) {
    const modalRef = this.modalService.open(
      UserUpdateComponent,
      {
        backdrop: true,
        size: 'sm',
        modalDialogClass: 'shadow',
      },
    );

    const component = modalRef.componentInstance as UserUpdateComponent;
    component.userDto.set(user);

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
