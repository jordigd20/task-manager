import { createAction, props } from '@ngrx/store';
import { Tag, Task } from '../../../core/models/task.interface';
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

export const reorderBoardSections = createAction(
  '[Board Details] Reorder Board Sections',
  props<{ sections: (keyof TaskSections)[] }>()
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

export const openTaskForm = createAction('[Board Details] Open Task Form');

export const updateBoardTags = createAction(
  '[Board Details] Update Board Tags',
  props<{ board: Board }>()
);

export const updateBoardTagsSuccess = createAction(
  '[Board Details] Update Board Tags Success',
  props<{ tags: Tag[] }>()
);

export const updateBoardTagsFailure = createAction(
  '[Board Details] Update Board Tags Failure',
  props<{ error: string }>()
);

export const addTask = createAction('[Board Details] Add Task', props<{ task: Task }>());

export const addTaskSuccess = createAction(
  '[Board Details] Add Task Success',
  props<{ idTask: number }>()
);

export const addTaskFailure = createAction(
  '[Board Details] Add Task Failure',
  props<{ error: string }>()
);

export const updateTask = createAction('[Board Details] Update Task', props<{ task: Task }>());

export const updateTaskSuccess = createAction(
  '[Board Details] Update Task Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Board Details] Update Task Failure',
  props<{ error: string }>()
);
