import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FilestorelistFacade, FolderInfo } from './store/filestore-list.facade';
import { Subject } from 'rxjs';
import { availableSortOptions } from './store/filestore-sort-options';
import { FileInfo } from './store/file-info';

@Component({
  selector: 'mg-filestore-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilestoreListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  availableSortOptions = availableSortOptions;

  constructor(
    public readonly storeFacade: FilestorelistFacade,
  ) { }

  ngOnInit(): void {
   this.storeFacade.handleBeginBrowse();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  handleFolderClick(oneFolder: FolderInfo) {
    this.storeFacade.handleChangeFolder(oneFolder.prefix || '');
  }

  trackFolderInfo(index: number, item: FolderInfo) {
    return item.prefix;
  }

  trackFileInfo(index: number, item: FileInfo) {
    console.log('trackFileInfo: ', item.Key);
    return item.Key;
  }
}
