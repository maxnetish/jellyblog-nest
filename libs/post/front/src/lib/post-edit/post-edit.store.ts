import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { PostDto, PostUpdateRequest, TagDto } from '@jellyblog-nest/post/model';
import { LoadingStatus, PostContentType, PostPermission, PostStatus, SortOrder } from '@jellyblog-nest/utils/common';
import { catchError, filter, lastValueFrom, map, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { PostService } from '../post.service';
import { TagService } from '../tag.service';
import { Store } from '@ngrx/store';
import { GlobalToastSeverity, GlobalActions } from '@jellyblog-nest/utils/front';

export interface PostEditState {
  initialPost: PostDto;
  loadingStatus: LoadingStatus;
  tags: TagDto[];
  tagsLoadingStatus: LoadingStatus;
  tagsPage: number;
  tagsSearchTerm: string | null;
  tagsHasMore: boolean;
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
  tagsSearchTerm: null,
  tagsHasMore: false,
};

@Injectable()
export class PostEditStore extends ComponentStore<PostEditState> {
  private readonly globalStore = inject(Store);
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
  readonly loading$ = this.loadingStatus$.pipe(
    map((loadingStatus) => {
      return loadingStatus === LoadingStatus.LOADING;
    }),
  );
  readonly tags$ = this.select(state => state.tags);
  readonly tagsLoadingStatus$ = this.select(state => state.tagsLoadingStatus);
  readonly tagsLoading$ = this.tagsLoadingStatus$.pipe(
    map((status) => status === LoadingStatus.LOADING),
  );
  readonly tagsPage$ = this.select(state => state.tagsPage);
  readonly tagsSearchTerm$ = this.select(state => state.tagsSearchTerm);
  readonly tagsHasMore$ = this.select(state => state.tagsHasMore);

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
        this.globalStore.dispatch(GlobalActions.addGlobalToast({
          text: `Loading post failed`,
          severity: GlobalToastSeverity.ERROR,
        }));
        return caught;
      }),
    );
  })

  readonly loadTagsPage = this.effect((searchTerm$: Observable<string | null>) => {
    return searchTerm$.pipe(
      tap((searchTerm) => {
        this.patchState({
          tagsLoadingStatus: LoadingStatus.LOADING,
          tagsSearchTerm: searchTerm || null,
        });
      }),
      switchMap((searchTerm) => {
        return this.tagService.findTags({
          request: {
            content: searchTerm || undefined,
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
          tagsHasMore: response.total > response.page * response.size,
        });
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

  readonly loadTagsNextPage = this.effect((void$: Observable<void>) => {
    return void$.pipe(
      withLatestFrom(
        this.tagsLoadingStatus$,
        this.tagsHasMore$,
        this.tagsSearchTerm$,
        this.tagsPage$,
      ),
      filter(([, tagsLoadingStatus]) => tagsLoadingStatus !== LoadingStatus.LOADING),
      filter(([, , tagsHasMore]) => tagsHasMore),
      tap(() => {
        this.patchState({
          tagsLoadingStatus: LoadingStatus.LOADING,
        });
      }),
      switchMap(([, , ,searchTerm, tagsPage]) => {
        return this.tagService.findTags({
          request: {
            content: searchTerm || undefined,
            page: tagsPage + 1,
            size: this.tagsPageSize,
            order: this.tagsSortOrder,
          },
        });
      }),
      tap((response) => {
        this.patchState((state) => {
          return {
            tags: [
              ...state.tags,
              ...response.list,
            ],
            tagsLoadingStatus: LoadingStatus.SUCCESS,
            tagsPage: response.page,
            tagsHasMore: response.total > response.page * response.size,
          };
        });
      }),
      catchError((error, caught) => {
        console.error('Loading tags failed: ', error);
        this.patchState({
          tagsLoadingStatus: LoadingStatus.FAILED,
        });
        return caught;
      }),
    );
  })

  readonly submitPost = this.effect((post$: Observable<PostUpdateRequest>) => {
    return post$.pipe(
      tap(() => {
        this.patchState({
          loadingStatus: LoadingStatus.LOADING,
        });
      }),
      withLatestFrom(
        this.initialPost$,
      ),
      switchMap(([updatedPost, initialPost]) => {
        if(initialPost.uuid) {
          return this.postService.update({
            uuid: initialPost.uuid,
            request: updatedPost,
          });
        }
        return this.postService.create({
          request: updatedPost,
        });
      }),
      tap((response) => {
        this.patchState({
          loadingStatus: LoadingStatus.SUCCESS,
          initialPost: {...response},
        });
        this.globalStore.dispatch(GlobalActions.addGlobalToast({
          text: `Post #${response.uuid} successfully submitted`,
          severity: GlobalToastSeverity.SUCCESS,
        }));
      }),
      catchError((error, caught) => {
        console.error('Submit failed: ', error);
        this.patchState({
          loadingStatus: LoadingStatus.FAILED,
        });
        this.globalStore.dispatch(GlobalActions.addGlobalToast({
          text: `Submit failed`,
          severity: GlobalToastSeverity.ERROR,
        }));
        return caught;
      }),
    );
  })

  async addNewTag(term: string) {
    this.patchState({
      tagsLoadingStatus: LoadingStatus.LOADING,
    });
    try {
      const addedTag = await lastValueFrom(this.tagService.createTag({
        request: {
          content: term,
        },
      }));
      this.patchState({
        tagsLoadingStatus: LoadingStatus.SUCCESS,
      });
      this.globalStore.dispatch(GlobalActions.addGlobalToast({
        text: `Tag #${addedTag.uuid} created`,
        severity: GlobalToastSeverity.SUCCESS,
      }));
      return addedTag;
    }
    catch (error) {
      this.patchState({
        tagsLoadingStatus: LoadingStatus.FAILED,
      });
      console.warn('add tag failed: ', error);
      this.globalStore.dispatch(GlobalActions.addGlobalToast({
        text: `Create tag failed`,
        severity: GlobalToastSeverity.ERROR,
      }));
      throw error;
    }
  }
}
