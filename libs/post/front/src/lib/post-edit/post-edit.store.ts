import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PostDto } from '@jellyblog-nest/post/model';
import { LoadingStatus, PostContentType, PostPermission, PostStatus } from '@jellyblog-nest/utils/common';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { PostService } from '../post.service';

export interface PostEditState {
  initialPost: PostDto;
  loadingStatus: LoadingStatus;
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
};

@Injectable()
export class PostEditStore extends ComponentStore<PostEditState> {
  private readonly postService = inject(PostService);

  constructor() {
    super(initialState);
  }

  readonly initialPost$ = this.select(state => state.initialPost);
  readonly loadingStatus$ = this.select(state => state.loadingStatus);

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
}
