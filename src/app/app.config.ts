import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { BoardsEffects } from './boards/state/boards/boards.effects';
import { boardsReducer } from './boards/state/boards';
import { TasksEffects, tasksReducer } from './boards/state/tasks';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ToastComponent } from './shared/components/toast/toast.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      boardsState: boardsReducer,
      tasksState: tasksReducer
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(BoardsEffects, TasksEffects),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      toastComponent: ToastComponent
    })
  ]
};
