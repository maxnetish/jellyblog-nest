import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { FilestorelistFacade, FolderInfo } from './store/filestore-list.facade';
import { availableSortOptions } from './store/filestore-sort-options';
import { AsyncPipe } from '@angular/common';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowSmallUp, heroBarsArrowDown, heroBarsArrowUp, heroFolder } from '@ng-icons/heroicons/outline';
import { LetDirective, PushPipe } from '@ngrx/component';
import { CollapseTitleComponent } from '@jellyblog-nest/utils/front';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { ListItemComponent } from './list-item/list-item.component';

@Component({
    selector: 'mg-filestore-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        NgbDropdown,
        NgIconComponent,
        PushPipe,
        NgbDropdownMenu,
        NgbDropdownItem,
        CollapseTitleComponent,
        NgbCollapse,
        UploadFormComponent,
        LetDirective,
        ListItemComponent,
        NgbDropdownToggle,
    ],
    providers: [
        provideIcons({
            heroBarsArrowDown,
            heroBarsArrowUp,
            heroArrowSmallUp,
            heroFolder,
        }),
    ]
})
export class FilestoreListComponent implements OnInit {

  protected readonly storeFacade = inject(FilestorelistFacade);
  protected readonly availableSortOptions = availableSortOptions;

  ngOnInit(): void {
    this.storeFacade.handleBeginBrowse();
  }

  protected handleFolderClick(oneFolder: FolderInfo) {
    this.storeFacade.handleChangeFolder(oneFolder.prefix || '');
  }
}
