import { createAction, props } from '@ngrx/store';

export const removeToast = createAction(
  '[GlobalToast] Remove GlobalToast',
  props<{id: string}>(),
)




