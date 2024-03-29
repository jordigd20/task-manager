import { createAction, props } from '@ngrx/store';
import { Board } from '../../core/models/board.interface';

export const loadBoards = createAction('[Boards List] Load Boards');

export const loadBoardsSuccess = createAction(
  '[Boards List] Boards Load Success',
  props<{ boards: Board[] }>()
);

export const loadBoardsFailure = createAction(
  '[Boards List] Boards Load Failure',
  props<{ error: string }>()
);
