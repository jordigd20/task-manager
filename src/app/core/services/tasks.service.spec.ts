import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { DbService } from './db.service';
import { Task } from '../models/task.interface';
import Dexie from 'dexie';

describe('TasksService', () => {
  let service: TasksService;
  let dbService: DbService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DbService,
          useValue: {
            tasks: {
              where: jest.fn().mockReturnValue({
                equals: jest.fn().mockReturnValue({
                  sortBy: jest.fn().mockResolvedValueOnce(mockTasks)
                })
              })
            },
            transaction: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
          }
        }
      ]
    });

    dbService = TestBed.inject(DbService);
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks from a board', async () => {
    jest.spyOn(dbService.tasks, 'where');

    const result = await service.getTasksByBoard(1);

    expect(dbService.tasks.where).toHaveBeenCalledWith('boardId');
    expect(result).toEqual(mockTasks);
  });

  it('should update a task', async () => {
    dbService.tasks.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        modify: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
      })
    });

    jest.spyOn(dbService.tasks, 'where');

    const task: Task = {
      id: 1,
      boardId: 1,
      index: 0,
      title: 'Default Task',
      status: 'backlog',
      tags: [],
      image: '',
      createdAt: new Date()
    };

    const result = await service.updateTask(task);

    expect(dbService.tasks.where).toHaveBeenCalled();
    expect(result).toEqual(task);
  });

  it('should reorder tasks in the same section', async () => {
    dbService.tasks.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        modify: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
      })
    });

    jest.spyOn(dbService.tasks, 'where');
    jest.spyOn(dbService, 'transaction');

    const result = await service.reorderTasks({
      tasks: mockTasks,
      status: 'backlog',
      fromIndex: 0,
      toIndex: 1
    });

    expect(dbService.tasks.where).toHaveBeenCalled();
    expect(dbService.transaction).toHaveBeenCalled();
    expect(result).toEqual({
      status: 'backlog',
      tasks: mockTasks
    });
  });

  it('should transfer tasks between sections', async () => {
    dbService.tasks.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        modify: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
      })
    });

    jest.spyOn(dbService.tasks, 'where');
    jest.spyOn(dbService, 'transaction');

    const result = await service.transferTask({
      previousSectionTasks: mockTasks,
      targetSectionTasks: mockTasks,
      previousSection: 'backlog',
      targetSection: 'in-progress'
    });

    expect(dbService.tasks.where).toHaveBeenCalled();
    expect(dbService.transaction).toHaveBeenCalled();
    expect(result).toEqual({
      previousSectionTasks: mockTasks,
      targetSectionTasks: mockTasks,
      previousSection: 'backlog',
      targetSection: 'in-progress'
    });
  });
});
