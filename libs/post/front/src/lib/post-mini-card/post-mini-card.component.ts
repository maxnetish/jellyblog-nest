import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostShortDto } from '@jellyblog-nest/post/model';
import { DatetimeViewComponent } from '@jellyblog-nest/utils/front';
import { postStatusMap, postPermissionMap } from '@jellyblog-nest/utils/common';
import { NgIcon, NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare, heroPencil } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-post-mini-card',
  imports: [
    NgIcon,
    NgIconComponent,
    RouterLink,
    DatetimeViewComponent,
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
