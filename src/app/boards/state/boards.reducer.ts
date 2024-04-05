import { createReducer, on } from '@ngrx/store';
import { Board } from '../../core/models/board.interface';
import { BoardsActions } from '.';

export interface BoardsState {
  boards: Board[];
  selectedBoard: Board | null;
  status: 'pending' | 'loading' | 'success' | 'failure';
  error: string | null;
  isBoardFormOpen: boolean;
}

export const initialState: BoardsState = {
  boards: [],
  selectedBoard: null,
  status: 'pending',
  error: null,
  isBoardFormOpen: false,
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
  })),
  on(BoardsActions.openBoardForm, (state) => ({
    ...state,
    isBoardFormOpen: true,
  })),
  on(BoardsActions.addBoard, (state, { board }) => ({
    ...state,
    boards: [...state.boards, board],
    status: 'loading' as 'loading',
  })),
  on(BoardsActions.addBoardSuccess, (state, { id }) => ({
    ...state,
    boards: state.boards.map((board) =>
      board.id == null ? { ...board, id } : board
    ),
    status: 'success' as 'success',
    error: null,
    isBoardFormOpen: false,
  })),
  on(BoardsActions.addBoardFailure, (state, { error }) => ({
    ...state,
    boards: state.boards.slice(0, -1),
    status: 'failure' as 'failure',
    error,
    isBoardFormOpen: false,
  })),
  on(BoardsActions.updateBoard, (state, { board }) => ({
    ...state,
    boards: state.boards.map((b) => (b.id === board.id ? board : b)),
    status: 'loading' as 'loading',
  })),
  on(BoardsActions.updateBoardSuccess, (state) => ({
    ...state,
    status: 'success' as 'success',
    error: null,
    isBoardFormOpen: false,
  })),
  on(BoardsActions.updateBoardFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error,
    isBoardFormOpen: false,
  })),
  on(BoardsActions.deleteBoard, (state) => ({
    ...state,
    status: 'loading' as 'loading',
  })),
  on(BoardsActions.deleteBoardSuccess, (state, { id }) => ({
    ...state,
    boards: state.boards.filter((board) => board.id !== id),
    status: 'success' as 'success',
    error: null,
    isBoardFormOpen: false,
  })),
  on(BoardsActions.deleteBoardFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error,
    isBoardFormOpen: false,
  }))
);
