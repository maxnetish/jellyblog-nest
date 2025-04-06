import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalActions } from '@jellyblog-nest/utils/front';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBars3 } from '@ng-icons/heroicons/outline';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserWidgetComponent } from '../user-widget/user-widget.component';
import { GlobalToastComponent } from '../global-toast/global-toast.component';

@Component({
    selector: 'adm-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIconComponent,
        NgbCollapse,
        RouterLink,
        RouterLinkActive,
        UserWidgetComponent,
        RouterOutlet,
        GlobalToastComponent,
    ],
    providers: [
        provideIcons({
            heroBars3,
        }),
    ]
})
export class LayoutComponent implements OnInit {
  private readonly store = inject(Store);
  protected isNavbarCollapsed = true;

  ngOnInit(): void {
    this.store.dispatch(GlobalActions.loadApp());
  }
}
