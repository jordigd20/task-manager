import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BoardLayoutComponent } from '../../ui/board-layout/board-layout.component';
import { RouterLink } from '@angular/router';
import { BoardCardComponent } from '../../ui/board-card/board-card.component';
import { CommonModule } from '@angular/common';
import { Board } from '../../../core/models/board.interface';
import { Store } from '@ngrx/store';
import { BoardsActions, BoardsSelectors } from '../../state/boards';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { BoardFormComponent } from '../../ui/board-form/board-form.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'board-list',
  standalone: true,
  imports: [
    BoardLayoutComponent,
    CommonModule,
    RouterLink,
    BoardCardComponent,
    FooterComponent,
    DialogModule
  ],
  templateUrl: './board-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'relative block w-full h-full bg-background-elevated rounded-lg p-4 overflow-y-auto scrollbar'
  }
})
export class BoardListComponent {
  store = inject(Store);
  dialog = inject(Dialog);

  boards = toSignal(this.store.select(BoardsSelectors.boards));
  boardStatus = toSignal(this.store.select(BoardsSelectors.boardStatus));

  trackByBoardId(index: number, board: Board) {
    return board.id;
  }

  loadBoards() {
    this.store.dispatch(BoardsActions.loadBoards());
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

  openEditBoardDialog(board: Board) {
    this.store.dispatch(BoardsActions.openBoardForm());
    this.dialog.open(BoardFormComponent, {
      ariaLabel: 'Edit board',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        board,
        confirmHandler: (newBoard: Board) =>
          this.store.dispatch(BoardsActions.updateBoard({ board: newBoard }))
      }
    });
  }

  openDeleteBoardDialog(board: Board) {
    this.store.dispatch(BoardsActions.openBoardForm());
    this.dialog.open(ConfirmationModalComponent, {
      ariaLabel: 'Delete board',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        title: 'Delete board',
        message: `Are you sure you want to delete "<b>${board.name}</b>" board?`,
        confirmText: 'Delete',
        isDestructive: true,
        confirmHandler: () => this.store.dispatch(BoardsActions.deleteBoard({ id: board.id! }))
      }
    });
  }
}
