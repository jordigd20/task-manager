import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { Board, IconType } from '../../../core/models/board.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { ObjectEntriesPipe } from '../../../core/pipes/object-entries.pipe';
import { iconsAvailable } from '../../../shared/utils/icons';
import { Store } from '@ngrx/store';
import { BoardsSelectors } from '../../state';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'board-form',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, ObjectEntriesPipe],
  templateUrl: './board-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fixed left-1/2 top-1/2 z-40 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
    'data-testid': 'board-form'
  }
})
export class BoardFormComponent {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  fb = inject(FormBuilder);
  dialogRef = inject(DialogRef);
  store = inject(Store);
  data: {
    board?: Board;
    confirmHandler: (board: Board) => void;
  } = inject(DIALOG_DATA);

  addBoardForm = this.fb.group({
    name: [this.data.board?.name ?? '', [Validators.required, Validators.minLength(3)]],
    icon: [this.data.board?.icon ?? IconType.Tools, Validators.required]
  });
  isBoardFormOpen = this.store.select(BoardsSelectors.isBoardFormOpen);
  boardStatus = toSignal(this.store.select(BoardsSelectors.boardStatus));
  iconsList = signal(iconsAvailable);
  isSubmitted = signal(false);
  destroy$ = new Subject<void>();

  get name() {
    return this.addBoardForm.get('name');
  }

  get iconSelected() {
    return this.addBoardForm.get('icon');
  }

  ngOnInit() {
    // Closes dialog when board is added or updated
    this.isBoardFormOpen
      .pipe(
        takeUntil(this.destroy$),
        filter((isOpen) => isOpen === false)
      )
      .subscribe(() => {
        this.closeDialog();
      });

    // Closes dialog when click outside
    this.dialogRef.outsidePointerEvents
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: MouseEvent) => {
        if (event.type === 'click' && this.boardStatus() !== 'loading') {
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

  onSubmit(nameInput: HTMLInputElement) {
    this.isSubmitted.set(true);

    if (this.name?.invalid) {
      nameInput.focus();
      return;
    }

    if (this.iconSelected?.invalid) {
      return;
    }

    // Edit board
    if (this.data.board?.id) {
      this.data.confirmHandler({
        ...this.data.board,
        name: this.name?.value as string,
        icon: this.iconSelected?.value as IconType,
        color: iconsAvailable[this.iconSelected?.value!]
      });

      return;
    }

    // Add board
    this.data.confirmHandler({
      name: this.name?.value as string,
      icon: this.iconSelected?.value as IconType,
      color: iconsAvailable[this.iconSelected?.value!],
      createdAt: new Date(),
      tags: [],
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed']
    });
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
