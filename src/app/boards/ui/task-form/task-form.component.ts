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
import { Subject, filter, map, takeUntil } from 'rxjs';
import { TasksActions, TasksSelectors } from '../../state/tasks';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadService } from '../../../core/services/upload.service';

const tagColors = ['purple', 'blue', 'green', 'yellow', 'red'];

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
  @ViewChild('taskNameInput') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('createTagInput') createTagInput!: ElementRef<HTMLInputElement>;

  dialogRef = inject(DialogRef);
  dialog = inject(Dialog);
  store = inject(Store);
  fb = inject(FormBuilder);
  uploadService = inject(UploadService);
  data: {
    task?: Task;
    confirmHandler: (task: Task) => void;
  } = inject(DIALOG_DATA);

  taskForm = this.fb.group({
    name: [
      this.data.task?.title ?? '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(200)]
    ],
    file: [{} as File],
    createTag: ['', Validators.maxLength(20)],
    tags: [this.data.task?.tags ?? []]
  });

  isTaskFormOpen$ = this.store.select(TasksSelectors.isTaskFormOpen);
  activeBoard = toSignal(this.store.select(TasksSelectors.activeBoard));
  backlogTasks = toSignal(
    this.store.select(TasksSelectors.tasks).pipe(map((tasks) => tasks.backlog))
  );
  taskStatus = toSignal(this.store.select(TasksSelectors.taskStatus));
  availableTags = computed(() => this.activeBoard()?.tags ?? []);
  activeTags: { [key: string]: boolean } = {};

  imageUrl = signal<string>(this.data.task?.image.url ?? '');
  imageId = signal<string>(this.data.task?.image.publicId ?? '');
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
    this.closeDialogAtEnd();
    this.handleClickOutsideDialog();
    this.handleTags();
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

  @HostListener('window:keydown.enter', ['$event']) onKeyUpEnter(event: KeyboardEvent) {
    if (event.target === this.createTagInput.nativeElement) {
      event.preventDefault();
      this.onCreateTag();
    }
  }

  closeDialogAtEnd() {
    this.isTaskFormOpen$
      .pipe(
        filter((isOpen) => isOpen === false),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeDialog();
      });
  }

  handleClickOutsideDialog() {
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

  handleTags() {
    for (const tag of this.availableTags()) {
      this.activeTags[tag.id] = this.tags?.value?.find((t) => t.id === tag.id) != null;
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
            TasksActions.deleteTag({
              board: {
                ...this.activeBoard()!,
                tags: this.activeBoard()!.tags.filter((t) => t.id !== tag.id)
              },
              tag
            })
          )
      }
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.disableClosingDialog.set(false);
    });
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer || event.dataTransfer?.files.length === 0) {
      return;
    }

    if (event.dataTransfer.files.length > 1) {
      // TODO: Show error message
      console.warn('Only one file can be uploaded at a time');
      return;
    }

    const file = event.dataTransfer.files[0];
    this.readFile(file);
  }

  onFileUpload(event: any) {
    const file = event.target.files[0] as File;

    if (file == null) {
      return;
    }

    this.readFile(file);
  }

  readFile(file: File) {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg',
      'image/webp',
      'image/avif',
      'image/svg+xml'
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      // TODO: Show error message
      console.warn('File extension not supported');
      return;
    }

    if (file.size > 1024 * 1024 * 2) {
      // TODO: Show error message
      console.warn('File size is too large');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
      this.taskForm.patchValue({ file });
    };

    reader.readAsDataURL(file);
  }

  deleteImage() {
    this.imageUrl.set('');
    this.taskForm.patchValue({ file: {} as File });
  }

  onCreateTag() {
    if (this.createTag?.invalid || this.createTag?.value === '') {
      this.createTagInput.nativeElement.focus();
      return;
    }

    if (this.activeBoard()!.tags.length >= 5) {
      // TODO: Show error message
      return;
    }

    const currentColors = this.activeBoard()!.tags.map((tag) => tag.color);
    const shuffledColors = tagColors.sort(() => 0.5 - Math.random());
    const availableColors = shuffledColors.filter((color) => !currentColors.includes(color));

    const tag: Tag = {
      id: `${Date.now()}`,
      name: this.createTag!.value!.trim(),
      color: availableColors.length > 0 ? availableColors[0] : shuffledColors[0]
    };

    this.store.dispatch(
      TasksActions.createTag({
        board: this.activeBoard()!,
        tag
      })
    );
  }

  toggleTag(tag: Tag) {
    if (this.tags == null || this.tags.value == null) {
      return;
    }

    const isActive = !this.activeTags[tag.id];

    if (isActive) {
      this.tags.setValue([...this.tags.value, tag]);
    } else {
      this.tags.setValue(this.tags.value.filter((t) => t.id !== tag.id));
    }

    this.activeTags[tag.id] = isActive;
  }

  onSubmit() {
    this.isSubmitted.set(true);

    if (this.activeBoard() == null || this.backlogTasks() == null) {
      return;
    }

    if (this.name?.invalid) {
      this.nameInput.nativeElement.focus();
      return;
    }

    this.store.dispatch(TasksActions.setStatus({ status: 'loading' }));

    if (this.data.task?.id) {
      this.updateTask();
      return;
    }

    this.createTask();
  }

  updateTask() {
    // If the image is updated and the previous image is the default image
    if (
      this.imageUrl() &&
      this.taskForm.get('file')?.value &&
      this.imageUrl() !== this.data.task?.image.url &&
      (this.data.task?.image.publicId === 'cld-sample-2' || this.data.task?.image.publicId === '')
    ) {
      this.uploadService.createImage(this.taskForm.get('file')?.value!).subscribe({
        next: (response) => {
          this.data.confirmHandler({
            ...this.data.task!,
            title: this.name?.value as string,
            tags: this.tags?.value as Tag[],
            image: {
              url: response.secureUrl,
              publicId: response.publicId
            }
          });
        },
        error: (error) => {
          // TODO: Show error message
          console.error(error);
          this.store.dispatch(TasksActions.setStatus({ status: 'success' }));
        }
      });

      return;
    }

    // If the image is updated and the previous image is not the default image
    if (
      this.imageUrl() &&
      this.taskForm.get('file')?.value &&
      this.imageUrl() !== this.data.task?.image.url
    ) {
      this.uploadService.updateImage(this.imageId(), this.taskForm.get('file')?.value!).subscribe({
        next: (response) => {
          this.data.confirmHandler({
            ...this.data.task!,
            title: this.name?.value as string,
            tags: this.tags?.value as Tag[],
            image: {
              url: response.secureUrl,
              publicId: response.publicId
            }
          });
        },
        error: (error) => {
          // TODO: Show error message
          console.error(error);
          this.store.dispatch(TasksActions.setStatus({ status: 'success' }));
        }
      });

      return;
    }

    // If there was an image and it's been removed
    if (!this.imageUrl() && this.data.task?.image.publicId) {
      this.uploadService.deleteImage(this.data.task?.image.publicId).subscribe({
        next: () => {
          this.data.confirmHandler({
            ...this.data.task!,
            title: this.name?.value as string,
            tags: this.tags?.value as Tag[],
            image: { url: '', publicId: '' }
          });
        },
        error: (error) => {
          // TODO: Show error message
          console.error(error);
          this.store.dispatch(TasksActions.setStatus({ status: 'success' }));
        }
      });

      return;
    }

    // No image has been updated
    this.data.confirmHandler({
      ...this.data.task!,
      title: this.name?.value as string,
      tags: this.tags?.value as Tag[],
      image: {
        url: this.imageUrl() || '',
        publicId: this.imageId() || ''
      }
    });
  }

  createTask() {
    if (this.imageUrl() && this.taskForm.get('file')?.value) {
      this.uploadService.createImage(this.taskForm.get('file')?.value!).subscribe({
        next: (response) => {
          this.data.confirmHandler({
            boardId: this.activeBoard()!.id!,
            index: this.backlogTasks()!.length,
            title: this.name?.value as string,
            status: 'backlog',
            tags: this.tags?.value as Tag[],
            image: {
              url: response.secureUrl,
              publicId: response.publicId
            },
            createdAt: new Date()
          });
        },
        error: (error) => {
          // TODO: Show error message
          console.error(error);
          this.store.dispatch(TasksActions.setStatus({ status: 'success' }));
        }
      });

      return;
    }

    this.data.confirmHandler({
      boardId: this.activeBoard()!.id!,
      index: this.backlogTasks()!.length,
      title: this.name?.value as string,
      status: 'backlog',
      tags: this.tags?.value as Tag[],
      image: { url: '', publicId: '' },
      createdAt: new Date()
    });
  }
}
