import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { UploadFormStore } from './upload-form.store';
import { UntypedFormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IFormControl } from '@rxweb/types';
import { map } from 'rxjs/operators';
import { UploadEvents } from '@jellyblog-nest/utils/front-file-uploader';

@Component({
  selector: 'mg-filestore-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UploadFormStore,
  ],
})
export class UploadFormComponent implements OnInit, OnDestroy {

  private readonly unsubscribe$ = new Subject();

  readonly prefixFormControl = new UntypedFormControl('') as IFormControl<string>;
  readonly revealFilenameControl = new UntypedFormControl(false) as IFormControl<boolean>;

  constructor(
    public readonly componentStore: UploadFormStore,
  ) {
  }

  ngOnInit(): void {
    this.componentStore.prefix$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((prefix) => {
      this.prefixFormControl.setValue(prefix, { emitEvent: false });
    });

    this.componentStore.setPrefix(
      this.prefixFormControl.valueChanges.pipe(
        map(value => value || ''),
      ),
    );

    this.componentStore.setRevealOriginalFileName(
      this.revealFilenameControl.valueChanges.pipe(
        map(value => !!value),
      ),
    );

  }

  handleUploaderEvents(event: UploadEvents.UploadEvent) {
    this.componentStore.handleUploadEvents(event);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

}
