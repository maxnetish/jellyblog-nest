import { createAction, props } from '@ngrx/store';
import { GlobalToastSeverity } from '../global-toast-severity';

export const noop = createAction(
  '[Global action] noop',
)

export const loadApp = createAction(
  '[Global action] load app',
);

export const addGlobalToast = createAction(
  '[Global action] Add GlobalToast',
  props<{text: string, severity?: GlobalToastSeverity}>(),
);
