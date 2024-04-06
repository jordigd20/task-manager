import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { DbService } from './db.service';
import { Task, TaskStatus } from '../models/task.interface';

describe('TasksService', () => {
  let service: TasksService;
  let dbService: DbService;

  const mockTasks: Task[] = [
    {
      id: 1,
      boardId: 1,
      title: 'Default Task',
      status: TaskStatus.Backlog,
      tags: [],
      image: '',
      createdAt: new Date(),
    },
    {
      id: 2,
      boardId: 1,
      title: 'Task 2',
      status: TaskStatus.Backlog,
      tags: [],
      image: '',
      createdAt: new Date(),
    },
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
                  toArray: jest.fn().mockResolvedValueOnce(mockTasks),
                }),
              }),
            },
          },
        },
      ],
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
});
