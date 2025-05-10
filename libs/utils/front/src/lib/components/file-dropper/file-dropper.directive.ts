import { Directive, input, output } from '@angular/core';
import { extractFiles } from './extract-files';

export type FileDropperDragState = 'drag' | 'none';

@Directive({
  selector: '[appUtilsFileDrop]',
  standalone: true,
  host: {
    '(dragenter)': 'dragenter($event)',
    '(dragover)': 'dragover($event)',
    '(drop)': 'drop($event)',
    '(dragleave)': 'dragleave($event)',
  },
})
export class FileDropperDirective {

  fileDropAccept = input<string>();

  fileDropTraverseDirectories = input(false);

  fileDropStateChange = output<FileDropperDragState>();

  fileDropDrop = output<File[]>();

  protected dragenter($event: DragEvent) {
    // see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
    // dataTransfer.files will be in drop event
    if ($event.dataTransfer?.items?.length) {
      $event.dataTransfer.dropEffect = 'copy';
      this.fileDropStateChange.emit('drag');
    }
  }

  dragover($event: DragEvent) {
    if ($event.dataTransfer?.items?.length) {
      $event.dataTransfer.dropEffect = 'copy';
      // we should prevent default to catch drop
      // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
      return false;
    }
    return true;
  }

  drop($event: DragEvent) {
    this.fileDropStateChange.emit('none');
    if ($event.dataTransfer?.items) {
      this.asyncDrop($event.dataTransfer.items);
    }
    return false;
  }

  dragleave($event: DragEvent) {
    this.fileDropStateChange.emit('none');
  }

  private async asyncDrop(items: DataTransferItemList) {
    const droppedFiles = await extractFiles({
      list: items,
      accept: this.fileDropAccept(),
      traverseDirectories: this.fileDropTraverseDirectories(),
    });
    this.fileDropDrop.emit(droppedFiles);
  }
}
