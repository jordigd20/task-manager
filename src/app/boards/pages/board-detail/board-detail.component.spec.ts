import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardDetailComponent } from './board-detail.component';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BoardsActions, BoardsSelectors, initialState } from '../../state/boards';

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
              selector: BoardsSelectors.selectedBoard,
              value: initialState.selectedBoard
            },
            {
              selector: BoardsSelectors.tasks,
              value: initialState.tasks
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

  it('should dispatch getBoardById action on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(BoardsActions.getBoardById({ id: 1 }));
  });

  it('should not dispatch getBoardById action on ngOnInit if id is not a number', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    activatedRoute.params.subscribe = jest.fn().mockImplementation((cb) => {
      cb({ id: 'invalid' });
    });

    component.ngOnInit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
