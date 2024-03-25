import { Routes } from '@angular/router';
import { BoardLayoutComponent } from './ui/board-layout/board-layout.component';
import { BoardListComponent } from './pages/board-list/board-list.component';
import { BoardDetailComponent } from './pages/board-detail/board-detail.component';

export const BOARD_ROUTES: Routes = [
  {
    path: '',
    component: BoardLayoutComponent,
    children: [
      {
        path: '',
        component: BoardListComponent,
      },
      {
        path: ':id',
        component: BoardDetailComponent,
      },
    ],
  },
];
