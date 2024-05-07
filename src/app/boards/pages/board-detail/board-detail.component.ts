import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskCardComponent } from '../../ui/task-card/task-card.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Task } from '../../../core/models/task.interface';
import { TaskSections, TasksActions, TasksSelectors } from '../../state/tasks';
import { BoardsActions } from '../../state/boards';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormComponent } from '../../ui/task-form/task-form.component';

@Component({
  selector: 'board-detail',
  standalone: true,
  imports: [TaskCardComponent, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './board-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full bg-background-elevated rounded-lg p-4'
  }
})
export class BoardDetailComponent {
  activatedRoute = inject(ActivatedRoute);
  store = inject(Store);
  dialog = inject(Dialog);

  taskStatus = {
    backlog: { title: 'Backlog', color: '#40bef4' },
    'in-progress': { title: 'In Progress', color: '#f4cb40' },
    'in-review': { title: 'In Review', color: '#b888f8' },
    completed: { title: 'Completed', color: '#79db88' }
  };
  tasks$ = this.store.select(TasksSelectors.tasks);
  board$ = this.store.select(TasksSelectors.activeBoard);
  tasks = signal<TaskSections | undefined>(undefined);
  board = toSignal(this.board$);
  boardSections = signal<(keyof TaskSections)[]>([]);
  loadStatus = toSignal(this.store.select(TasksSelectors.taskStatus));

  ngOnInit() {
    this.getActiveBoard();
    this.updateTasks();
    this.updateBoardSections();
  }

  getActiveBoard() {
    this.activatedRoute.params.subscribe((params) => {
      const id = Number(params['id']);

      if (isNaN(id)) {
        this.store.dispatch(TasksActions.getActiveBoardFailure({ error: 'Invalid board ID' }));
        return;
      }

      this.store.dispatch(TasksActions.getActiveBoard({ id }));
    });
  }

  updateTasks() {
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
  }

  updateBoardSections() {
    this.board$.subscribe((board) => {
      if (board?.tasksOrder) {
        this.boardSections.set([...board.tasksOrder]);
      }
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
          status: previousSection
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

  onSectionDrop(event: CdkDragDrop<(keyof TaskSections)[]>) {
    const { previousIndex, currentIndex, container } = event;

    if (this.board() == null) {
      return;
    }

    moveItemInArray(container.data, previousIndex, currentIndex);

    this.store.dispatch(
      BoardsActions.reorderTaskSections({ idBoard: this.board()?.id!, sections: container.data })
    );
  }

  openAddTaskForm() {
    this.store.dispatch(TasksActions.openTaskForm());

    this.dialog.open(TaskFormComponent, {
      id: 'task-form',
      ariaLabel: 'Add new task',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        confirmHandler: (task: Task) => this.store.dispatch(TasksActions.addTask({ task }))
      }
    });
  }

  openEditTaskForm(task: Task) {
    this.store.dispatch(TasksActions.openTaskForm());

    this.dialog.open(TaskFormComponent, {
      id: 'task-form',
      ariaLabel: 'Edit task',
      backdropClass: ['backdrop-blur-[1px]', 'bg-black/40'],
      disableClose: true,
      data: {
        task,
        confirmHandler: (task: Task) => this.store.dispatch(TasksActions.updateTask({ task }))
      }
    });
  }
}
