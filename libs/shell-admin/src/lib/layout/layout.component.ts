import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalActions, GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Component({
  selector: 'adm-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LayoutComponent implements OnInit {

  constructor(
    private readonly store: Store,
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(GlobalActions.loadApp());
  }

}
