import { TestBed } from '@angular/core/testing';
import { DbService } from './db.service';
import Dexie, { PromiseExtended } from 'dexie';

describe('DbService', () => {
  let service: DbService;
  let spyDbOpen: jest.SpyInstance<PromiseExtended<Dexie>>;

  beforeEach(() => {
    spyDbOpen = jest
      .spyOn(Dexie.prototype, 'open')
      .mockResolvedValueOnce(new Dexie.Promise(() => {}));

    TestBed.configureTestingModule({});
    service = TestBed.inject(DbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(spyDbOpen).toHaveBeenCalled();
  });

  // it('should populate the database', async () => {
  //   const spyAddBoards = jest.spyOn(service.boards, 'add').mockResolvedValue(1);
  //   const spyAddTasks = jest.spyOn(service.tasks, 'add').mockResolvedValue(1);

  //   await service.populate();

  //   expect(spyAddBoards).toHaveBeenCalled();
  //   expect(spyAddTasks).toHaveBeenCalled();
  // });

  //FIXME: Just for testing, delete later
  it('should populate the database', async () => {
    const spyAddBoards = jest
      .spyOn(service.boards, 'bulkAdd')
      .mockResolvedValue(1);

    await service.populate();

    expect(spyAddBoards).toHaveBeenCalled();
  });
});
