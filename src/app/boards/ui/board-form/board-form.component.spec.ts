import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardFormComponent } from './board-form.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../../state/boards.reducer';
import { of } from 'rxjs';
import { BoardsSelectors } from '../../state';
import { IconType } from '../../../core/models/board.interface';

describe('BoardFormComponent', () => {
  let component: BoardFormComponent;
  let fixture: ComponentFixture<BoardFormComponent>;
  let dialogRef: DialogRef;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardFormComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {
            outsidePointerEvents: {
              pipe: jest.fn().mockReturnValue(of({})),
            },
            close: jest.fn(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            board: undefined,
            confirmHandler: () => {},
          },
        },
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: BoardsSelectors.boardStatus,
              value: initialState.status,
            },
            {
              selector: BoardsSelectors.isBoardFormOpen,
              value: true,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardFormComponent);
    dialogRef = TestBed.inject(DialogRef);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when board is added or updated', () => {
    store.overrideSelector(BoardsSelectors.isBoardFormOpen, false);
    store.refreshState();
    fixture.detectChanges();

    expect(component.container.nativeElement.classList).toContain(
      'animate-zoom-out'
    );
  });

  it('should close dialog when click outside', () => {
    component.container.nativeElement.classList.add('animate-zoom-in');
    dialogRef.outsidePointerEvents.pipe().subscribe((event: MouseEvent) => {
      expect(event.type).toBe('click');
      expect(component.container.nativeElement.classList).not.toContain(
        'animate-zoom-in'
      );
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
    expect(component.container.nativeElement.classList).toContain(
      'animate-zoom-out'
    );
  });

  it('should set isSubmitted to true on submit', () => {
    component.onSubmit(document.createElement('input'));
    expect(component.isSubmitted()).toBeTruthy();
  });

  it('should not focus on name input if name is valid', () => {
    const nameInput = document.createElement('input');
    component.name?.setValue('Test board');
    component.onSubmit(nameInput);
    expect(nameInput).not.toEqual(document.activeElement);
  });

  it('should not submit if icon is invalid', () => {
    const confirmHandlerSpy = jest.spyOn(component.data, 'confirmHandler');
    component.iconSelected?.setErrors({ required: true });
    component.onSubmit(document.createElement('input'));
    expect(component.isSubmitted()).toBeTruthy();
    expect(confirmHandlerSpy).not.toHaveBeenCalled();
  });

  it('should call confirmHandler on submit', () => {
    const confirmHandlerSpy = jest.spyOn(component.data, 'confirmHandler');
    component.name?.setValue('Test board');
    component.iconSelected?.setValue(IconType.Books);
    component.onSubmit(document.createElement('input'));
    expect(confirmHandlerSpy).toHaveBeenCalled();
  });

  it('should close dialog on closeDialog', () => {
    component.container.nativeElement.classList.add('animate-zoom-in');
    component.closeDialog();
    expect(component.container.nativeElement.classList).toContain(
      'animate-zoom-out'
    );
  });

  it('should close dialog on animation end', () => {
    const spy = jest.spyOn(dialogRef, 'close');
    component.onCloseAnimationEnd({ animationName: 'zoom-out' } as any);
    expect(spy).toHaveBeenCalled();
  });
});
