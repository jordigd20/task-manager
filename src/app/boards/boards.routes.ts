import { Routes } from '@angular/router';
import { BoardLayoutComponent } from './pages/board-layout/board-layout.component';
import { BoardListComponent } from './pages/board-list/board-list.component';

export const BOARD_ROUTES: Routes = [
  {
    path: '',
    component: BoardLayoutComponent,
    children: [
      {
        path: '',
        component: BoardListComponent,
      },
    ],
  },
];
