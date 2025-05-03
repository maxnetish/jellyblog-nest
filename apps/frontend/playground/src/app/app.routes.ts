import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'image-editor',
    loadComponent: async () => {
      const lazy = await import('./../image-editor-demo/image-editor-demo.component');
      return lazy.ImageEditorDemoComponent;
    },
  }
];
