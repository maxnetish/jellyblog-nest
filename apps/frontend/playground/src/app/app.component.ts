import { Component, effect, inject, model, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

enum AppColorScheme {
  SYSTEM = 'light dark',
  DARK = 'dark',
  LIGHT = 'light',
}

@Component({
  imports: [RouterModule, FormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'playground';

  protected appColorScheme = model<AppColorScheme>(AppColorScheme.SYSTEM);
  protected documentRef = inject(DOCUMENT);
  protected readonly colorSchemeMap: { label: string; code: AppColorScheme; }[] = [
    {
      code: AppColorScheme.SYSTEM,
      label: 'System',
    },
    {
      code: AppColorScheme.LIGHT,
      label: 'Light',
    },
    {
      code: AppColorScheme.DARK,
      label: 'Dark',
    },
  ];

  constructor() {
    effect(() => {
      const appColorScheme = this.appColorScheme();

      const metaColorSchemeElm = this.documentRef.querySelector('head meta[name="color-scheme"]');

      if (metaColorSchemeElm) {
        metaColorSchemeElm.setAttribute('content', appColorScheme);
      }

    });
  }

  protected readonly AppColorScheme = AppColorScheme;
}
