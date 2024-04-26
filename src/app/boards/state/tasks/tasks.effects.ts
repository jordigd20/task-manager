import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { TaskSections, TasksActions } from '.';
import { BoardService } from '../../../core/services/boards.service';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksService);
  private boardService = inject(BoardService);

  getActiveBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.getActiveBoard),
      switchMap(({ id }) =>
        from(this.boardService.getBoardById(id)).pipe(
          map(({ board, tasks }) => {
            const taskState: TaskSections = {
              backlog: [],
              'in-progress': [],
              'in-review': [],
              completed: []
            };

            for (let i = 0; i < tasks.length; i++) {
              const task = tasks[i];
              taskState[task.status].splice(task.index, 0, task);
            }

            return { board, tasks: taskState };
          }),
          map(({ board, tasks }) => TasksActions.getActiveBoardSuccess({ board, tasks })),
          catchError((error) => of(TasksActions.getActiveBoardFailure({ error: error.message })))
        )
      )
    )
  );

  reorderTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.reorderTask),
      switchMap(({ tasks, status, fromIndex, toIndex }) =>
        from(
          this.tasksService.reorderTasks({
            tasks,
            status,
            fromIndex,
            toIndex
          })
        ).pipe(
          map(({ tasks, status }) => TasksActions.reorderTaskSuccess({ tasks, status })),
          catchError((error) => of(TasksActions.reorderTaskFailure({ error: error.message })))
        )
      )
    )
  );

  transferTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.transferTask),
      switchMap(({ previousSectionTasks, targetSectionTasks, previousSection, targetSection }) =>
        from(
          this.tasksService.transferTask({
            previousSectionTasks,
            targetSectionTasks,
            previousSection,
            targetSection
          })
        ).pipe(
          map(({ previousSectionTasks, targetSectionTasks, previousSection, targetSection }) =>
            TasksActions.transferTaskSuccess({
              previousSectionTasks,
              targetSectionTasks,
              previousSection,
              targetSection
            })
          ),
          catchError((error) => of(TasksActions.transferTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateBoardTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateBoardTags),
      switchMap(({ board }) =>
        from(this.boardService.updateBoard(board)).pipe(
          map(() => TasksActions.updateBoardTagsSuccess({ tags: board.tags })),
          catchError((error) => of(TasksActions.updateBoardTagsFailure({ error: error.message })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.addTask),
      switchMap(({ task }) =>
        from(this.tasksService.createTask(task)).pipe(
          map((idTask) => TasksActions.addTaskSuccess({ idTask })),
          catchError((error) => of(TasksActions.addTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      switchMap(({ task }) =>
        from(this.tasksService.updateTask(task)).pipe(
          map(() => TasksActions.updateTaskSuccess({ task })),
          catchError((error) => of(TasksActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );
}
