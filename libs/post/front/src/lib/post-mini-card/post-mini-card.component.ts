import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostShortDto } from '@jellyblog-nest/post/model';
import { NativeDatePipe } from '@jellyblog-nest/utils/front';
import { postStatusMap } from '@jellyblog-nest/utils/common';
import { postPermissionMap } from '../../../../../utils/common/src/lib/post-permission';
import { NgIcon, NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare, heroPencil, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-mini-card',
  standalone: true,
  imports: [
    NativeDatePipe,
    NgIcon,
    NgIconComponent,
    RouterLink,
  ],
  providers: [
    provideIcons({
      heroPencil,
      heroArrowTopRightOnSquare,
    }),
  ],
  templateUrl: './post-mini-card.component.html',
  styleUrl: './post-mini-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostMiniCardComponent {
  readonly post = input<PostShortDto>();
  protected readonly postStatusMap = postStatusMap;
  protected readonly postPermissionMap = postPermissionMap;
}
