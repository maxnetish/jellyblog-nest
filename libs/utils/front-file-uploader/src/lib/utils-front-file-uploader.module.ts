import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileUploaderComponent,
} from './file-uploader/file-uploader.component';
import * as UploadEvents from './file-uploader/file-uploader-events';
import { FileInfo } from './file-uploader/file-info';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FileUploaderComponent,
  ],
  exports: [
    FileUploaderComponent,
  ],
})
export class UtilsFrontFileUploaderModule {
}

export {
  FileUploaderComponent,
  UploadEvents,
  FileInfo,
};
