import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'adm-insufficient-rights',
  templateUrl: './insufficient-rights.component.html',
  styleUrls: ['./insufficient-rights.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsufficientRightsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
