import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards',
    pathMatch: 'full',
  },
  {
    path: 'boards',
    loadChildren: () =>
      import('./boards/boards.routes').then((m) => m.BOARD_ROUTES),
  },
];
