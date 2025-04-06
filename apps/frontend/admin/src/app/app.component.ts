import { Component, ViewEncapsulation } from '@angular/core';
import { LayoutComponent } from '@jellyblog-nest/shell-admin';

@Component({
  templateUrl: './app.component.html',
  selector: 'admin-app-root',
  imports: [
    LayoutComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.global-styles.scss'],
})
export class AppComponent {
  title = 'frontend-admin';
}
