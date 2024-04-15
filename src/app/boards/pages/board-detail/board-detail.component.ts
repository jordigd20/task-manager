import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskCardComponent } from '../../ui/task-card/task-card.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Task } from '../../../core/models/task.interface';
import { TaskSections, TasksActions, TasksSelectors } from '../../state/tasks';

@Component({
  selector: 'board-detail',
  standalone: true,
  imports: [TaskCardComponent, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './board-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full bg-background-elevated rounded-lg p-4'
  }
})
export class BoardDetailComponent {
  activatedRoute = inject(ActivatedRoute);
  store = inject(Store);

  taskStatus = {
    backlog: { title: 'Backlog', color: '#40bef4' },
    'in-progress': { title: 'In Progress', color: '#f4cb40' },
    'in-review': { title: 'In Review', color: '#b888f8' },
    completed: { title: 'Completed', color: '#79db88' }
  };
  tasks$ = this.store.select(TasksSelectors.tasks);
  board = toSignal(this.store.select(TasksSelectors.activeBoard));
  tasks = signal<TaskSections | undefined>(undefined);
  loadStatus = toSignal(this.store.select(TasksSelectors.taskStatus));

  ngOnInit() {
    this.tasks$.subscribe((tasks) => {
      this.tasks.update((state) => {
        if (!state) {
          return tasks;
        }

        return {
          ...state,
          backlog: [...tasks.backlog],
          'in-progress': [...tasks['in-progress']],
          'in-review': [...tasks['in-review']],
          completed: [...tasks.completed]
        };
      });
    });

    this.activatedRoute.params.subscribe((params) => {
      const id = Number(params['id']);

      if (isNaN(id)) {
        this.store.dispatch(TasksActions.getActiveBoardFailure({ error: 'Invalid board ID' }));
        return;
      }

      this.store.dispatch(TasksActions.getActiveBoard({ id }));
    });
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    const { previousContainer, container, previousIndex, currentIndex } = event;

    const previousSection = previousContainer.id as keyof TaskSections;
    const currentSection = container.id as keyof TaskSections;

    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);

      this.store.dispatch(
        TasksActions.reorderTask({
          tasks: container.data,
          status: previousSection,
          fromIndex: previousIndex,
          toIndex: currentIndex
        })
      );
    } else {
      transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);

      this.store.dispatch(
        TasksActions.transferTask({
          previousSectionTasks: previousContainer.data,
          targetSectionTasks: container.data,
          previousSection: previousSection,
          targetSection: currentSection
        })
      );
    }
  }
}
