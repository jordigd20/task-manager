import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardLayoutComponent } from './board-layout.component';
import { ActivatedRoute } from '@angular/router';

describe('BoardLayoutComponent', () => {
  let component: BoardLayoutComponent;
  let fixture: ComponentFixture<BoardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardLayoutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
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
