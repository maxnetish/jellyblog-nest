import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'adm-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  formSubmitted() {
    const redirectPath = this.route.snapshot.queryParamMap.get('afterLogin') || '/users';
    this.router.navigate([redirectPath]);
  }

}
