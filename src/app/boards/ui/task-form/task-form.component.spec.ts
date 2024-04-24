import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TasksSelectors, initialState } from '../../state/tasks';
import { of } from 'rxjs';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {
            outsidePointerEvents: {
              pipe: jest.fn().mockReturnValue(of({}))
            },
            close: jest.fn()
          }
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            board: undefined,
            confirmHandler: () => {}
          }
        },
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: TasksSelectors.activeBoard,
              value: initialState.activeBoard
            },
            {
              selector: TasksSelectors.taskStatus,
              value: initialState.status
            },
            {
              selector: TasksSelectors.isTaskFormOpen,
              value: initialState.isTaskFormOpen
            }
          ]
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
