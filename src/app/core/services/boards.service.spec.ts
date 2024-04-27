import { TestBed } from '@angular/core/testing';
import { BoardService } from './boards.service';
import { Board, Colors, IconType } from '../models/board.interface';
import { DbService } from './db.service';
import Dexie from 'dexie';
import { Tag } from '../models/task.interface';

describe('BoardService', () => {
  let service: BoardService;
  let dbService: DbService;

  const mockBoards: Board[] = [
    {
      id: 1,
      name: 'Board 1',
      color: Colors.Blue,
      icon: IconType.Tools,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    },
    {
      id: 2,
      name: 'Board 2',
      color: Colors.Orange,
      icon: IconType.Eyes,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    }
  ];

  const mockDbService = {
    boards: {
      toArray: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve(mockBoards))),
      add: jest.fn().mockReturnValue(new Dexie.Promise((resolve) => resolve(1))),
      where: jest.fn().mockReturnValue({
        equals: jest.fn().mockReturnValue({
          modify: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
        })
      }),
      get: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve(mockBoards[0])))
    },
    tasks: {
      add: jest.fn().mockReturnValue(new Dexie.Promise((resolve) => resolve(1))),
      where: jest.fn().mockReturnValue({
        equals: jest.fn().mockReturnValue({
          modify: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
        })
      })
    },
    transaction: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DbService,
          useValue: mockDbService
        }
      ]
    });

    dbService = TestBed.inject(DbService);
    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all boards from the db', async () => {
    jest.spyOn(mockDbService.boards, 'toArray');

    service.getBoards().subscribe((boards) => {
      expect(boards).toEqual(mockBoards);
    });

    expect(dbService.boards.toArray).toHaveBeenCalled();
  });

  it('should add a new board', async () => {
    const newBoard: Board = {
      name: 'New Board',
      color: Colors.Green,
      icon: IconType.Eyes,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    jest.spyOn(mockDbService.boards, 'add');

    await service.addBoard(newBoard);

    expect(dbService.boards.add).toHaveBeenCalledWith(newBoard);
  });

  it('should get board by an id', async () => {
    const id = 1;

    mockDbService.tasks.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        sortBy: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve([])))
      })
    });

    jest.spyOn(mockDbService.boards, 'get');

    await service.getBoardById(id);

    expect(dbService.boards.get).toHaveBeenCalledWith(id);
    expect(dbService.tasks.where).toHaveBeenCalledWith('boardId');
  });

  it('should update an existing board', async () => {
    const updatedBoard: Board = {
      id: 1,
      name: 'Updated Board',
      color: Colors.Green,
      icon: IconType.Eyes,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    jest.spyOn(mockDbService.boards, 'where');

    await service.updateBoard(updatedBoard);

    expect(dbService.boards.where).toHaveBeenCalledWith('id');
  });

  it('should throw an error when updating a board without an id', async () => {
    const updatedBoard: Board = {
      name: 'Updated Board',
      color: Colors.Green,
      icon: IconType.Eyes,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    await expect(service.updateBoard(updatedBoard)).rejects.toThrow('Board id is required');
  });

  it('should delete a board by an id', async () => {
    const id = 1;

    mockDbService.boards.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        delete: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve(id)))
      })
    });

    jest.spyOn(mockDbService.boards, 'where');

    const result = await service.deleteBoard(id);

    expect(dbService.boards.where).toHaveBeenCalledWith('id');
    expect(result).toBe(id);
  });

  it('should catch an error when deleting a board', async () => {
    const id = 1;

    mockDbService.boards.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        delete: jest.fn().mockRejectedValueOnce(new Error('Error deleting'))
      })
    });

    jest.spyOn(mockDbService.boards, 'where');

    await expect(service.deleteBoard(id)).rejects.toThrow('Error deleting');
  });

  it('should create a new tag for a board', async () => {
    const board: Board = {
      id: 1,
      name: 'Board 1',
      color: Colors.Blue,
      icon: IconType.Tools,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    const tag: Tag = {
      id: `${Date.now()}`,
      name: 'Tag 1',
      color: Colors.Green
    };

    mockDbService.boards.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        modify: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve()))
      })
    });

    jest.spyOn(mockDbService.boards, 'where');

    await service.createTag(board, tag);

    expect(dbService.boards.where).toHaveBeenCalledWith('id');
  });

  it('should throw an error when creating a tag for a board without an id', async () => {
    const board: Board = {
      name: 'Board 1',
      color: Colors.Blue,
      icon: IconType.Tools,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    const tag: Tag = {
      id: `${Date.now()}`,
      name: 'Tag 1',
      color: Colors.Green
    };

    await expect(service.createTag(board, tag)).rejects.toThrow('Board id is required');
  });

  it('should delete a tag for a board', async () => {
    const board: Board = {
      id: 1,
      name: 'Board 1',
      color: Colors.Blue,
      icon: IconType.Tools,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    const tag: Tag = {
      id: `${Date.now()}`,
      name: 'Tag 1',
      color: Colors.Green
    };

    mockDbService.tasks.where = jest.fn().mockReturnValue({
      equals: jest.fn().mockReturnValue({
        sortBy: jest.fn().mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve([])))
      })
    });

    jest.spyOn(mockDbService.boards, 'where');

    await service.deleteTag(board, tag);

    expect(dbService.tasks.where).toHaveBeenCalledWith('boardId');
    expect(dbService.transaction).toHaveBeenCalled();
  });

  it('should throw an error when deleting a tag for a board without an id', async () => {
    const board: Board = {
      name: 'Board 1',
      color: Colors.Blue,
      icon: IconType.Tools,
      createdAt: new Date(),
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      tags: []
    };

    const tag: Tag = {
      id: `${Date.now()}`,
      name: 'Tag 1',
      color: Colors.Green
    };

    await expect(service.deleteTag(board, tag)).rejects.toThrow('Board id is required');
  });
});
