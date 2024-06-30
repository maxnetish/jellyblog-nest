import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostRegFacade } from './store/post-reg.facade';

@Component({
  selector: 'app-reg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.scss',
})
export class PostRegComponent {
  constructor(
    protected readonly facade: PostRegFacade,
  ) {
    this.facade.init();
  }
}
