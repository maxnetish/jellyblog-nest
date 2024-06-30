import { createAction, props } from '@ngrx/store';
import { PostShortDto } from '@jellyblog-nest/post/model';
import { Page } from '@jellyblog-nest/utils/common';

export const init = createAction('[Pots reg] Init');

export const gotPage = createAction(
  '[Pots reg] Got page',
  props<{page: Page<PostShortDto>}>(),
);

export const failPage = createAction(
  '[Pots reg] Fail page',
  props<{error: any}>(),
);
