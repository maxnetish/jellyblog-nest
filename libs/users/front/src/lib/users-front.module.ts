import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list/list.component';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'reg',
    pathMatch: 'full',
  },
  {
    path: 'reg',
    component: UserListComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    UserListComponent,
  ],
  exports: [],
})
export class UsersFrontModule {
}
