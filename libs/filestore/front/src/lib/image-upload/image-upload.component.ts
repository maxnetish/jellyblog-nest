import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPhoto } from '@ng-icons/heroicons/outline';
import { FileChooseDirective, FileDropItem, FileDropZoneDirective } from '@jellyblog-nest/utils/front';
import { delay, fromEvent, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  imports: [
    NgIcon,
    FileDropZoneDirective,
    FileChooseDirective,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      heroPhoto,
    }),
  ],
})
export class ImageUploadComponent implements OnDestroy {

  private unsubscribe$ = new Subject();

  private readonly currentChosenFile = signal<File | null>(null);

  protected readonly previewImageSrc = signal<string | null>(null);

  protected readonly previewImageRef = viewChild<ElementRef<HTMLImageElement>>('previewImageRef');

  protected readonly previewDimention = signal<{ width: number; height: number; } | null>(null);

  protected readonly previewName = computed(() => {
    return this.currentChosenFile()?.name || null;
  })

  constructor() {
    effect(() => {
      const currentChosenFile = this.currentChosenFile();

      if (currentChosenFile) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (evt) => {
          this.previewImageSrc.set(fileReader.result as string);
        }, {once: true});
        fileReader.readAsDataURL(currentChosenFile);
      }
    });

    effect(() => {
      const previewImageRef = this.previewImageRef();

      if (previewImageRef) {
        fromEvent<Event>(previewImageRef.nativeElement, 'load').pipe(
          // FIXME Это не работает
          delay(500),
          map((evt) => {
            const elm = evt.target as HTMLImageElement;
            return {
              width: elm.width,
              height: elm.height,
            };
          }),
          takeUntil(this.unsubscribe$),
        ).subscribe((dim) => {
          this.previewDimention.set(dim);
        });
      }
    });
  }

  protected filesDropped($event: FileDropItem[]) {
    if ($event?.length) {
      this.currentChosenFile.set($event[0].file);
    }
  }

  protected fileChosen($event: FileList | null) {
    if ($event?.length) {
      this.currentChosenFile.set($event[0]);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
