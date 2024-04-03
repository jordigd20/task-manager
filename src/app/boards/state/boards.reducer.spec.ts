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
        isBoardFormOpen: false,
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

      const action = BoardsActions.loadBoardsFailure({ error });
      const state = boardsReducer(initialState, action);

      const newState: BoardsState = {
        ...initialState,
        status: 'failure',
        isBoardFormOpen: false,
        error,
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('[Boards List] Open Board Form Action', () => {
    it('should set the isBoardFormOpen to true', () => {
      const action = BoardsActions.openBoardForm();
      const state = boardsReducer(initialState, action);

      const newState: BoardsState = {
        ...initialState,
        isBoardFormOpen: true,
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('[Boards List] Add Board Action', () => {
    it('should add a new board and set the status to loading', () => {
      const mockBoard: Board = {
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: ['Concept'],
        createdAt: new Date(),
      };

      const action = BoardsActions.addBoard({ board: mockBoard });
      const state = boardsReducer(initialState, action);

      const newState: BoardsState = {
        ...initialState,
        boards: [mockBoard],
        status: 'loading',
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('[Boards List] Add Board Success Action', () => {
    it('should set the status to success and update the board id', () => {
      const mockBoard: Board = {
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: ['Concept'],
        createdAt: new Date(),
      };

      const mockId = 1;

      const action = BoardsActions.addBoardSuccess({ id: mockId });
      const state = boardsReducer(
        { ...initialState, boards: [mockBoard] },
        action
      );

      const newState: BoardsState = {
        ...initialState,
        boards: [{ ...mockBoard, id: mockId }],
        status: 'success',
        error: null,
        isBoardFormOpen: false,
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('[Boards List] Add Board Failure Action', () => {
    it('should remove the board and set the status to failure', () => {
      const mockBoard: Board = {
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: ['Concept'],
        createdAt: new Date(),
      };

      const action = BoardsActions.addBoardFailure({
        error: 'Error adding board',
      });
      const state = boardsReducer(
        { ...initialState, boards: [mockBoard] },
        action
      );

      const newState: BoardsState = {
        ...initialState,
        boards: [],
        status: 'failure',
        error: 'Error adding board',
        isBoardFormOpen: false,
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
