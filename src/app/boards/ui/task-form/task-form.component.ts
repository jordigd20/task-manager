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
  signal,
  computed
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Tag, Task } from '../../../core/models/task.interface';
import { Subject, filter, takeUntil } from 'rxjs';
import { TasksActions, TasksSelectors } from '../../state/tasks';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardsActions } from '../../state/boards';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
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
  fb = inject(FormBuilder);
  data: {
    task?: Task;
    confirmHandler: (task: Task) => void;
  } = inject(DIALOG_DATA);

  taskForm = this.fb.group({
    name: [
      this.data.task?.title ?? '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(200)]
    ],
    status: ['backlog', Validators.required],
    createTag: ['', Validators.maxLength(20)],
    tags: [this.data.task?.tags ?? []]
  });

  isTaskFormOpen$ = this.store.select(TasksSelectors.isTaskFormOpen);
  activeBoard = toSignal(this.store.select(TasksSelectors.activeBoard));
  taskStatus = toSignal(this.store.select(TasksSelectors.taskStatus));
  availableTags = computed(() => this.activeBoard()?.tags);

  disableClosingDialog = signal(false);
  isSubmitted = signal(false);
  destroy$ = new Subject<void>();

  get name() {
    return this.taskForm.get('name');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get createTag() {
    return this.taskForm.get('createTag');
  }

  get tags() {
    return this.taskForm.get('tags');
  }

  ngOnInit() {
    this.isTaskFormOpen$
      .pipe(
        filter((isOpen) => isOpen === false),
        takeUntil(this.destroy$)
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

  openDeleteTagDialog(tag: Tag) {
    this.disableClosingDialog.set(true);

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      id: 'confirmation-modal',
      ariaLabel: 'Delete tag',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        title: 'Delete tag',
        message: `Are you sure you want to delete "<b>${tag.name}</b>" tag?`,
        confirmText: 'Delete',
        isDestructive: true,
        confirmHandler: () =>
          this.store.dispatch(
            TasksActions.updateBoardTags({
              board: {
                ...this.activeBoard()!,
                tags: this.activeBoard()!.tags.filter((t) => t.id !== tag.id)
              }
            })
          )
      }
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.disableClosingDialog.set(false);
    });
  }

  onCreateTag() {
    if (this.createTag?.invalid || this.createTag?.value === '') {
      return;
    }

    if (this.activeBoard()!.tags.length >= 5) {
      // TODO: Show error message
      return;
    }

    const tag: Tag = {
      id: `${Date.now()}`,
      name: this.createTag!.value!.trim(),
      color: 'purple'
    };

    this.store.dispatch(
      TasksActions.updateBoardTags({
        board: {
          ...this.activeBoard()!,
          tags: [...this.activeBoard()!.tags, tag]
        }
      })
    );
    // this.store.dispatch(
    //   BoardsActions.updateBoard({
    //     board: {
    //       ...this.activeBoard()!,
    //       tags: [...this.activeBoard()!.tags, tag]
    //     }
    //   })
    // );
  }

  toggleTag(tag: Tag) {
    if (this.tags == null || this.tags.value == null) {
      return;
    }

    if (this.tags.value.includes(tag)) {
      this.tags.setValue(this.tags.value.filter((t) => t.id !== tag.id));
    } else {
      this.tags.setValue([...this.tags.value, tag]);
    }
  }

  onSubmit() {
    console.log(this.taskForm);
    this.isSubmitted.set(true);
  }
}
