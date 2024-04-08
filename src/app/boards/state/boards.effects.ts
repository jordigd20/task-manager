import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '../../core/services/boards.service';
import { BoardsActions, TaskState } from '.';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class BoardsEffects {
  private actions$ = inject(Actions);
  private boardService = inject(BoardService);
  private store = inject(Store);

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.loadBoards),
      switchMap(() =>
        from(this.boardService.getBoards()).pipe(
          map((boards) => BoardsActions.loadBoardsSuccess({ boards })),
          catchError((error) => of(BoardsActions.loadBoardsFailure({ error: error.message })))
        )
      )
    )
  );

  addBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.addBoard),
      switchMap(({ board }) =>
        from(this.boardService.addBoard(board)).pipe(
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
        from(this.boardService.updateBoard(board)).pipe(
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

  deleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.deleteBoard),
      switchMap(({ id }) =>
        from(this.boardService.deleteBoard(id)).pipe(
          map((id) => BoardsActions.deleteBoardSuccess({ id })),
          catchError((error) =>
            of(BoardsActions.deleteBoardFailure({ error: error.message })).pipe(
              // TODO: Show error message to the user
              tap(() => this.store.dispatch(BoardsActions.loadBoards()))
            )
          )
        )
      )
    )
  );

  getBoardById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.getBoardById),
      switchMap(({ id }) =>
        from(this.boardService.getBoardById(id)).pipe(
          map(({ board, tasks }) => {
            const taskState: TaskState = {
              backlog: [],
              'in-progress': [],
              'in-review': [],
              completed: []
            };

            tasks.forEach((task) => {
              taskState[task.status].push(task);
            });

            return { board, tasks: taskState };
          }),
          map(({ board, tasks }) => BoardsActions.getBoardByIdSuccess({ board, tasks })),
          catchError((error) => of(BoardsActions.getBoardByIdFailure({ error: error.message })))
        )
      )
    )
  );
}
