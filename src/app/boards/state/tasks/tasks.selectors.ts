import { createSelector } from '@ngrx/store';
import { AppState } from '../../../shared/state/app.state';

export const selectTasksState = (state: AppState) => state.tasksState;

export const activeBoard = createSelector(selectTasksState, (state) => state.activeBoard);
export const tasks = createSelector(selectTasksState, (state) => state.tasks);
export const taskStatus = createSelector(selectTasksState, (state) => state.status);
export const taskError = createSelector(selectTasksState, (state) => state.error);
export const isTaskFormOpen = createSelector(selectTasksState, (state) => state.isTaskFormOpen);
