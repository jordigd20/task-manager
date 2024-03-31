import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BoardLayoutComponent } from '../../ui/board-layout/board-layout.component';
import { BoardListService } from '../../services/board-list.service';
import { RouterLink } from '@angular/router';
import { BoardCardComponent } from '../../ui/board-card/board-card.component';
import { CommonModule } from '@angular/common';
import { Board } from '../../../core/models/board.interface';
import { Store } from '@ngrx/store';
import { BoardsActions, BoardsSelectors } from '../../state';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { boardStatus } from '../../state/boards.selectors';

@Component({
  selector: 'board-list',
  standalone: true,
  imports: [
    BoardLayoutComponent,
    CommonModule,
    RouterLink,
    BoardCardComponent,
    FooterComponent,
  ],
  templateUrl: './board-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'relative block w-full h-full bg-background-elevated rounded-lg p-4 overflow-y-auto scrollbar',
  },
})
export class BoardListComponent {
  boardListService = inject(BoardListService);
  store = inject(Store);
  boards = toSignal(this.store.select(BoardsSelectors.boards));
  boardStatus = toSignal(this.store.select(boardStatus));

  trackByBoardId(index: number, board: Board) {
    return board.id;
  }

  loadBoards() {
    this.store.dispatch(BoardsActions.loadBoards());
  }
}
