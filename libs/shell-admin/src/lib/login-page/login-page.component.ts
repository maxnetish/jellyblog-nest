import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginFormComponent } from '@jellyblog-nest/auth/front';

@Component({
    selector: 'adm-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        LoginFormComponent,
    ]
})
export class LoginPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected formSubmitted() {
    const redirectPath = this.route.snapshot.queryParamMap.get('afterLogin') || '/users';
    this.router.navigate([redirectPath]);
  }
}
