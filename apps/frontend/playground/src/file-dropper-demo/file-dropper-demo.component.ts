import { ChangeDetectionStrategy, Component, effect, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropZoneDirective, FileDropState, FileDropItem } from '@jellyblog-nest/utils/front';

@Component({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FileDropZoneDirective,
  ],
  templateUrl: './file-dropper-demo.component.html',
  styleUrl: './file-dropper-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileDropperDemoComponent {

  protected accept = model('image/*');

  protected traverseDirectories = model(false);

  protected fileDropDisabled = model(false);

  protected fileDropState = signal<FileDropState>('none');

  protected filesDropped = signal<FileDropItem[]>(null);

  protected fileDropFailed = signal<unknown>(null);

  constructor() {
    effect(() => {
      console.log('file dropped: ', this.filesDropped());
    });
    effect(() => {
      console.log('failed: ', this.fileDropFailed());
    });
  }

  dragstartInDraggable($event: DragEvent) {
    $event.dataTransfer.setData('text/plain', 'drag something...');
  }
}
