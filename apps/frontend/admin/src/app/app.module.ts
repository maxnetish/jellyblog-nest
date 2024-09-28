import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutComponent, ShellAdminModule } from '@jellyblog-nest/shell-admin';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ShellAdminModule,
    NgSelectModule,
    LayoutComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
