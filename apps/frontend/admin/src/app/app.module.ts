import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ShellAdminModule } from '@jellyblog-nest/shell-admin';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ShellAdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
