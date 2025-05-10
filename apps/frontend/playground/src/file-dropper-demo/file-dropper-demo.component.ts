import { ChangeDetectionStrategy, Component, computed, effect, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropperDirective, FileDropperDragState } from '@jellyblog-nest/utils/front';

@Component({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FileDropperDirective,
  ],
  templateUrl: './file-dropper-demo.component.html',
  styleUrl: './file-dropper-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropperDemoComponent {

  protected accept = model('image/*');

  protected traverseDirectories = model(false);

  protected fileDropperState = signal<FileDropperDragState>('none');

  protected fileDropped = signal<File[]>(null);

  protected readonly fileDroppedAsArray = computed(() => {
    const fileDropped = this.fileDropped();

    if(fileDropped?.length) {
      return Array.from(fileDropped);
    }

    return [];
  });

  constructor() {
    effect(() => {
      const fileDroppedAsArray = this.fileDroppedAsArray();
      console.log('file dropped: ', fileDroppedAsArray);
    });
  }

}
