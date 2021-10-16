import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'adm-global-toast',
  templateUrl: './global-toast.component.html',
  styleUrls: ['./global-toast.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalToastComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
