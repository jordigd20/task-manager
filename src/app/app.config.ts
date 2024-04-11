import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { BoardsEffects } from './boards/state/boards.effects';
import { boardsReducer } from './boards/state';
import { TasksEffects, tasksReducer } from './boards/state/tasks';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      boardsState: boardsReducer,
      tasksState: tasksReducer
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(BoardsEffects, TasksEffects)
  ]
};
