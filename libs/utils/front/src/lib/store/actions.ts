import { createAction, props } from '@ngrx/store';
import { GlobalToastSeverity } from '@jellyblog-nest/utils/front';

export const loadApp = createAction(
  '[Global action] load app',
);

export const addGlobalToast = createAction(
  '[Global action] Add GlobalToast',
  props<{text: string, severity?: GlobalToastSeverity}>(),
);
