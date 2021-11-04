import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginFormComponent } from './login-form.component';
import { UserInfoDto } from '@jellyblog-nest/auth/model';

@Injectable({
  providedIn: 'root'
})
export class LoginFormModalService {

  constructor(
    private readonly modalService: NgbModal
  ) {
  }

  show() {
    const modalRef = this.modalService.open(
      LoginFormComponent,
      {
        backdrop: false,
        size: 'sm',
        modalDialogClass: 'shadow'
      },
    );
    return modalRef.result as Promise<UserInfoDto>;
  }
}
