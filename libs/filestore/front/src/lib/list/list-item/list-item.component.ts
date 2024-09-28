import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  input,
} from '@angular/core';
import { FilestoreListItemStore } from './list-item-store.service';
import { Subject, takeUntil } from 'rxjs';
import { FileInfo } from '../store/file-info';
import { FilestorelistFacade } from '../store/filestore-list.facade';
import { take } from 'rxjs/operators';
import { v4 } from 'uuid';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import {
  AppendResponseContentDispositionPipe,
  AppValidators,
  CollapseTitleComponent,
  HumanFileSizePipe,
  NativeDatePipe,
  S3FileUrlPipe, ValidationMessageComponent,
} from '@jellyblog-nest/utils/front';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowTopRightOnSquare,
  heroCheck,
  heroClipboard,
  heroCloudArrowDown,
  heroGlobeAlt, heroPencil,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgOptimizedImage } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

class RenameFormModel {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(3)
  key = '';
}

function replaceOnlyLastKeySegment(inputKey: string, replace: string): string {
  const segments = inputKey.split('/');
  segments[segments.length - 1] = replace;
  return segments.join('/');
}

@Component({
  selector: 'mg-filestore-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FilestoreListItemStore,
    provideIcons({
      heroXMark,
      heroClipboard,
      heroGlobeAlt,
      heroCheck,
      heroCloudArrowDown,
      heroArrowTopRightOnSquare,
      heroPencil,
    }),
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PushPipe,
    CollapseTitleComponent,
    HumanFileSizePipe,
    NativeDatePipe,
    S3FileUrlPipe,
    AppendResponseContentDispositionPipe,
    LetDirective,
    NgIconComponent,
    ValidationMessageComponent,
    NgbCollapse,
    NgOptimizedImage,
  ],
})
export class ListItemComponent implements OnDestroy {

  protected readonly store = inject(FilestoreListItemStore);
  protected readonly listFacade = inject(FilestorelistFacade);

  private unsubscribe$ = new Subject();

  protected renameForm = new FormGroup(
    {
      key: new FormControl(''),
    },
    {
      validators: [
        AppValidators.classValidatorToSyncValidator(RenameFormModel),
      ],
    },
  );

  /**
   * https://github.com/microsoft/TypeScript/issues/44632
   * So use
   * "target": "es2020"
   */
  protected readonly dateOptions: Intl.DateTimeFormatOptions = {
    dateStyle: 'short',
    timeStyle: 'short',
  };

  readonly fileInfo = input<FileInfo>();

  constructor() {
    this.store.setFileInfo(toObservable(this.fileInfo));

    this.store.fileKey$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((fileKey) => {
      this.renameForm.patchValue({
        key: fileKey,
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  protected renameKeyInsertOriginalName() {
    this.store.detailsMetadata$.pipe(
      take(1),
    ).subscribe((meta) => {
      const originalNameMetadataItem = meta.find(m => m.name === 'originalname');
      if (originalNameMetadataItem) {
        const currentKey = this.renameForm.value?.key || '';
        this.renameForm.patchValue({
          key: replaceOnlyLastKeySegment(currentKey, originalNameMetadataItem.value),
        });
      }
    });
  }

  protected renameKeyInsertNewUid() {
    const currentKey = this.renameForm.value?.key || '';
    this.renameForm.patchValue({
      key: replaceOnlyLastKeySegment(currentKey, v4()),
    });
  }


  protected submitRenameKey(shortFileInfo?: FileInfo, renameForm?: ListItemComponent['renameForm']) {
    if (!(shortFileInfo && renameForm)) {
      return;
    }
    if (!renameForm.valid) {
      renameForm.markAllAsTouched();
      return;
    }
    const {value} = renameForm;
    if (value && value.key) {
      this.listFacade.handleRenameObject(shortFileInfo.Key || '', value.key);
    }
  }
}
