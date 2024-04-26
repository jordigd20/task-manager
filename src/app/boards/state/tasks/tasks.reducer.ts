import { createReducer, on } from '@ngrx/store';
import { Task } from '../../../core/models/task.interface';
import { TasksActions } from '.';
import { Board } from '../../../core/models/board.interface';

export interface TaskState {
  activeBoard: Board | null;
  tasks: TaskSections;
  status: 'pending' | 'loading' | 'success' | 'failure';
  error: string | null;
  isTaskFormOpen: boolean;
}

export interface TaskSections {
  backlog: Task[];
  'in-progress': Task[];
  'in-review': Task[];
  completed: Task[];
}

export const initialState: TaskState = {
  activeBoard: null,
  tasks: {
    backlog: [],
    'in-progress': [],
    'in-review': [],
    completed: []
  },
  status: 'pending',
  error: null,
  isTaskFormOpen: false
};

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.getActiveBoard, (state) => ({
    ...state,
    status: 'loading' as 'loading'
  })),
  on(TasksActions.getActiveBoardSuccess, (state, { board, tasks }) => ({
    ...state,
    activeBoard: board,
    tasks,
    status: 'success' as 'success',
    error: null
  })),
  on(TasksActions.getActiveBoardFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error
  })),
  on(TasksActions.reorderBoardSections, (state, { sections }) => {
    if (state.activeBoard == null) {
      return { ...state };
    }

    return {
      ...state,
      activeBoard: {
        ...state.activeBoard,
        tasksOrder: sections
      }
    };
  }),
  on(TasksActions.reorderTaskSuccess, (state, { tasks, status }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [status]: tasks
    },
    status: 'success' as 'success'
  })),
  on(TasksActions.reorderTaskFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error
  })),
  on(
    TasksActions.transferTaskSuccess,
    (state, { previousSectionTasks, targetSectionTasks, previousSection, targetSection }) => ({
      ...state,
      tasks: {
        ...state.tasks,
        [previousSection]: previousSectionTasks.map((task) => ({
          ...task,
          status: previousSection
        })),
        [targetSection]: targetSectionTasks.map((task) => ({
          ...task,
          status: targetSection
        }))
      },
      status: 'success' as 'success'
    })
  ),
  on(TasksActions.transferTaskFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error
  })),
  on(TasksActions.openTaskForm, (state) => ({
    ...state,
    isTaskFormOpen: true
  })),
  on(TasksActions.updateBoardTags, (state) => ({
    ...state,
    status: 'loading' as 'loading'
  })),
  on(TasksActions.updateBoardTagsSuccess, (state, { tags }) => ({
    ...state,
    status: 'success' as 'success',
    activeBoard: {
      ...state.activeBoard!,
      tags
    }
  })),
  on(TasksActions.updateBoardTagsFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error
  })),
  on(TasksActions.addTask, (state, { task }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      backlog: [...state.tasks.backlog, task]
    },
    status: 'loading' as 'loading'
  })),
  on(TasksActions.addTaskSuccess, (state, { idTask }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      backlog: state.tasks.backlog.map((task) => (task.id == null ? { ...task, id: idTask } : task))
    },
    status: 'success' as 'success',
    isTaskFormOpen: false
  })),
  on(TasksActions.addTaskFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error,
    isTaskFormOpen: false
  })),
  on(TasksActions.updateTask, (state) => ({
    ...state,
    status: 'loading' as 'loading'
  })),
  on(TasksActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [task.status]: state.tasks[task.status].map((t) => (t.id === task.id ? task : t))
    },
    status: 'success' as 'success',
    isTaskFormOpen: false
  })),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    status: 'failure' as 'failure',
    error,
    isTaskFormOpen: false
  }))
);
