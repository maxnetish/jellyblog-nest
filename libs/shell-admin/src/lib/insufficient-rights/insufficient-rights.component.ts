import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '@jellyblog-nest/auth/front';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'adm-insufficient-rights',
  templateUrl: './insufficient-rights.component.html',
  styleUrls: ['./insufficient-rights.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InsufficientRightsComponent implements OnInit, OnDestroy {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacade);
  private unsubscribe$ = new Subject();

  ngOnInit(): void {
    this.authFacade.user$.pipe(
      takeUntil(this.unsubscribe$),
      filter(user => !!user),
    ).subscribe(() => {
      if (this.route.snapshot.queryParamMap.has('afterLogin')) {
        this.router.navigate([this.route.snapshot.queryParamMap.get('afterLogin')]);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

}
