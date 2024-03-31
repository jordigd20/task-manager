import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardCardComponent } from './board-card.component';
import { ActivatedRoute } from '@angular/router';

describe('BoardCardComponent', () => {
  let component: BoardCardComponent;
  let fixture: ComponentFixture<BoardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
