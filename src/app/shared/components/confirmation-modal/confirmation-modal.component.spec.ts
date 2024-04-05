import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { of } from 'rxjs';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let dialogRef: DialogRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
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
            title: 'Delete board',
            message: 'Are you sure you want to delete this board?',
            confirmText: 'Delete',
            isDestructive: true,
            confirmHandler: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    dialogRef = TestBed.inject(DialogRef);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should destroy subscriptions', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
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

  it('should close dialog on keyup esc', () => {
    component.container.nativeElement.classList.add('animate-zoom-in');
    component.onKeyUpEsc();
    expect(component.container.nativeElement.classList).toContain(
      'animate-zoom-out'
    );
  });

  it('should close dialog on confirm', () => {
    component.confirm();
    expect(component.container.nativeElement.classList).toContain(
      'animate-zoom-out'
    );
  });

  it('should close dialog on animation end', () => {
    const spy = jest.spyOn(dialogRef, 'close');
    component.onCloseAnimationEnd({ animationName: 'zoom-out' } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should call confirmHandler on confirm', () => {
    const confirmHandlerSpy = jest.spyOn(component.data, 'confirmHandler');
    component.confirm();
    expect(confirmHandlerSpy).toHaveBeenCalled();
  });
});
