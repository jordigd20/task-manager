import { BoardsActions } from '.';
import { Board, Colors, IconType } from '../../core/models/board.interface';
import { BoardsState, boardsReducer, initialState } from './boards.reducer';

describe('BoardsReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown',
      };

      const state = boardsReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('[Boards List] Load Boards Action', () => {
    it('should set the status to loading and retrieve the state', () => {
      const newState: BoardsState = {
        ...initialState,
        status: 'loading',
      };

      const action = BoardsActions.loadBoards();
      const state = boardsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('[Boards List] Boards Load Success Action', () => {
    it('should set the boards and status to success', () => {
      const mockBoards: Board[] = [
        {
          id: 1,
          name: 'Default Board',
          icon: IconType.Key,
          color: Colors.Green,
          tags: ['Concept'],
          createdAt: new Date(),
        },
      ];

      const newState: BoardsState = {
        ...initialState,
        boards: mockBoards,
        status: 'success',
        error: null,
      };

      const action = BoardsActions.loadBoardsSuccess({ boards: mockBoards });
      const state = boardsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('[Boards List] Boards Load Failure Action', () => {
    it('should set the error and status to failure', () => {
      const error = 'Error loading boards';

      const newState: BoardsState = {
        ...initialState,
        status: 'failure',
        error,
      };

      const action = BoardsActions.loadBoardsFailure({ error });
      const state = boardsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
