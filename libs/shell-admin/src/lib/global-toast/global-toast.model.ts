import { GlobalToastSeverity } from '@jellyblog-nest/utils/front';

export interface GlobalToastModel {
  severity: GlobalToastSeverity;
  text: string;
  id: string;
}

