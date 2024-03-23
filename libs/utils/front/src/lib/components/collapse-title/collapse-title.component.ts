import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-utils-collapse-title',
  templateUrl: './collapse-title.component.html',
  styleUrl: './collapse-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapseTitleComponent {

  @Input() collapsed: boolean | null = true;
  @Output() toggle = new EventEmitter();


}
