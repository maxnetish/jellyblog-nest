import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FileInfo } from '../store/filestore-list.facade';
import { FilestoreListItemStore } from './list-item-store.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'mg-filestore-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FilestoreListItemStore,
  ]
})
export class ListItemComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  @Input() set fileInfo(val: FileInfo) {
    this.store.setFileInfo(val);
  }

  constructor(
    public readonly store: FilestoreListItemStore,
  ) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
  }

}
