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
    boardsTable: {
      toArray: jest
        .fn()
        .mockResolvedValueOnce(
          new Dexie.Promise((resolve) => resolve(mockBoards))
        ),
    },
    boards: {
      toArray: jest
        .fn()
        .mockResolvedValueOnce(
          new Dexie.Promise((resolve) => resolve(mockBoards))
        ),
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
});
