import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
