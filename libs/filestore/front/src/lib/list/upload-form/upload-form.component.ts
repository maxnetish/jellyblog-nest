import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
import { UploadFormStore } from './upload-form.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileUploaderComponent, UploadEvents } from '@jellyblog-nest/utils/front-file-uploader';
import { PushPipe } from '@ngrx/component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCloudArrowUp } from '@ng-icons/heroicons/outline';

@Component({
    selector: 'mg-filestore-upload-form',
    templateUrl: './upload-form.component.html',
    styleUrls: ['./upload-form.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        UploadFormStore,
        provideIcons({
            heroCloudArrowUp,
        }),
    ],
    imports: [
        FileUploaderComponent,
        PushPipe,
        NgIconComponent,
        ReactiveFormsModule,
    ]
})
export class UploadFormComponent implements OnInit, OnDestroy {

  protected readonly componentStore = inject(UploadFormStore);
  private readonly unsubscribe$ = new Subject();
  protected readonly prefixFormControl = new FormControl('');
  protected readonly revealFilenameControl = new FormControl(false);

  ngOnInit(): void {
    this.componentStore.prefix$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((prefix) => {
      this.prefixFormControl.setValue(prefix, {emitEvent: false});
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

  protected handleUploaderEvents(event: UploadEvents.UploadEvent) {
    this.componentStore.handleUploadEvents(event);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
