import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalToastModel } from './global-toast.model';
import * as GlobalToastSelectors from './store/global-toast.selectors';
import * as GlobalToastActions from './store/global-toast.actions';
import { GlobalToastSeverity } from '@jellyblog-nest/utils/front';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'adm-global-toast',
  templateUrl: './global-toast.component.html',
  styleUrls: ['./global-toast.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgbToast,
    AsyncPipe,
  ],
})
export class GlobalToastComponent {

  private readonly store = inject(Store);
  protected readonly toasts$ = this.store.select(GlobalToastSelectors.selectToasts);
  protected readonly headerBySeverity: {[key in GlobalToastSeverity]: string} = {
    [GlobalToastSeverity.ERROR]: 'Ошибка',
    [GlobalToastSeverity.INFO]: 'Сообщение',
    [GlobalToastSeverity.SUCCESS]: 'Успешно',
  };
  protected readonly delayBySeverity: {[key in GlobalToastSeverity]: number} = {
    [GlobalToastSeverity.ERROR]: 10000,
    [GlobalToastSeverity.INFO]: 5000,
    [GlobalToastSeverity.SUCCESS]: 5000,
  };
  protected readonly classBySeverity: {[key in GlobalToastSeverity]: string} = {
    [GlobalToastSeverity.ERROR]: 'bg-danger text-light',
    [GlobalToastSeverity.INFO]: '',
    [GlobalToastSeverity.SUCCESS]: 'bg-success text-light',
  };

  protected handleToastHidden(toast: GlobalToastModel) {
    this.store.dispatch(GlobalToastActions.removeToast(toast));
  }
}
