import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, forwardRef, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mg-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent implements OnInit {

  @Input() set multiple(val: boolean) {
    this.multiple$.next(val);
  }

  @Input() set accept(val: string) {
    this.accept$.next(val);
  }

  multiple$ = new BehaviorSubject(false);
  accept$ = new BehaviorSubject('');

  constructor() { }

  ngOnInit(): void {
  }

}
