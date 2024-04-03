import { TestBed } from '@angular/core/testing';
import { BoardListService } from './board-list.service';
import { Board, Colors, IconType } from '../../core/models/board.interface';
import { DbService } from '../../core/services/db.service';
import Dexie from 'dexie';

describe('BoardListService', () => {
  let service: BoardListService;
  let dbService: DbService;

  const mockBoards: Board[] = [
    {
      id: 1,
      name: 'Board 1',
      color: Colors.Blue,
      icon: IconType.Tools,
      tags: [],
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Board 2',
      color: Colors.Orange,
      icon: IconType.Eyes,
      tags: [],
      createdAt: new Date(),
    },
  ];

  const mockDbService = {
    boards: {
      toArray: jest
        .fn()
        .mockResolvedValueOnce(
          new Dexie.Promise((resolve) => resolve(mockBoards))
        ),
      add: jest
        .fn()
        .mockReturnValue(new Dexie.Promise((resolve) => resolve(1))),
      where: jest.fn().mockReturnValue({
        equals: jest.fn().mockReturnValue({
          modify: jest
            .fn()
            .mockResolvedValueOnce(new Dexie.Promise((resolve) => resolve())),
        }),
      }),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DbService,
          useValue: mockDbService,
        },
      ],
    });

    dbService = TestBed.inject(DbService);
    service = TestBed.inject(BoardListService);
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
      tags: [],
      createdAt: new Date(),
    };

    jest.spyOn(mockDbService.boards, 'add');

    await service.addBoard(newBoard);

    expect(dbService.boards.add).toHaveBeenCalledWith(newBoard);
  });

  it('should update an existing board', async () => {
    const updatedBoard: Board = {
      id: 1,
      name: 'Updated Board',
      color: Colors.Green,
      icon: IconType.Eyes,
      tags: [],
      createdAt: new Date(),
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
      tags: [],
      createdAt: new Date(),
    };

    await expect(service.updateBoard(updatedBoard)).rejects.toThrow(
      'Board id is required'
    );
  });
});
