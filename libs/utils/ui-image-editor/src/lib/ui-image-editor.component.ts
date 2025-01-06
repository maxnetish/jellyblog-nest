import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mg-ui-image-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-image-editor.component.html',
  styleUrl: './ui-image-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiImageEditorComponent {}
