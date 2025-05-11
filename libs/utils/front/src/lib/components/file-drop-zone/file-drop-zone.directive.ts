import { Directive, input, output } from '@angular/core';
import { extractFiles } from './extract-files';
import { FileDropItem } from './file-drop-item';

export type FileDropState = 'collect' | 'drag' | 'none';

/**
 * Element become target of dropping of files/directories.
 */
@Directive({
  selector: '[appUtilsFileDropZone]',
  standalone: true,
  host: {
    '(dragenter)': 'dragenter($event)',
    '(dragover)': 'dragover($event)',
    '(drop)': 'drop($event)',
    '(dragleave)': 'dragleave($event)',
  },
})
export class FileDropZoneDirective {

  /**
   * Same as {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept accept attribute}
   * of input with 'file' type.
   *
   */
  fileDropAccept = input<string>();

  /**
   * Traverse deep in directories
   */
  fileDropTraverseDirectories = input(false);

  /**
   * Didn't do anything on drag events
   */
  fileDropDisabled = input(false);

  /**
   * Emits when directive change state:
   *
   * * `drag` something dragged over element
   * * `collect` while we collect files from file system. This can be relatively
   * long for a deeply nested directory with a large number of files.
   * * `none` nothing special
   */
  fileDropStateChange = output<FileDropState>();

  /**
   * Emits after dropping and collecting files. We choose files that matches
   * `fileDropAccept` parameter.
   */
  filesDropped = output<FileDropItem[]>();

  /**
   * Emits if we catch exception from file system (permissions etc.)
   */
  filesDropFailed = output<unknown>();

  protected dragenter($event: DragEvent) {
    if (this.fileDropDisabled()) {
      return;
    }

    // see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
    // dataTransfer.files will be in drop event
    // dataTransfer.items also will be in drop event
    // (chrome sends dataTransfer.items in dragenter, dragover, but safari won't)
    if ($event.dataTransfer) {
      $event.dataTransfer.dropEffect = 'copy';
      this.fileDropStateChange.emit('drag');
    }
  }

  protected dragover($event: DragEvent) {
    if (this.fileDropDisabled()) {
      return true;
    }

    if ($event.dataTransfer) {
      $event.dataTransfer.dropEffect = 'copy';
      // we should prevent default to catch drop
      // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
      return false;
    }
    return true;
  }

  protected drop($event: DragEvent) {
    if (this.fileDropDisabled()) {
      return true;
    }

    this.fileDropStateChange.emit('none');
    if ($event.dataTransfer?.items) {
      this.asyncDrop($event.dataTransfer.items);
    }
    return false;
  }

  protected dragleave($event: DragEvent) {
    if (this.fileDropDisabled()) {
      return;
    }

    this.fileDropStateChange.emit('none');
  }

  private async asyncDrop(items: DataTransferItemList) {
    try {
      this.fileDropStateChange.emit('collect');
      const droppedFiles = await extractFiles({
        list: items,
        accept: this.fileDropAccept(),
        traverseDirectories: this.fileDropTraverseDirectories(),
      });
      this.fileDropStateChange.emit('none');
      this.filesDropped.emit(droppedFiles);
    } catch (error) {
      this.fileDropStateChange.emit('none');
      this.filesDropFailed.emit(error);
    }
  }
}
