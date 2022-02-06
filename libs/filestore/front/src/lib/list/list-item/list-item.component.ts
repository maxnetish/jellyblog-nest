import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FileMetadataItem, FilestoreListItemStore } from './list-item-store.service';
import { Subject, takeUntil } from 'rxjs';
import { FileInfo } from '../store/file-info';
import { FilestorelistFacade } from '../store/filestore-list.facade';
import { take } from 'rxjs/operators';
import { v4 } from 'uuid';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AppValidators } from '@jellyblog-nest/utils/front';

class RenameFormModel {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(3)
  key = '';
}

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
  private formBuilder: IFormBuilder;

  renameForm: IFormGroup<RenameFormModel>;

  @Input() set fileInfo(val: FileInfo) {
    this.store.setFileInfo(val);
  }

  constructor(
    public readonly store: FilestoreListItemStore,
    public readonly listFacade: FilestorelistFacade,
    fb: FormBuilder,
  ) {
    this.formBuilder = fb;

    this.renameForm = this.formBuilder.group<RenameFormModel>(
      {
        key: [''],
      },
      {
        validators: [
          AppValidators.classValidatorToSyncValidator(RenameFormModel),
        ],
      },
    );

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

  trackMetadata(ind: number, value: FileMetadataItem) {
    return value.name;
  }

  renameKeyInsertOriginalName() {
    this.store.detailsMetadata$.pipe(
      take(1),
    ).subscribe((meta) => {
      const originalNameMetadataItem = meta.find(m => m.name === 'originalname');
      if (originalNameMetadataItem) {
        this.renameForm.patchValue({
          key: originalNameMetadataItem.value,
        });
      }
    });
  }

  renameKeyInsertNewUid() {
    this.renameForm.patchValue({
      key: v4(),
    });
  }


  submitRenameKey(shortFileInfo: FileInfo, renameForm: IFormGroup<RenameFormModel>) {
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
