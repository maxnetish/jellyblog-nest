import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFilestoreListActions from './filestore-list.actions';
import * as fromFilestoreListSelectors from './filestore-list.selectors';
import { map } from 'rxjs/operators';
import { _Object } from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root',
})
export class FilestorelistFacade {

  constructor(
    private readonly store: Store,
  ) {
  }

  objects$ = this.store.select(fromFilestoreListSelectors.selectListObjectsCommandsOutputs).pipe(
    map((outputs) => {
      return outputs.reduce((acc, output) => {
        return [
          ...acc,
          ...output.Contents || [],
        ]
      }, [] as _Object[]);
    }),
  )

  handleInitList() {
    this.store.dispatch(fromFilestoreListActions.initList());
  }
}
