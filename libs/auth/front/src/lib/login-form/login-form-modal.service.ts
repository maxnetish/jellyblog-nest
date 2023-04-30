import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginFormComponent } from './login-form.component';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { map, mapTo, Observable, race, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginFormModalService {

  constructor(
    private readonly modalService: NgbModal
  ) {
  }

  show(): Observable<'cancel' | 'success' | string> {
    const modalRef = this.modalService.open(
      LoginFormComponent,
      {
        backdrop: false,
        size: 'sm',
      },
    );

    const loginForm = modalRef.componentInstance as LoginFormComponent;

    loginForm.cancel.pipe(
      take(1),
    ).subscribe(() => {
      modalRef.dismiss('cancel');
    });

    loginForm.successSubmit.pipe(
      take(1),
    ).subscribe(() => {
      modalRef.close('success');
    });

    return race(
      modalRef.dismissed.pipe(map(() => 'cancel')),
      modalRef.closed.pipe(map(() => 'success')),
    );
  }
}
