import { createReducer, on } from '@ngrx/store';
import { Board } from '../../core/models/board.interface';
import { BoardsActions } from '.';

export interface BoardsState {
  boards: Board[];
  selectedBoard: Board | null;
  status: 'pending' | 'loading' | 'success' | 'failure';
  error: string | null;
}

export const initialState: BoardsState = {
  boards: [],
  selectedBoard: null,
  status: 'pending',
  error: null,
};

export const boardsReducer = createReducer(
  initialState,
  on(BoardsActions.loadBoards, (state) => ({
    ...state,
    status: 'loading' as 'loading',
  })),
  on(BoardsActions.loadBoardsSuccess, (state, { boards }) => ({
    ...state,
    boards,
    status: 'success' as 'success',
    error: null,
  })),
  on(BoardsActions.loadBoardsFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error,
  }))
);
