import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthActions, AuthFacade } from '@jellyblog-nest/auth/front';
import { map } from 'rxjs';
import { AuthService } from '@jellyblog-nest/auth/front';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'adm-user-widget',
  templateUrl: './user-widget.component.html',
  styleUrls: ['./user-widget.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
})
export class UserWidgetComponent {

  private readonly authFacade = inject(AuthFacade);
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);

  protected readonly loggedIn$ = this.authFacade.user$.pipe(
    map(user => !!user),
  );
  protected readonly username$ = this.authFacade.user$.pipe(
    map(user => user?.username),
  );

  protected handleLogoutClick() {
    this.authService.logout()
      .subscribe(() => {
        this.store.dispatch(AuthActions.gotUserInfo({ user: null }));
      });
  }
}
