import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dialog' },
  {
    path: 'dialog',
    loadComponent: () =>
      import('./dialog/dialog-showcase').then((m) => m.DialogShowcase),
  },
];
