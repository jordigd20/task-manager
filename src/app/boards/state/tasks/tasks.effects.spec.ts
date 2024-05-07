import { Observable, of, throwError } from 'rxjs';
import { TasksEffects } from './tasks.effects';
import { Action } from '@ngrx/store';
import { BoardService } from '../../../core/services/boards.service';
import { TasksService } from '../../../core/services/tasks.service';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { Tag, Task } from '../../../core/models/task.interface';
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
    getBoardById: jest.fn(),
    createTag: jest.fn(),
    deleteTag: jest.fn()
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
      image: { url: '', publicId: '' },
      createdAt: new Date()
    },
    {
      id: 2,
      boardId: 1,
      index: 1,
      title: 'Task 2',
      status: 'backlog',
      tags: [],
      image: { url: '', publicId: '' },
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

  describe('Create Tag', () => {
    it('createTag$ should return CreateTagSuccess', () => {
      // Arrange
      const tag: Tag = {
        id: `${Date.now()}`,
        name: 'New Tag',
        color: Colors.Blue
      };

      boardService.createTag = jest.fn().mockReturnValue(of(tag));

      // Act
      actions$ = of(TasksActions.createTag({ board: mockBoards[0], tag }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.createTag$);
      expect(observerSpy.getLastValue()).toEqual(TasksActions.createTagSuccess({ tag }));
      expect(boardService.createTag).toHaveBeenCalledWith(mockBoards[0], tag);
    });

    it('createTag$ should return CreateTagFailure', () => {
      // Arrange
      const tag: Tag = {
        id: `${Date.now()}`,
        name: 'New Tag',
        color: Colors.Blue
      };

      boardService.createTag = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error creating tag');
        })
      );

      // Act
      actions$ = of(TasksActions.createTag({ board: mockBoards[0], tag }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.createTag$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.createTagFailure({
          error: 'Error creating tag'
        })
      );
      expect(boardService.createTag).toHaveBeenCalledWith(mockBoards[0], tag);
    });
  });

  describe('Delete Tag', () => {
    it('deleteTag$ should return DeleteTagSuccess', () => {
      // Arrange
      const tag: Tag = {
        id: `${Date.now()}`,
        name: 'New Tag',
        color: Colors.Blue
      };

      boardService.deleteTag = jest.fn().mockReturnValue(of(tag));

      // Act
      actions$ = of(TasksActions.deleteTag({ board: mockBoards[0], tag }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteTag$);
      expect(observerSpy.getLastValue()).toEqual(TasksActions.deleteTagSuccess({ tags: [], tag }));
      expect(boardService.deleteTag).toHaveBeenCalledWith(mockBoards[0], tag);
    });

    it('deleteTag$ should return DeleteTagFailure', () => {
      // Arrange
      const tag: Tag = {
        id: `${Date.now()}`,
        name: 'New Tag',
        color: Colors.Blue
      };

      boardService.deleteTag = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error deleting tag');
        })
      );

      // Act
      actions$ = of(TasksActions.deleteTag({ board: mockBoards[0], tag }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteTag$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.deleteTagFailure({
          error: 'Error deleting tag'
        })
      );
      expect(boardService.deleteTag).toHaveBeenCalledWith(mockBoards[0], tag);
    });
  });

  describe('Add Task', () => {
    it('addTask$ should return AddTaskSuccess', () => {
      // Arrange
      const task: Task = {
        id: 3,
        boardId: 1,
        index: 2,
        title: 'Task 3',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      tasksService.createTask = jest.fn().mockReturnValue(of(3));

      // Act
      actions$ = of(TasksActions.addTask({ task }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.addTask$);
      expect(observerSpy.getLastValue()).toEqual(TasksActions.addTaskSuccess({ idTask: 3 }));
      expect(tasksService.createTask).toHaveBeenCalledWith(task);
    });

    it('addTask$ should return AddTaskFailure', () => {
      // Arrange
      const task: Task = {
        id: 3,
        boardId: 1,
        index: 2,
        title: 'Task 3',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      tasksService.createTask = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error creating task');
        })
      );

      // Act
      actions$ = of(TasksActions.addTask({ task }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.addTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.addTaskFailure({
          error: 'Error creating task'
        })
      );
      expect(tasksService.createTask).toHaveBeenCalledWith(task);
    });
  });

  describe('Update Task', () => {
    it('updateTask$ should return UpdateTaskSuccess', () => {
      // Arrange
      const task: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      tasksService.updateTask = jest.fn().mockReturnValue(of(task));

      // Act
      actions$ = of(TasksActions.updateTask({ task }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.updateTask$);
      expect(observerSpy.getLastValue()).toEqual(TasksActions.updateTaskSuccess({ task }));
      expect(tasksService.updateTask).toHaveBeenCalledWith(task);
    });

    it('updateTask$ should return UpdateTaskFailure', () => {
      // Arrange
      const task: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      tasksService.updateTask = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error updating task');
        })
      );

      // Act
      actions$ = of(TasksActions.updateTask({ task }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.updateTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.updateTaskFailure({
          error: 'Error updating task'
        })
      );
      expect(tasksService.updateTask).toHaveBeenCalledWith(task);
    });
  });

  describe('Delete Task', () => {
    it('deleteTask$ should return DeleteTaskSuccess', () => {
      // Arrange
      const task: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      tasksService.deleteTask = jest.fn().mockReturnValue(of(task));

      // Act
      actions$ = of(TasksActions.deleteTask({ task }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteTask$);
      expect(observerSpy.getLastValue()).toEqual(TasksActions.deleteTaskSuccess({ task }));
      expect(tasksService.deleteTask).toHaveBeenCalledWith(1);
    });

    it('deleteTask$ should return DeleteTaskFailure', () => {
      // Arrange
      const task: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      tasksService.deleteTask = jest.fn().mockReturnValue(
        throwError(() => {
          throw new Error('Error deleting task');
        })
      );

      // Act
      actions$ = of(TasksActions.deleteTask({ task }));

      // Assert
      const observerSpy = subscribeSpyTo(effects.deleteTask$);
      expect(observerSpy.getLastValue()).toEqual(
        TasksActions.deleteTaskFailure({
          error: 'Error deleting task'
        })
      );
      expect(tasksService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
