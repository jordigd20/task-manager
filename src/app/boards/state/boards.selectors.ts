import { createSelector } from '@ngrx/store';
import { AppState } from '../../shared/state/app.state';

export const selectBoardsState = (state: AppState) => state.boardsState;
export const boards = createSelector(
  selectBoardsState,
  (state) => state.boards
);
export const selectedBoard = createSelector(
  selectBoardsState,
  (state) => state.selectedBoard
);
export const boardStatus = createSelector(
  selectBoardsState,
  (state) => state.status
);
export const boardError = createSelector(
  selectBoardsState,
  (state) => state.error
);