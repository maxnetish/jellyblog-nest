import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileChooseDirective } from '@jellyblog-nest/utils/front';

@Component({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FileChooseDirective,
  ],
  templateUrl: './file-choose-demo.component.html',
  styleUrl: './file-choose-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileChooseDemoComponent {

  protected fileChooseAccept = model<string>('image/*');

  protected fileChooseDisabled = model(false);

  protected fileChooseCapture = model('user');

  protected fileChooseMultiple = model(false);

  protected fileChosen = signal<FileList | null>(null);

  protected fileChosenAsArray = computed<File[]>(() => {
    console.log('chosen files: ', this.fileChosen());
    if (this.fileChosen()) {
      return Array.from(this.fileChosen());
    }
    return [];
  })

}
