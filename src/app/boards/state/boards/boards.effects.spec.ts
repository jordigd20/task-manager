import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from './boards.reducer';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { BoardService } from '../../../core/services/boards.service';
import { BoardsActions, BoardsEffects } from '.';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { TaskSections, TasksActions } from '../tasks';

describe('BoardsEffects', () => {
  let effects: BoardsEffects;
  let actions$ = new Observable<Action>();
  let boardService: BoardService;

  const mockBoardService = {
    getBoards: jest.fn(),
    getBoardById: jest.fn(),
    addBoard: jest.fn(),
    updateBoard: jest.fn(),
    deleteBoard: jest.fn(),
    reorderTaskSections: jest.fn()
  };

  const mockBoards: Board[] = [
    {
      id: 1,
      name: 'Default Board',
      icon: IconType.Key,
      color: Colors.Green,
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: [],
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        BoardsEffects,
        {
          provide: BoardService,
          useValue: mockBoardService
        },
        provideMockStore({ initialState }),
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BoardsEffects);
    boardService = TestBed.inject(BoardService);
  });

  describe('Load Boards', () => {
    it('loadBoards$ should return [Boards List] Boards Load Success', () => {
      // Arrange
      mockBoardService.getBoards.mockReturnValue(of(mockBoards));

      // Act
      actions$ = of(BoardsActions.loadBoards());

      // Assert
      const observerSpy = subscribeSpyTo(effects.loadBoards$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.loadBoardsSuccess({ boards: mockBoards })
      );

      expect(mockBoardService.getBoards).toHaveBeenCalled();
    });

    it('loadBoards$ should return [Boards List] Boards Load Failure', () => {
      // Arrange
      mockBoardService.getBoards.mockReturnValue(
        throwError(() => {
          throw new Error('Error loading boards');
        })
      );

      // Act
      actions$ = of(BoardsActions.loadBoards());

      // Assert
      const observerSpy = subscribeSpyTo(effects.loadBoards$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.loadBoardsFailure({ error: 'Error loading boards' })
      );

      expect(mockBoardService.getBoards).toHaveBeenCalled();
    });
  });

  describe('Add Board', () => {
    it('addBoard$ should return [Boards List] Add Board Success', () => {
      // Arrange
      const board = mockBoards[0];
      mockBoardService.addBoard.mockReturnValue(of(1));

      // Act
      actions$ = of(BoardsActions.addBoard({ board }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.addBoard$);
      expect(observerSpy.getLastValue()).toEqual(BoardsActions.addBoardSuccess({ id: 1 }));

      expect(mockBoardService.addBoard).toHaveBeenCalledWith(board);
    });

    it('addBoard$ should return [Boards List] Add Board Failure', () => {
      // Arrange
      const board = mockBoards[0];
      mockBoardService.addBoard.mockReturnValue(
        throwError(() => {
          throw new Error('Error adding board');
        })
      );

      // Act
      actions$ = of(BoardsActions.addBoard({ board }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.addBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.addBoardFailure({ error: 'Error adding board' })
      );

      expect(mockBoardService.addBoard).toHaveBeenCalledWith(board);
    });
  });

  describe('Update Board', () => {
    it('updateBoard$ should return [Boards List] Update Board Success', () => {
      // Arrange
      const board = mockBoards[0];
      mockBoardService.updateBoard.mockReturnValue(of({}));

      // Act
      actions$ = of(BoardsActions.updateBoard({ board }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.updateBoard$);
      expect(observerSpy.getLastValue()).toEqual(BoardsActions.updateBoardSuccess());

      expect(mockBoardService.updateBoard).toHaveBeenCalledWith(board);
    });

    it('updateBoard$ should return [Boards List] Update Board Failure', () => {
      // Arrange
      const board = mockBoards[0];

      mockBoardService.updateBoard.mockReturnValue(
        throwError(() => {
          throw new Error('Error updating board');
        })
      );

      // Act
      actions$ = of(BoardsActions.updateBoard({ board }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.updateBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.updateBoardFailure({ error: 'Error updating board' })
      );

      expect(mockBoardService.updateBoard).toHaveBeenCalledWith(board);
    });
  });

  describe('Delete Board', () => {
    it('deleteBoard$ should return [Boards List] Delete Board Success', () => {
      // Arrange
      const id = 1;
      mockBoardService.deleteBoard.mockReturnValue(of(id));

      // Act
      actions$ = of(BoardsActions.deleteBoard({ id }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteBoard$);
      expect(observerSpy.getLastValue()).toEqual(BoardsActions.deleteBoardSuccess({ id }));

      expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(id);
    });

    it('deleteBoard$ should return [Boards List] Delete Board Failure', () => {
      // Arrange
      const id = 1;
      mockBoardService.deleteBoard.mockReturnValue(
        throwError(() => {
          throw new Error('Error deleting board');
        })
      );

      // Act
      actions$ = of(BoardsActions.deleteBoard({ id }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.deleteBoardFailure({ error: 'Error deleting board' })
      );

      expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(id);
    });
  });

  describe('Reorder Task Sections', () => {
    it('reorderTaskSections$ should return [Boards Details] Reorder Task Sections Success', () => {
      // Arrange
      const idBoard = 1;
      const sections: (keyof TaskSections)[] = ['backlog', 'in-progress', 'in-review', 'completed'];
      mockBoardService.reorderTaskSections.mockReturnValue(of({}));

      // Act
      actions$ = of(BoardsActions.reorderTaskSections({ idBoard, sections }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.reorderTaskSections$);
      expect(observerSpy.getLastValue()).toEqual(TasksActions.reorderBoardSections({ sections }));

      expect(mockBoardService.reorderTaskSections).toHaveBeenCalledWith(idBoard, sections);
    });

    it('reorderTaskSections$ should return [Boards Details] Reorder Task Sections Failure', () => {
      // Arrange
      const idBoard = 1;
      const sections: (keyof TaskSections)[] = ['backlog', 'in-progress', 'in-review', 'completed'];
      mockBoardService.reorderTaskSections.mockReturnValue(
        throwError(() => {
          throw new Error('Error reordering task sections');
        })
      );

      // Act
      actions$ = of(BoardsActions.reorderTaskSections({ idBoard, sections }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.reorderTaskSections$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.reorderTaskSectionsFailure({ error: 'Error reordering task sections' })
      );

      expect(mockBoardService.reorderTaskSections).toHaveBeenCalledWith(idBoard, sections);
    });
  });
});
