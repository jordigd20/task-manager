import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
  signal
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivationEnd, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BoardsActions, BoardsSelectors } from '../../../boards/state/boards';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, filter, takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { BoardFormComponent } from '../../../boards/ui/board-form/board-form.component';
import { Board } from '../../../core/models/board.interface';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full max-h-screen py-4 px-0 xl:px-4  overflow-y-hidden overflow-x-hidden '
  }
})
export class SidebarComponent implements OnInit, OnDestroy {
  renderer = inject(Renderer2);
  store = inject(Store);
  router = inject(Router);
  dialog = inject(Dialog);

  isDarkMode = signal<boolean>(document.documentElement.classList.contains('dark'));
  boards = toSignal(this.store.select(BoardsSelectors.boards));
  boardStatus = toSignal(this.store.select(BoardsSelectors.boardStatus));
  activeBoard = signal<number | undefined>(undefined);
  destroy$ = new Subject<void>();

  constructor() {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        const idBoard = Number(event.snapshot.params['id']);

        if (!isNaN(idBoard)) this.activeBoard.set(idBoard);
        else this.activeBoard.set(undefined);
      });
  }

  ngOnInit() {
    this.store.dispatch(BoardsActions.loadBoards());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleThemeMode() {
    this.isDarkMode() ? this.switchToLightMode() : this.switchToDarkMode();
  }

  switchToDarkMode() {
    this.isDarkMode.set(true);
    this.renderer.addClass(document.documentElement, 'dark');
  }

  switchToLightMode() {
    this.isDarkMode.set(false);
    this.renderer.removeClass(document.documentElement, 'dark');
  }

  openAddBoardDialog() {
    this.store.dispatch(BoardsActions.openBoardForm());
    this.dialog.open(BoardFormComponent, {
      ariaLabel: 'Add new board',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        confirmHandler: (board: Board) => {
          this.store.dispatch(BoardsActions.addBoard({ board }));
        }
      }
    });
  }
}
