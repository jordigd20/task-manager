import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardListComponent } from './board-list.component';
import { BoardListService } from '../../services/board-list.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../state/boards.reducer';
import { BoardsSelectors } from '../../state';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { ActivatedRoute } from '@angular/router';

describe('BoardListComponent', () => {
  let component: BoardListComponent;
  let fixture: ComponentFixture<BoardListComponent>;
  let boardListService: BoardListService;
  let store: MockStore;

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
      imports: [BoardListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: BoardListService,
          useValue: {
            getBoards: jest.fn(),
          },
        },
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: BoardsSelectors.boards,
              value: initialState.boards,
            },
            {
              selector: BoardsSelectors.boardStatus,
              value: initialState.status,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardListComponent);
    boardListService = TestBed.inject(BoardListService);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the boards at component init', () => {
    expect(component.boards()).toEqual(initialState.boards);
    expect(component.boardStatus()).toEqual(initialState.status);

    store.overrideSelector(BoardsSelectors.boards, mockBoards);
    store.overrideSelector(BoardsSelectors.boardStatus, 'success');
    store.refreshState();
    fixture.detectChanges();

    expect(component.boards()).toEqual(mockBoards);
    expect(component.boardStatus()).toEqual('success');
  });

  it('should dispatch loadBoards action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.loadBoards();
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
