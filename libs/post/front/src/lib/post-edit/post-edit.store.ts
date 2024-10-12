import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PostDto, TagDto } from '@jellyblog-nest/post/model';
import { LoadingStatus, PostContentType, PostPermission, PostStatus, SortOrder } from '@jellyblog-nest/utils/common';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { PostService } from '../post.service';
import { TagService } from '../tag.service';

export interface PostEditState {
  initialPost: PostDto;
  loadingStatus: LoadingStatus;
  tags: TagDto[];
  tagsLoadingStatus: LoadingStatus;
  tagsPage: number;
}

const initialState: PostEditState = {
  initialPost: {
    content: '',
    title: '',
    tags: [],
    brief: null,
    contentType: PostContentType.HTML,
    allowRead: PostPermission.FOR_ME,
    attachments: [],
    author: '',
    hru: null,
    createdAt: new Date(),
    pubDate: null,
    status: PostStatus.DRAFT,
    titleImg: null,
    updatedAt: new Date(),
  },
  loadingStatus: LoadingStatus.INITIAL,
  tags: [],
  tagsLoadingStatus: LoadingStatus.INITIAL,
  tagsPage: 1,
};

@Injectable()
export class PostEditStore extends ComponentStore<PostEditState> {
  private readonly postService = inject(PostService);
  private readonly tagService = inject(TagService);
  private readonly tagsPageSize = 10;
  private readonly tagsSortOrder = {
    content: SortOrder.ASC,
  };

  constructor() {
    super(initialState);
  }

  readonly initialPost$ = this.select(state => state.initialPost);
  readonly loadingStatus$ = this.select(state => state.loadingStatus);
  readonly tags$ = this.select(state => state.tags);
  readonly tagsLoadingStatus$ = this.select(state => state.tagsLoadingStatus);
  readonly tagsLoading$ = this.tagsLoadingStatus$.pipe(
    map((status) => status === LoadingStatus.LOADING),
  );
  readonly tagsPage$ = this.select(state => state.tagsPage);


  readonly loadPost = this.effect((id$: Observable<string | null>) => {
    return id$.pipe(
      tap(() => {
        this.patchState({
          loadingStatus: LoadingStatus.LOADING,
        });
      }),
      filter((id): id is string => !!id),
      switchMap((id) => {
        if (id === 'new') {
          return of({...initialState.initialPost});
        }
        return this.postService.get({
          uuid: id,
        });
      }),
      tap((response) => {
        this.patchState({
          loadingStatus: LoadingStatus.SUCCESS,
          initialPost: {...response},
        });
      }),
      catchError((error, caught) => {
        console.error('Loading post failed: ', error);
        this.patchState({
          loadingStatus: LoadingStatus.FAILED,
        });
        return caught;
      }),
    );
  })

  readonly loadTagsPage = this.effect((tagContent$: Observable<string | null>) => {
    return tagContent$.pipe(
      tap(() => {
        this.patchState({
          tagsLoadingStatus: LoadingStatus.LOADING,
        });
      }),
      switchMap((tagContent) => {
        return this.tagService.findTags({
          request: {
            content: tagContent || undefined,
            page: 1,
            size: this.tagsPageSize,
            order: this.tagsSortOrder,
          },
        });
      }),
      tap((response) => {
        this.patchState({
          tags: [...response.list],
          tagsLoadingStatus: LoadingStatus.SUCCESS,
          tagsPage: response.page,
        })
      }),
      catchError((error, caught) => {
        console.error('Loading tags failed: ', error);
        this.patchState({
          tagsLoadingStatus: LoadingStatus.FAILED,
        });
        return caught;
      }),
    )
  })
}
