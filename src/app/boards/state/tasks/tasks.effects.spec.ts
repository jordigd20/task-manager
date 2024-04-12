import { Observable, of, throwError } from 'rxjs';
import { TasksEffects } from './tasks.effects';
import { Action } from '@ngrx/store';
import { BoardService } from '../../../core/services/boards.service';
import { TasksService } from '../../../core/services/tasks.service';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { Task } from '../../../core/models/task.interface';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TaskSections, initialState } from './tasks.reducer';
import { provideMockActions } from '@ngrx/effects/testing';
import { TasksActions } from '.';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('TasksEffects', () => {
  let effects: TasksEffects;
  let actions$ = new Observable<Action>();
  let boardService: BoardService;
  let tasksService: TasksService;

  const mockBoardService = {
    getBoardById: jest.fn()
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

  const mockTasks: Task[] = [
    {
      id: 1,
      boardId: 1,
      index: 0,
      title: 'Default Task',
      status: 'backlog',
      tags: [],
      image: '',
      createdAt: new Date()
    },
    {
      id: 2,
      boardId: 1,
      index: 1,
      title: 'Task 2',
      status: 'backlog',
      tags: [],
      image: '',
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TasksEffects,
        {
          provide: BoardService,
          useValue: mockBoardService
        },
        {
          provide: TasksService,
          useValue: {}
        },
        provideMockStore({ initialState }),
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TasksEffects);
    boardService = TestBed.inject(BoardService);
    tasksService = TestBed.inject(TasksService);
  });

  describe('Get Active Board', () => {
    it('getActiveBoard$ should return ActiveBoardSuccess', () => {
      // Arrange
      mockBoardService.getBoardById.mockReturnValue(
        of({
          board: mockBoards[0],
          tasks: mockTasks
        })
      );

      // Act
      actions$ = of(TasksActions.getActiveBoard({ id: 1 }));

      // Assert
      const taskState: TaskSections = {
        backlog: [],
        'in-progress': [],
        'in-review': [],
        completed: []
      };

      mockTasks.forEach((task) => {
        taskState[task.status].push(task);
      });

      const observerSpy = subscribeSpyTo(effects.getActiveBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.getActiveBoardSuccess({
          board: mockBoards[0],
          tasks: taskState
        })
      );
      expect(mockBoardService.getBoardById).toHaveBeenCalledWith(1);
    });

    it('getActiveBoard$ should return ActiveBoardFailure', () => {
      // Arrange
      mockBoardService.getBoardById.mockReturnValue(
        throwError(() => {
          throw new Error('Error getting board by id');
        })
      );

      // Act
      actions$ = of(TasksActions.getActiveBoard({ id: 1 }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.getActiveBoard$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.getActiveBoardFailure({
          error: 'Error getting board by id'
        })
      );
      expect(mockBoardService.getBoardById).toHaveBeenCalledWith(1);
    });
  });

  describe('Reorder Task', () => {
    it('reorderTask$ should return ReorderTaskSuccess', () => {
      // Arrange
      const tasks = mockTasks;
      const status = 'backlog';
      const fromIndex = 0;
      const toIndex = 1;

      tasksService.reorderTasks = jest.fn().mockReturnValue(of({ tasks, status }));

      // Act
      actions$ = of(TasksActions.reorderTask({ tasks, status, fromIndex, toIndex }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.reorderTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.reorderTaskSuccess({
          tasks,
          status
        })
      );
      expect(tasksService.reorderTasks).toHaveBeenCalledWith({ tasks, status, fromIndex, toIndex });
    });

    it('reorderTask$ should return ReorderTaskFailure', () => {
      // Arrange
      const tasks = mockTasks;
      const status = 'backlog';
      const fromIndex = 0;
      const toIndex = 1;

      tasksService.reorderTasks = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error reordering tasks');
        })
      );

      // Act
      actions$ = of(TasksActions.reorderTask({ tasks, status, fromIndex, toIndex }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.reorderTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.reorderTaskFailure({
          error: 'Error reordering tasks'
        })
      );
      expect(tasksService.reorderTasks).toHaveBeenCalledWith({ tasks, status, fromIndex, toIndex });
    });
  });

  describe('Transfer Task', () => {
    it('transferTask$ should return TransferTaskSuccess', () => {
      // Arrange
      const previousSectionTasks = mockTasks;
      const targetSectionTasks = mockTasks;
      const previousSection = 'backlog';
      const targetSection = 'in-progress';

      tasksService.transferTask = jest
        .fn()
        .mockReturnValue(
          of({ previousSectionTasks, targetSectionTasks, previousSection, targetSection })
        );

      // Act
      actions$ = of(
        TasksActions.transferTask({
          previousSectionTasks,
          targetSectionTasks,
          previousSection,
          targetSection
        })
      );

      // Assert
      const observerSpy = subscribeSpyTo(effects.transferTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.transferTaskSuccess({
          previousSectionTasks,
          targetSectionTasks,
          previousSection,
          targetSection
        })
      );
      expect(tasksService.transferTask).toHaveBeenCalledWith({
        previousSectionTasks,
        targetSectionTasks,
        previousSection,
        targetSection
      });
    });

    it('transferTask$ should return TransferTaskFailure', () => {
      // Arrange
      const previousSectionTasks = mockTasks;
      const targetSectionTasks = mockTasks;
      const previousSection = 'backlog';
      const targetSection = 'in-progress';

      tasksService.transferTask = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error transferring task');
        })
      );

      // Act
      actions$ = of(
        TasksActions.transferTask({
          previousSectionTasks,
          targetSectionTasks,
          previousSection,
          targetSection
        })
      );

      // Assert
      const observerSpy = subscribeSpyTo(effects.transferTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.transferTaskFailure({
          error: 'Error transferring task'
        })
      );
      expect(tasksService.transferTask).toHaveBeenCalledWith({
        previousSectionTasks,
        targetSectionTasks,
        previousSection,
        targetSection
      });
    });
  });
});
