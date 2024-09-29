import { Component } from '@angular/core';
import { LayoutComponent } from '@jellyblog-nest/shell-admin';

@Component({
  templateUrl: './app.component.html',
  selector: 'admin-app-root',
  standalone: true,
  imports: [
    LayoutComponent,
  ],
})
export class AppComponent {
  title = 'frontend-admin';
}
