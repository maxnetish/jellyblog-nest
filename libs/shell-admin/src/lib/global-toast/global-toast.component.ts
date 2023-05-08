import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalToastModel } from './global-toast.model';
import * as GlobalToastSelectors from './store/global-toast.selectors';
import * as GlobalToastActions from './store/global-toast.actions';
import { GlobalToastSeverity } from '@jellyblog-nest/utils/front';

@Component({
  selector: 'adm-global-toast',
  templateUrl: './global-toast.component.html',
  styleUrls: ['./global-toast.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalToastComponent {

  toasts$: Observable<GlobalToastModel[]>;
  headerBySeverity: {[key in GlobalToastSeverity]: string} = {
    [GlobalToastSeverity.ERROR]: 'Ошибка',
    [GlobalToastSeverity.INFO]: 'Сообщение',
    [GlobalToastSeverity.SUCCESS]: 'Успешно',
  };
  delayBySeverity: {[key in GlobalToastSeverity]: number} = {
    [GlobalToastSeverity.ERROR]: 1000000,
    [GlobalToastSeverity.INFO]: 5000,
    [GlobalToastSeverity.SUCCESS]: 5000,
  };
  classBySeverity: {[key in GlobalToastSeverity]: string} = {
    [GlobalToastSeverity.ERROR]: 'bg-danger text-light',
    [GlobalToastSeverity.INFO]: '',
    [GlobalToastSeverity.SUCCESS]: 'bg-success text-light',
  };

  constructor(
    private readonly store: Store,
  ) {
    this.toasts$ = this.store.select(GlobalToastSelectors.selectToasts);
  }

  trackToasts(ind: number, toast: GlobalToastModel) {
    return toast.id;
  }

  handleToastHidden(toast: GlobalToastModel) {
    this.store.dispatch(GlobalToastActions.removeToast(toast));
  }
}
