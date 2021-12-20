import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FileUploaderComponent
  ],
  exports: [
    FileUploaderComponent
  ],
})
export class UtilsFrontFileUploaderModule {}

export {
  FileUploaderComponent,
}
