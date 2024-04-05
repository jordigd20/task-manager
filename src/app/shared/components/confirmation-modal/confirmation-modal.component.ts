import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'fixed left-1/2 top-1/2 z-40 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
    'data-testid': 'confirmation-modal',
  },
})
export class ConfirmationModalComponent {
  @ViewChild('container')
  container!: ElementRef<HTMLDivElement>;

  @ViewChild('message', { static: true })
  message!: ElementRef<HTMLParagraphElement>;

  dialogRef = inject(DialogRef);
  data: {
    title: string;
    message: string;
    confirmText: string;
    isDestructive?: boolean;
    confirmHandler: () => void;
  } = inject(DIALOG_DATA);

  destroy$ = new Subject<void>();

  ngOnInit() {
    this.message.nativeElement.innerHTML = this.data.message;

    this.dialogRef.outsidePointerEvents
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: MouseEvent) => {
        if (event.type === 'click') {
          this.closeDialog();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:keyup.esc') onKeyUpEsc() {
    this.closeDialog();
  }

  confirm() {
    this.data.confirmHandler();
    this.closeDialog();
  }

  closeDialog() {
    this.container.nativeElement.classList.remove('animate-zoom-in');
    this.container.nativeElement.classList.add('animate-zoom-out');
  }

  onCloseAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'zoom-out') {
      this.dialogRef.close();
    }
  }
}
