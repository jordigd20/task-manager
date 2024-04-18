import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardComponent } from './task-card.component';
import { Task } from '../../../core/models/task.interface';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: 1,
    boardId: 1,
    index: 0,
    title: 'Default Task',
    status: 'backlog',
    createdAt: new Date(),
    image: '',
    tags: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;

    component.task = mockTask;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
