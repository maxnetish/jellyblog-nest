import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'image-editor',
    loadComponent: async () => {
      const lazy = await import('./../image-editor-demo/image-editor-demo.component');
      return lazy.ImageEditorDemoComponent;
    },
  },
  {
    path: 'file-dropper',
    loadComponent: async () => {
      const lazy = await import('./../file-dropper-demo/file-dropper-demo.component');
      return lazy.FileDropperDemoComponent;
    },
  },
  {
    path: 'file-choose',
    loadComponent: async () => {
      const lazy = await import('./../file-choose-demo/file-choose-demo.component');
      return lazy.FileChooseDemoComponent;
    },
  },
];
