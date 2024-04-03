import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardListService } from '../services/board-list.service';
import { BoardsActions } from '.';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class BoardsEffects {
  private actions$ = inject(Actions);
  private boardListService = inject(BoardListService);
  private store = inject(Store);

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.loadBoards),
      switchMap(() =>
        from(this.boardListService.getBoards()).pipe(
          map((boards) => BoardsActions.loadBoardsSuccess({ boards })),
          catchError((error) =>
            of(BoardsActions.loadBoardsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.addBoard),
      switchMap(({ board }) =>
        from(this.boardListService.addBoard(board)).pipe(
          map((idBoard) => BoardsActions.addBoardSuccess({ id: idBoard })),
          catchError((error) =>
            of(BoardsActions.addBoardFailure({ error: error.message })).pipe(
              // TODO: Show error message to the user
              tap(() => this.store.dispatch(BoardsActions.loadBoards()))
            )
          )
        )
      )
    )
  );

  updateBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.updateBoard),
      switchMap(({ board }) =>
        from(this.boardListService.updateBoard(board)).pipe(
          map(() => BoardsActions.updateBoardSuccess()),
          catchError((error) =>
            of(BoardsActions.updateBoardFailure({ error: error.message })).pipe(
              // TODO: Show error message to the user
              tap(() => this.store.dispatch(BoardsActions.loadBoards()))
            )
          )
        )
      )
    )
  );
}
