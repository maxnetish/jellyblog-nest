import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FilestorelistFacade } from './store/filestore-list.facade';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mg-filestore-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilestoreListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(
    public readonly storeFacade: FilestorelistFacade,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.unsubscribe$),
      map(queryParam => queryParam.get('prefix')),
      map(prefix => prefix || undefined),
      distinctUntilChanged(),
    ).subscribe((prefix) => {
      console.log('prefix: ', prefix);
      this.storeFacade.handleBeginBrowsePrefix(prefix);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

}
