import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, defer, map, merge, Observable, Subject, take, takeUntil } from 'rxjs';
import { PostEditStore } from './post-edit.store';
import { AsyncPipe, JsonPipe, NgTemplateOutlet } from '@angular/common';
import { applyDtoToForm, createForm, formToDto } from './post-edit.form';
import {
  PostContentType,
  postContentTypeMap,
  PostPermission,
  postPermissionMap,
  postStatusMap,
} from '@jellyblog-nest/utils/common';
import {
  AceEditorControlDirective,
  DatetimeViewComponent,
  FormItemComponent,
  NativeDatePipe,
} from '@jellyblog-nest/utils/front';
import { LetDirective } from '@ngrx/component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
  NgTagTemplateDirective,
} from '@ng-select/ng-select';
import { TagDto } from '@jellyblog-nest/post/model';
import { AddTagFn } from '@ng-select/ng-select/lib/ng-select.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare, heroCloudArrowUp } from '@ng-icons/heroicons/outline';
import { PreviewPipe } from '@jellyblog-nest/utils/front';

@Component({
    selector: 'app-post-edit',
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
    NgTagTemplateDirective,
    NgIcon,
    NgTemplateOutlet,
    AceEditorControlDirective,
    PreviewPipe,
    DatetimeViewComponent,
  ],
    providers: [
        PostEditStore,
        provideIcons({
            heroCloudArrowUp,
            heroArrowTopRightOnSquare,
        }),
    ],
    templateUrl: './post-edit.component.html',
    styleUrl: './post-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostEditComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject();
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(PostEditStore);
  protected readonly form = createForm();
  protected readonly PostContentType = PostContentType;
  protected readonly togglePreviewBrief = new FormControl(false);
  protected readonly togglePreviewContent = new FormControl(false);

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

  protected readonly tagsSearchInput$ = new Subject<string>();

  protected readonly aceEditorMode$: Observable<string>;

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
    });

    this.store.loadTagsPage(
      this.tagsSearchInput$.pipe(
        debounceTime(1000),
      ),
    );

    this.aceEditorMode$ = merge(
      defer(() => this.form.controls.contentType.value),
      this.form.controls.contentType.valueChanges,
    ).pipe(
      takeUntil(this.unsubscribe$),
      map((contentTypeValue: PostContentType) => {
        switch (contentTypeValue) {
          case PostContentType.MD: {
            return 'ace/mode/markdown';
          }
          case PostContentType.HTML: {
            return 'ace/mode/html';
          }
          default: {
            return 'ace/mode/text';
          }
        }
      }),
    );

    this.form.events.subscribe((e) => {
      // DEBUG
      console.log('form event: ', e);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  protected readonly postStatusMap = postStatusMap;

  protected compareTagOptions(a: TagDto, b: TagDto) {
    return a.uuid === b.uuid;
  }

  protected trackTagOptions(item: TagDto) {
    return item.uuid;
  }

  protected readonly addNewTag: AddTagFn = (term) => {
    return this.store.addNewTag(term);
  }

  protected tagsScrollToEnd() {
    this.store.loadTagsNextPage();
  }

  protected saveButtonClick() {
    if (!this.form.valid) {
      return;
    }

    this.store.initialPost$.pipe(
      take(1),
    ).subscribe((initialPost) => {
      const updateDto = formToDto(this.form, initialPost);
      this.store.submitPost(updateDto);
    });
  }
}
