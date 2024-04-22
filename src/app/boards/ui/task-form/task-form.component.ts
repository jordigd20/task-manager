import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  HostListener,
  signal
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from '../../../core/models/task.interface';
import { Subject, filter, takeUntil } from 'rxjs';
import { TasksSelectors } from '../../state/tasks';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [NgClass],
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fixed left-1/2 top-1/2 z-40 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
    'data-testid': 'task-form'
  }
})
export class TaskFormComponent implements OnInit, OnDestroy {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  dialogRef = inject(DialogRef);
  dialog = inject(Dialog);
  store = inject(Store);
  data: {
    task?: Task;
    confirmHandler: (task: Task) => void;
  } = inject(DIALOG_DATA);

  isTaskFormOpen = this.store.select(TasksSelectors.isTaskFormOpen);
  taskStatus = toSignal(this.store.select(TasksSelectors.taskStatus));
  disableClosingDialog = signal(false);
  destroy$ = new Subject<void>();

  ngOnInit() {
    this.isTaskFormOpen
      .pipe(
        takeUntil(this.destroy$),
        filter((isOpen) => isOpen === false)
      )
      .subscribe(() => {
        this.closeDialog();
      });

    // Closes dialog when click outside
    this.dialogRef.outsidePointerEvents
      .pipe(
        filter(() => !this.disableClosingDialog()),
        takeUntil(this.destroy$)
      )
      .subscribe((event: MouseEvent) => {
        if (event.type === 'click' && this.taskStatus() !== 'loading') {
          this.closeDialog();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:keyup.esc') onKeyUpEsc() {
    if (!this.disableClosingDialog()) {
      this.closeDialog();
    }
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

  openDeleteTaskDialog() {
    this.disableClosingDialog.set(true);

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      id: 'confirmation-modal',
      ariaLabel: 'Delete task',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        title: 'Delete task',
        message: `Are you sure you want to delete "<b>${``}</b>" task?`,
        confirmText: 'Delete',
        isDestructive: true,
        confirmHandler: () => console.log
        // confirmHandler: () => this.store.dispatch(TasksActions.deleteTask({ id: task.id! }))
      }
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.disableClosingDialog.set(false);
    });
  }
}
