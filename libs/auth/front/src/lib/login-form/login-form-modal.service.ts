import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginFormComponent } from './login-form.component';
import { map, Observable, race } from 'rxjs';

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

    loginForm.cancel.subscribe(() => {
      modalRef.dismiss('cancel');
    });

    loginForm.successSubmit.subscribe(() => {
      modalRef.close('success');
    });

    return race(
      modalRef.dismissed.pipe(map(() => 'cancel')),
      modalRef.closed.pipe(map(() => 'success')),
    );
  }
}
