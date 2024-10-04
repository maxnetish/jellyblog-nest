import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostRegFacade } from './store/post-reg.facade';
import { PostMiniCardComponent } from '../post-mini-card/post-mini-card.component';

@Component({
  selector: 'app-reg',
  standalone: true,
  imports: [CommonModule, PostMiniCardComponent],
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
