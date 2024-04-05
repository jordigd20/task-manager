import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { BoardsEffects } from './boards.effects';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from './boards.reducer';
import { Board, Colors, IconType } from '../../core/models/board.interface';
import { BoardListService } from '../services/board-list.service';
import { BoardsActions } from '.';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('BoardsEffects', () => {
  let effects: BoardsEffects;
  let actions$ = new Observable<Action>();
  let boardListService: BoardListService;

  const mockBoardListService = {
    getBoards: jest.fn(),
    addBoard: jest.fn(),
    updateBoard: jest.fn(),
    deleteBoard: jest.fn(),
  };

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        BoardsEffects,
        {
          provide: BoardListService,
          useValue: mockBoardListService,
        },
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(BoardsEffects);
    boardListService = TestBed.inject(BoardListService);
  });

  describe('Load Boards', () => {
    it('loadBoards$ should return [Boards List] Boards Load Success', () => {
      // Arrange
      mockBoardListService.getBoards.mockReturnValue(of(mockBoards));

      // Act
      actions$ = of(BoardsActions.loadBoards());

      // Assert
      const observerSpy = subscribeSpyTo(effects.loadBoards$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.loadBoardsSuccess({ boards: mockBoards })
      );

      expect(mockBoardListService.getBoards).toHaveBeenCalled();
    });

    it('loadBoards$ should return [Boards List] Boards Load Failure', () => {
      // Arrange
      mockBoardListService.getBoards.mockReturnValue(
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

      expect(mockBoardListService.getBoards).toHaveBeenCalled();
    });
  });

  describe('Add Board', () => {
    it('addBoard$ should return [Boards List] Add Board Success', () => {
      // Arrange
      const board = mockBoards[0];
      mockBoardListService.addBoard.mockReturnValue(of(1));

      // Act
      actions$ = of(BoardsActions.addBoard({ board }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.addBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.addBoardSuccess({ id: 1 })
      );

      expect(mockBoardListService.addBoard).toHaveBeenCalledWith(board);
    });

    it('addBoard$ should return [Boards List] Add Board Failure', () => {
      // Arrange
      const board = mockBoards[0];
      mockBoardListService.addBoard.mockReturnValue(
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

      expect(mockBoardListService.addBoard).toHaveBeenCalledWith(board);
    });
  });

  describe('Update Board', () => {
    it('updateBoard$ should return [Boards List] Update Board Success', () => {
      // Arrange
      const board = mockBoards[0];
      mockBoardListService.updateBoard.mockReturnValue(of({}));

      // Act
      actions$ = of(BoardsActions.updateBoard({ board }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.updateBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.updateBoardSuccess()
      );

      expect(mockBoardListService.updateBoard).toHaveBeenCalledWith(board);
    });

    it('updateBoard$ should return [Boards List] Update Board Failure', () => {
      // Arrange
      const board = mockBoards[0];

      mockBoardListService.updateBoard.mockReturnValue(
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

      expect(mockBoardListService.updateBoard).toHaveBeenCalledWith(board);
    });
  });

  describe('Delete Board', () => {
    it('deleteBoard$ should return [Boards List] Delete Board Success', () => {
      // Arrange
      const id = 1;
      mockBoardListService.deleteBoard.mockReturnValue(of(id));

      // Act
      actions$ = of(BoardsActions.deleteBoard({ id }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        BoardsActions.deleteBoardSuccess({ id })
      );

      expect(mockBoardListService.deleteBoard).toHaveBeenCalledWith(id);
    });

    it('deleteBoard$ should return [Boards List] Delete Board Failure', () => {
      // Arrange
      const id = 1;
      mockBoardListService.deleteBoard.mockReturnValue(
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

      expect(mockBoardListService.deleteBoard).toHaveBeenCalledWith(id);
    });
  });
});
