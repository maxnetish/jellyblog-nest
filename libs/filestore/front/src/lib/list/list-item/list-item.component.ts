import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FileMetadataItem, FilestoreListItemStore } from './list-item-store.service';
import { Subject } from 'rxjs';
import { FileInfo } from '../store/file-info';
import { FilestorelistFacade } from '../store/filestore-list.facade';

@Component({
  selector: 'mg-filestore-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FilestoreListItemStore,
  ],
})
export class ListItemComponent implements OnDestroy {

  private unsubscribe$ = new Subject();

  @Input() set fileInfo(val: FileInfo) {
    this.store.setFileInfo(val);
  }

  constructor(
    public readonly store: FilestoreListItemStore,
    public readonly listFacade: FilestorelistFacade,
  ) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  trackMetadata(ind: number, value: FileMetadataItem) {
    return value.name;
  }
}
