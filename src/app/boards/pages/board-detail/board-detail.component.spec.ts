import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardDetailComponent } from './board-detail.component';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BoardsActions } from '../../state/boards';
import { TaskSections, TasksActions, TasksSelectors, initialState } from '../../state/tasks';
import { Task } from '../../../core/models/task.interface';
import { signal } from '@angular/core';

describe('BoardDetailComponent', () => {
  let component: BoardDetailComponent;
  let fixture: ComponentFixture<BoardDetailComponent>;
  let activatedRoute: ActivatedRoute;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: jest.fn().mockImplementation((cb) => {
                cb({ id: '1' });
              })
            }
          }
        },
        provideMockStore({
          selectors: [
            {
              selector: TasksSelectors.tasks,
              value: initialState.tasks
            },
            {
              selector: TasksSelectors.activeBoard,
              value: initialState.activeBoard
            },
            {
              selector: TasksSelectors.taskStatus,
              value: initialState.status
            }
          ]
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardDetailComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getActiveBoard action on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(TasksActions.getActiveBoard({ id: 1 }));
  });

  it('should dispatch getActiveBoardFailure action on ngOnInit if id is not a number', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    activatedRoute.params.subscribe = jest.fn().mockImplementation((cb) => {
      cb({ id: 'invalid' });
    });

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      TasksActions.getActiveBoardFailure({ error: 'Invalid board ID' })
    );
  });

  it('should update tasks on updateTasks', () => {
    const tasks = {
      backlog: [{ id: 1, title: 'Task 1', status: 'backlog' }],
      'in-progress': [],
      'in-review': [],
      completed: []
    };

    store.overrideSelector(TasksSelectors.tasks, tasks as any);

    component.updateTasks();

    expect(component.tasks()).toEqual(tasks);
  });

  it('should update board sections on updateBoardSections', () => {
    const board = {
      id: 1,
      title: 'Board 1',
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed']
    };

    store.overrideSelector(TasksSelectors.activeBoard, board as any);

    component.updateBoardSections();

    expect(component.boardSections()).toEqual(board.tasksOrder);
  });

  it('should dispatch reorderTask action on onTaskDrop', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const container = { id: 'backlog', data: [] };

    const event = {
      previousContainer: container,
      container,
      previousIndex: 0,
      currentIndex: 1
    };

    component.onTaskDrop(event as any);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TasksActions.reorderTask({
        tasks: [],
        status: 'backlog',
        fromIndex: 0,
        toIndex: 1
      })
    );
  });

  it('should dispatch transferTask action on onTaskDrop', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const previousContainer = {
      id: 'backlog',
      data: [{ id: 1, title: 'Task 1', status: 'backlog' }]
    };
    const container = { id: 'in-progress', data: [] };

    const event = {
      previousContainer,
      container,
      previousIndex: 0,
      currentIndex: 0
    };

    component.onTaskDrop(event as any);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TasksActions.transferTask({
        previousSectionTasks: previousContainer.data as Task[],
        targetSectionTasks: container.data,
        previousSection: 'backlog',
        targetSection: 'in-progress'
      })
    );
  });

  it('should dispatch reorderBoardSections action on onSectionDrop', () => {
    const board = {
      id: 1,
      title: 'Board 1',
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed']
    };

    component.board = signal(board as any);

    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const newSectionsOrder: (keyof TaskSections)[] = [
      'in-progress',
      'in-review',
      'backlog',
      'completed'
    ];

    const event = {
      previousIndex: 0,
      currentIndex: 2,
      container: { data: board.tasksOrder }
    };

    component.onSectionDrop(event as any);

    expect(dispatchSpy).toHaveBeenCalledWith(
      BoardsActions.reorderTaskSections({
        idBoard: board.id,
        sections: newSectionsOrder
      })
    );
  });
});
