import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TasksSelectors, initialState } from '../../state/tasks';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Board } from '../../../core/models/board.interface';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let dialogRef: DialogRef;
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
    dialogRef = TestBed.inject(DialogRef);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should close dialog when board is added or updated', () => {
  //   store.overrideSelector(TasksSelectors.isTaskFormOpen, false);
  //   store.refreshState();
  //   fixture.detectChanges();

  //   expect(component.container.nativeElement.classList).toContain('animate-zoom-out');

  // });

  it('should close dialog when click outside', () => {
    component.container.nativeElement.classList.add('animate-zoom-in');
    dialogRef.outsidePointerEvents.pipe().subscribe((event: MouseEvent) => {
      expect(event.type).toBe('click');
      expect(component.container.nativeElement.classList).not.toContain('animate-zoom-in');
    });
  });

  it('should destroy subscriptions', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should close dialog on keyup esc', () => {
    component.container.nativeElement.classList.add('animate-zoom-in');
    component.onKeyUpEsc();
    expect(component.container.nativeElement.classList).toContain('animate-zoom-out');
  });

  it('should set isSubmitted to true on submit', () => {
    component.onSubmit();
    expect(component.isSubmitted()).toBeTruthy();
  });

  it('should not focus on name input if name is valid', () => {
    const nameInput = document.createElement('input');
    component.nameInput.nativeElement = nameInput;

    component.activeBoard = signal({} as Board);
    component.backlogTasks = signal([]);
    component.name?.setValue('Test board');
    component.onSubmit();

    expect(component.nameInput.nativeElement).not.toEqual(document.activeElement);
  });

  it('should call confirmHandler on submit', () => {
    const confirmHandlerSpy = jest.spyOn(component.data, 'confirmHandler');

    component.activeBoard = signal({} as Board);
    component.backlogTasks = signal([]);
    component.name?.setValue('Test board');
    component.onSubmit();

    expect(confirmHandlerSpy).toHaveBeenCalled();
  });

  it('should close dialog on closeDialog', () => {
    component.container.nativeElement.classList.add('animate-zoom-in');
    component.closeDialog();
    expect(component.container.nativeElement.classList).toContain('animate-zoom-out');
  });

  it('should close dialog on animation end', () => {
    const spy = jest.spyOn(dialogRef, 'close');
    component.onCloseAnimationEnd({ animationName: 'zoom-out' } as any);
    expect(spy).toHaveBeenCalled();
  });
});
