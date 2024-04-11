import { createAction, props } from '@ngrx/store';
import { Task } from '../../../core/models/task.interface';
import { TaskSections } from './tasks.reducer';
import { Board } from '../../../core/models/board.interface';

export const getActiveBoard = createAction(
  '[Board Details] Get Active Board',
  props<{ id: number }>()
);

export const getActiveBoardSuccess = createAction(
  '[Board Details] Get Active Board Success',
  props<{ board: Board; tasks: TaskSections }>()
);

export const getActiveBoardFailure = createAction(
  '[Board Details] Get Active Board Failure',
  props<{ error: string }>()
);

export const reorderTask = createAction(
  '[Board Details] Reorder Task',
  props<{
    tasks: Task[];
    status: keyof TaskSections;
    fromIndex: number;
    toIndex: number;
  }>()
);

export const reorderTaskSuccess = createAction(
  '[Board Details] Reorder Task Success',
  props<{
    tasks: Task[];
    status: keyof TaskSections;
  }>()
);

export const reorderTaskFailure = createAction(
  '[Board Details] Reorder Task Failure',
  props<{ error: string }>()
);

export const transferTask = createAction(
  '[Board Details] Transfer Task',
  props<{
    previousSectionTasks: Task[];
    targetSectionTasks: Task[];
    previousSection: keyof TaskSections;
    targetSection: keyof TaskSections;
  }>()
);

export const transferTaskSuccess = createAction(
  '[Board Details] Transfer Task Success',
  props<{
    previousSectionTasks: Task[];
    targetSectionTasks: Task[];
    previousSection: keyof TaskSections;
    targetSection: keyof TaskSections;
  }>()
);

export const transferTaskFailure = createAction(
  '[Board Details] Transfer Task Failure',
  props<{ error: string }>()
);
