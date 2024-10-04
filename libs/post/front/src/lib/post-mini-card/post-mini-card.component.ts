import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostShortDto } from '@jellyblog-nest/post/model';
import { NativeDatePipe } from '@jellyblog-nest/utils/front';
import { postStatusMap } from '@jellyblog-nest/utils/common';

@Component({
  selector: 'app-post-mini-card',
  standalone: true,
  imports: [
    NativeDatePipe,
  ],
  templateUrl: './post-mini-card.component.html',
  styleUrl: './post-mini-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostMiniCardComponent {
  readonly post = input<PostShortDto>();
  protected readonly postStatusMap = postStatusMap;
}
