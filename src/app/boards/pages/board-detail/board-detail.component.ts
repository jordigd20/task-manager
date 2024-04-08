import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BoardsActions, BoardsSelectors } from '../../state';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskCardComponent } from '../../ui/task-card/task-card.component';

@Component({
  selector: 'board-detail',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './board-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full bg-background-elevated rounded-lg p-4'
  }
})
export class BoardDetailComponent {
  activatedRoute = inject(ActivatedRoute);
  store = inject(Store);

  board = toSignal(this.store.select(BoardsSelectors.selectedBoard));
  tasks = toSignal(this.store.select(BoardsSelectors.tasks));
  taskStatus = {
    backlog: { title: 'Backlog', color: '#40bef4' },
    'in-progress': { title: 'In Progress', color: '#f4cb40' },
    'in-review': { title: 'In Review', color: '#b888f8' },
    completed: { title: 'Completed', color: '#79db88' }
  };

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id = Number(params['id']);

      if (isNaN(id)) {
        return;
      }

      this.store.dispatch(BoardsActions.getBoardById({ id }));
    });
  }
}
