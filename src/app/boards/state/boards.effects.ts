import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardListService } from '../services/board-list.service';
import { BoardsActions } from '.';
import { catchError, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class BoardsEffects {
  private actions$ = inject(Actions);
  private boardListService = inject(BoardListService);

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.loadBoards),
      switchMap(() =>
        from(this.boardListService.getBoards()).pipe(
          map((boards) => BoardsActions.loadBoardsSuccess({ boards })),
          catchError((error) => of(BoardsActions.loadBoardsFailure({ error })))
        )
      )
    )
  );
}
