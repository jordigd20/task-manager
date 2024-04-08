import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardCardComponent } from './board-card.component';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Colors, IconType } from '../../../core/models/board.interface';

describe('BoardCardComponent', () => {
  let component: BoardCardComponent;
  let fixture: ComponentFixture<BoardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardCardComponent);
    component = fixture.componentInstance;

    component.board = {
      id: 1,
      name: 'Default Board',
      icon: IconType.Key,
      color: Colors.Green,
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      createdAt: new Date(),
      tags: []
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit event when edit is called', () => {
    jest.spyOn(component.edit, 'emit');
    component.edit.emit();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('should emit delete event when delete is called', () => {
    jest.spyOn(component.delete, 'emit');
    component.delete.emit();
    expect(component.delete.emit).toHaveBeenCalled();
  });
});
