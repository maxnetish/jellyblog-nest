import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FilestorelistFacade } from './store/filestore-list.facade';

@Component({
  selector: 'mg-filestore-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilestoreListComponent implements OnInit {

  constructor(
    public readonly storeFacade: FilestorelistFacade,
  ) { }

  ngOnInit(): void {
    this.storeFacade.handleInitList();
  }

}
