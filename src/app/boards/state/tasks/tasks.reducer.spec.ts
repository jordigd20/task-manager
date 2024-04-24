import { TasksActions } from '.';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { Task } from '../../../core/models/task.interface';
import { TaskSections, TaskState, initialState, tasksReducer } from './tasks.reducer';

describe('TasksReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };

      const state = tasksReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('Get Active Board', () => {
    it('[Get Active Board] should set status to loading', () => {
      const action = TasksActions.getActiveBoard({ id: 1 });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'loading'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Get Active Board Success] should set the the active board and the tasks from the board', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockTasks: Task[] = [
        {
          id: 1,
          boardId: 1,
          index: 0,
          title: 'Default Task',
          status: 'backlog',
          tags: [],
          image: '',
          createdAt: new Date()
        }
      ];

      const taskState: TaskSections = {
        backlog: [mockTasks[0]],
        'in-progress': [],
        'in-review': [],
        completed: []
      };

      const action = TasksActions.getActiveBoardSuccess({
        board: mockBoard,
        tasks: taskState
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        activeBoard: mockBoard,
        tasks: taskState,
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Get Active Board Failure] should set the status to failure', () => {
      const action = TasksActions.getActiveBoardFailure({
        error: 'Error getting board'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error getting board'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Reorder Board Sections', () => {
    it('[Reorder Board Sections] should reorder the sections of the active board', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };

      const mockState: TaskState = {
        ...initialState,
        activeBoard: mockBoard
      };

      const action = TasksActions.reorderBoardSections({
        sections: ['in-progress', 'backlog', 'in-review', 'completed']
      });
      const state = tasksReducer(mockState, action);

      const newBoard: Board = {
        ...mockBoard,
        tasksOrder: ['in-progress', 'backlog', 'in-review', 'completed']
      };

      const newState: TaskState = {
        ...mockState,
        activeBoard: newBoard
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockState);
    });

    it('[Reorder Board Sections] should not reorder the sections if the active board is null', () => {
      const action = TasksActions.reorderBoardSections({
        sections: ['in-progress', 'backlog', 'in-review', 'completed']
      });
      const state = tasksReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('Reorder Task', () => {
    it('[Reorder Task Success] should reorder the tasks in the specified section', () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          boardId: 1,
          index: 0,
          title: 'Default Task',
          status: 'backlog',
          tags: [],
          image: '',
          createdAt: new Date()
        }
      ];

      const mockState: TaskState = {
        ...initialState,
        tasks: {
          backlog: [mockTasks[0]],
          'in-progress': [],
          'in-review': [],
          completed: []
        }
      };

      const action = TasksActions.reorderTaskSuccess({
        tasks: [],
        status: 'backlog'
      });
      const state = tasksReducer(mockState, action);

      const newState: TaskState = {
        ...mockState,
        tasks: {
          backlog: [],
          'in-progress': [],
          'in-review': [],
          completed: []
        },
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockState);
    });

    it('[Reorder Task Failure] should set the status to failure', () => {
      const action = TasksActions.reorderTaskFailure({
        error: 'Error reordering tasks'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error reordering tasks'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Transfer Task', () => {
    it('[Transfer Task Success] should transfer the task to the target section', () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          boardId: 1,
          index: 0,
          title: 'Default Task',
          status: 'backlog',
          tags: [],
          image: '',
          createdAt: new Date()
        }
      ];

      const mockState: TaskState = {
        ...initialState,
        tasks: {
          backlog: [mockTasks[0]],
          'in-progress': [],
          'in-review': [],
          completed: []
        }
      };

      const action = TasksActions.transferTaskSuccess({
        previousSectionTasks: [],
        targetSectionTasks: [mockTasks[0]],
        previousSection: 'backlog',
        targetSection: 'in-progress'
      });

      const state = tasksReducer(mockState, action);

      const newTask: Task = { ...mockTasks[0] };
      newTask.status = 'in-progress';

      const newState: TaskState = {
        ...mockState,
        tasks: {
          backlog: [],
          'in-progress': [newTask],
          'in-review': [],
          completed: []
        },
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockState);
    });

    it('[Transfer Task Failure] should set the status to failure', () => {
      const action = TasksActions.transferTaskFailure({
        error: 'Error transferring task'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error transferring task'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Open Task Form', () => {
    it('[Open Task Form] should set the task form open', () => {
      const action = TasksActions.openTaskForm();
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        isTaskFormOpen: true
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Update Board Tags', () => {
    it('[Update Board Tags Success] should update the tags of the active board', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };
      const tags = [
        {
          id: `${Date.now()}`,
          name: 'Tag 1',
          color: 'blue'
        }
      ];

      const action = TasksActions.updateBoardTagsSuccess({
        tags
      });

      const mockState = {
        ...initialState,
        activeBoard: mockBoard
      };
      const state = tasksReducer(mockState, action);

      const newState: TaskState = {
        ...mockState,
        activeBoard: {
          ...mockBoard,
          tags
        },
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Update Board Tags Failure] should set the status to failure', () => {
      const action = TasksActions.updateBoardTagsFailure({
        error: 'Error updating board tags'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error updating board tags'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
