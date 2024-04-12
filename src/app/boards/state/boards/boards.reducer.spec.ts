import { BoardsActions } from '.';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { Task } from '../../../core/models/task.interface';
import { BoardsState, boardsReducer, initialState } from './boards.reducer';

describe('BoardsReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };

      const state = boardsReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('Load Boards', () => {
    it('[Boards Load] should set the status to loading and retrieve the state', () => {
      const newState: BoardsState = {
        ...initialState,
        status: 'loading'
      };

      const action = BoardsActions.loadBoards();
      const state = boardsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Boards Load Success] should set the boards and status to success', () => {
      const mockBoards: Board[] = [
        {
          id: 1,
          name: 'Default Board',
          icon: IconType.Key,
          color: Colors.Green,
          tags: [],
          tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
          createdAt: new Date()
        }
      ];

      const newState: BoardsState = {
        ...initialState,
        boards: mockBoards,
        status: 'success',
        isBoardFormOpen: false,
        error: null
      };

      const action = BoardsActions.loadBoardsSuccess({ boards: mockBoards });
      const state = boardsReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Boards Load Failure] should set the error and status to failure', () => {
      const error = 'Error loading boards';

      const action = BoardsActions.loadBoardsFailure({ error });
      const state = boardsReducer(initialState, action);

      const newState: BoardsState = {
        ...initialState,
        status: 'failure',
        isBoardFormOpen: false,
        error
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Open Board Form', () => {
    it('[Open Board] should set the isBoardFormOpen to true', () => {
      const action = BoardsActions.openBoardForm();
      const state = boardsReducer(initialState, action);

      const newState: BoardsState = {
        ...initialState,
        isBoardFormOpen: true
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Add Boards', () => {
    it('[Add Board] should add a new board and set the status to loading', () => {
      const mockBoard: Board = {
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const action = BoardsActions.addBoard({ board: mockBoard });
      const state = boardsReducer(initialState, action);

      const newState: BoardsState = {
        ...initialState,
        boards: [mockBoard],
        status: 'loading'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Add Board Success] should set the status to success and update the board id', () => {
      const mockBoard: Board = {
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockId = 1;

      const action = BoardsActions.addBoardSuccess({ id: mockId });
      const state = boardsReducer({ ...initialState, boards: [mockBoard] }, action);

      const newState: BoardsState = {
        ...initialState,
        boards: [{ ...mockBoard, id: mockId }],
        status: 'success',
        error: null,
        isBoardFormOpen: false
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Add Board Failure] should remove the board and set the status to failure', () => {
      const mockBoard: Board = {
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const action = BoardsActions.addBoardFailure({
        error: 'Error adding board'
      });
      const state = boardsReducer({ ...initialState, boards: [mockBoard] }, action);

      const newState: BoardsState = {
        ...initialState,
        boards: [],
        status: 'failure',
        error: 'Error adding board',
        isBoardFormOpen: false
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Update Boards', () => {
    it('[Update Board] should update the board and set the status to loading', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockedState = { ...initialState, boards: [mockBoard] };

      mockBoard.name = 'Updated Board';
      mockBoard.icon = IconType.Key;
      mockBoard.color = Colors.Blue;

      const action = BoardsActions.updateBoard({ board: mockBoard });
      const state = boardsReducer(mockedState, action);

      const newState: BoardsState = {
        ...mockedState,
        status: 'loading',
        boards: [mockBoard]
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockedState);
    });

    it('[Update Board Success] should set the status to success', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockedState = { ...initialState, boards: [mockBoard] };

      mockBoard.name = 'Updated Board';
      mockBoard.icon = IconType.Key;
      mockBoard.color = Colors.Blue;

      const action = BoardsActions.updateBoardSuccess();
      const state = boardsReducer(mockedState, action);

      const newState: BoardsState = {
        ...mockedState,
        status: 'success',
        error: null,
        isBoardFormOpen: false
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockedState);
    });

    it('[Update Board Failure] should set the status to failure', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockedState = { ...initialState, boards: [mockBoard] };

      mockBoard.name = 'Updated Board';
      mockBoard.icon = IconType.Key;
      mockBoard.color = Colors.Blue;

      const action = BoardsActions.updateBoardFailure({
        error: 'Error updating board'
      });
      const state = boardsReducer(mockedState, action);

      const newState: BoardsState = {
        ...mockedState,
        status: 'failure',
        error: 'Error updating board',
        isBoardFormOpen: false
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockedState);
    });
  });

  describe('Delete Boards', () => {
    it('[Delete Board] should delete the board and set the status to loading', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockedState = { ...initialState, boards: [mockBoard] };

      const action = BoardsActions.deleteBoard({ id: mockBoard.id! });
      const state = boardsReducer(mockedState, action);

      const newState: BoardsState = {
        ...mockedState,
        status: 'loading'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockedState);
    });

    it('[Delete Board Success] should set the status to success', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockedState = { ...initialState, boards: [mockBoard] };

      const action = BoardsActions.deleteBoardSuccess({ id: 1 });
      const state = boardsReducer(mockedState, action);

      const newState: BoardsState = {
        ...initialState,
        status: 'success',
        error: null
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockedState);
    });

    it('[Delete Board Failure] should set the status to failure', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockedState = { ...initialState, boards: [mockBoard] };

      const action = BoardsActions.deleteBoardFailure({
        error: 'Error deleting board'
      });
      const state = boardsReducer(mockedState, action);

      const newState: BoardsState = {
        ...mockedState,
        status: 'failure',
        error: 'Error deleting board'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockedState);
    });
  });
});
