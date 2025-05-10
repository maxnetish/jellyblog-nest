import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPhoto } from '@ng-icons/heroicons/outline';

@Component({
  imports: [
    NgIcon,
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
export class ImageUploadComponent {

  protected readonly fileInputAccept = 'image/*';

  protected fileInputChange(fileInputRef: HTMLInputElement) {

  }
}
