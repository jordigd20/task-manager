import { createAction, props } from '@ngrx/store';
import { Board } from '../../../core/models/board.interface';
import { TaskSections } from '../tasks';

export const loadBoards = createAction('[Boards List] Load Boards');

export const loadBoardsSuccess = createAction(
  '[Boards List] Boards Load Success',
  props<{ boards: Board[] }>()
);

export const loadBoardsFailure = createAction(
  '[Boards List] Boards Load Failure',
  props<{ error: string }>()
);

export const openBoardForm = createAction('[Boards List] Open Board Form');

export const addBoard = createAction('[Boards List] Add Board', props<{ board: Board }>());

export const addBoardSuccess = createAction(
  '[Boards List] Add Board Success',
  props<{ id: number }>()
);

export const addBoardFailure = createAction(
  '[Boards List] Add Board Failure',
  props<{ error: string }>()
);

export const updateBoard = createAction('[Boards List] Update Board', props<{ board: Board }>());

export const updateBoardSuccess = createAction('[Boards List] Update Board Success');

export const updateBoardFailure = createAction(
  '[Boards List] Update Board Failure',
  props<{ error: string }>()
);

export const deleteBoard = createAction('[Boards List] Delete Board', props<{ id: number }>());

export const deleteBoardSuccess = createAction(
  '[Boards List] Delete Board Success',
  props<{ id: number }>()
);

export const deleteBoardFailure = createAction(
  '[Boards List] Delete Board Failure',
  props<{ error: string }>()
);

export const reorderTaskSections = createAction(
  '[Boards Details] Reorder Task Sections',
  props<{ idBoard: number; sections: (keyof TaskSections)[] }>()
);

export const reorderTaskSectionsSuccess = createAction(
  '[Boards Details] Reorder Task Sections Success',
  props<{ sections: (keyof TaskSections)[] }>()
);

export const reorderTaskSectionsFailure = createAction(
  '[Boards Details] Reorder Task Sections Failure',
  props<{ error: string }>()
);
