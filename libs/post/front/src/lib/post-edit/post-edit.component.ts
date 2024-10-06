import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { PostEditStore } from './post-edit.store';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { applyDtoToForm, createForm } from './post-edit.form';
import {
  PostContentType,
  PostPermission,
  postStatusMap,
  postPermissionMap,
  postContentTypeMap,
} from '@jellyblog-nest/utils/common';
import { FormItemComponent, NativeDatePipe } from '@jellyblog-nest/utils/front';
import { LetDirective } from '@ngrx/component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';


@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NativeDatePipe,
    LetDirective,
    ReactiveFormsModule,
    FormItemComponent,
    NgSelectComponent,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
  ],
  providers: [
    PostEditStore,
  ],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject();
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(PostEditStore);
  protected readonly form = createForm();

  protected readonly permissionOptions = Object.values(PostPermission).map((permissionCode) => {
    return {
      code: permissionCode,
      label: postPermissionMap[permissionCode].label,
      description: postPermissionMap[permissionCode].description,
      badgeClass: postPermissionMap[permissionCode].badgeClass,
    };
  });

  protected readonly contentTypeOptions = Object.values(PostContentType).map((contentTypeCode) => {
    return {
      code: contentTypeCode,
      label: postContentTypeMap[contentTypeCode].label,
      description: postContentTypeMap[contentTypeCode].description,
    };
  });

  constructor() {
    this.store.loadPost(
      this.route.paramMap.pipe(
        map((paramMap) => paramMap.get('id')),
        takeUntil(this.unsubscribe$),
      ),
    );

    this.store.initialPost$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((initialPost) => {
      applyDtoToForm(this.form, initialPost);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  protected readonly postStatusMap = postStatusMap;
}
