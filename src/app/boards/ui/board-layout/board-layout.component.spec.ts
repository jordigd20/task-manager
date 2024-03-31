import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardLayoutComponent } from './board-layout.component';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../state/boards.reducer';
import { BoardsSelectors } from '../../state';

describe('BoardLayoutComponent', () => {
  let component: BoardLayoutComponent;
  let fixture: ComponentFixture<BoardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardLayoutComponent, SidebarComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
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

    fixture = TestBed.createComponent(BoardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
