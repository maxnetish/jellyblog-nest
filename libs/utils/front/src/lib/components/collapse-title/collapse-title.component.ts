import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronRight } from '@ng-icons/heroicons/outline';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-utils-collapse-title',
  templateUrl: './collapse-title.component.html',
  styleUrl: './collapse-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIconComponent,
    NgClass,
  ],
  providers: [
    provideIcons({
      heroChevronRight,
    }),
  ],
})
export class CollapseTitleComponent {
  readonly collapsed = input(true);
  readonly toggle = output();
}
