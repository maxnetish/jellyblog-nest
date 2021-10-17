import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { AuthActions, AuthFacade } from '@jellyblog-nest/auth/front';
import { map, Observable } from 'rxjs';
import { LoginFormModalService } from '@jellyblog-nest/auth/front';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';

@Component({
  selector: 'adm-user-widget',
  templateUrl: './user-widget.component.html',
  styleUrls: ['./user-widget.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserWidgetComponent {

  loggedIn$: Observable<boolean>;
  username$: Observable<string | undefined>;

  constructor(
    private readonly authFacade: AuthFacade,
    private readonly loginFormModal: LoginFormModalService,
    private readonly authService: AuthService,
    private store: Store,
  ) {
    this.loggedIn$ = this.authFacade.user$.pipe(
      map(user => !!user),
    );
    this.username$ = this.authFacade.user$.pipe(
      map(user => user?.username),
    );
  }

  handleLoginClick() {
    this.loginFormModal.show();
  }

  handleLogoutClick() {
    this.authService.logout()
      .subscribe(() => {
        this.store.dispatch(AuthActions.gotUserInfo({ user: null }));
      });
  }
}
