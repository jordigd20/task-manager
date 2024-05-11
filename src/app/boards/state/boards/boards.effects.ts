import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '../../../core/services/boards.service';
import { BoardsActions } from '.';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { TasksActions } from '../tasks';
import { ToastService } from '../../../core/services/toast.service';

@Injectable()
export class BoardsEffects {
  private actions$ = inject(Actions);
  private boardService = inject(BoardService);
  private store = inject(Store);
  private toastService = inject(ToastService);

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
              tap(() => this.toastService.showErrorToast('Failed to add board')),
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
              tap(() => this.toastService.showErrorToast('Failed to update board')),
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
              tap(() => this.toastService.showErrorToast('Failed to delete board')),
              tap(() => this.store.dispatch(BoardsActions.loadBoards()))
            )
          )
        )
      )
    )
  );

  reorderTaskSections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.reorderTaskSections),
      switchMap(({ idBoard, sections }) =>
        from(this.boardService.reorderTaskSections(idBoard, sections)).pipe(
          map(() => BoardsActions.reorderTaskSectionsSuccess({ sections })),
          map(() => TasksActions.reorderBoardSections({ sections })),
          catchError((error) =>
            of(BoardsActions.reorderTaskSectionsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
