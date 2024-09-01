import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileUploaderComponent,
} from './file-uploader/file-uploader.component';
import * as UploadEvents from './file-uploader/file-uploader-events';
import { FileInfo, fileInfoFromFile, fileInfoFromHeadObjectCommandOutput } from './file-uploader/file-info';

@NgModule({
  imports: [CommonModule, FileUploaderComponent],
  declarations: [],
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
  fileInfoFromFile,
  fileInfoFromHeadObjectCommandOutput
};
