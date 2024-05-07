import { TasksActions } from '.';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { Tag, Task } from '../../../core/models/task.interface';
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
          image: { url: '', publicId: '' },
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
          image: { url: '', publicId: '' },
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
          image: { url: '', publicId: '' },
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

  describe('Create Tag', () => {
    it('[Create Tag Success] should update the tags of the active board', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };
      const tag: Tag = {
        id: `${Date.now()}`,
        name: 'Tag 1',
        color: 'blue'
      };
      const action = TasksActions.createTagSuccess({
        tag
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
          tags: [tag]
        },
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Update Board Tags Failure] should set the status to failure', () => {
      const action = TasksActions.createTagFailure({
        error: 'Error creating the tag'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error creating the tag'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Delete Tag', () => {
    it('[Delete Tag Success] should update the tags of the active board and the tasks', () => {
      const mockBoard: Board = {
        id: 1,
        name: 'New Board',
        icon: IconType.Eyes,
        color: Colors.Green,
        tags: [],
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        createdAt: new Date()
      };
      const idTag = `${Date.now()}`;
      const tag: Tag = {
        id: idTag,
        name: 'Tag 1',
        color: 'blue'
      };
      const action = TasksActions.deleteTagSuccess({
        tags: [],
        tag
      });

      const mockState: TaskState = {
        ...initialState,
        activeBoard: mockBoard,
        tasks: {
          backlog: [
            {
              id: 1,
              boardId: 1,
              index: 0,
              title: 'Default Task',
              status: 'backlog',
              tags: [tag],
              image: { url: '', publicId: '' },
              createdAt: new Date()
            }
          ],
          'in-progress': [],
          'in-review': [],
          completed: []
        }
      };
      const state = tasksReducer(mockState, action);

      const newState: TaskState = {
        ...mockState,
        activeBoard: {
          ...mockBoard,
          tags: []
        },
        tasks: {
          backlog: [
            {
              id: 1,
              boardId: 1,
              index: 0,
              title: 'Default Task',
              status: 'backlog',
              tags: [],
              image: { url: '', publicId: '' },
              createdAt: new Date()
            }
          ],
          'in-progress': [],
          'in-review': [],
          completed: []
        }
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Delete Tag Failure] should set the status to failure', () => {
      const action = TasksActions.deleteTagFailure({
        error: 'Error deleting the tag'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error deleting the tag'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Add Task', () => {
    it('[Add Task] should add a new task to the backlog section', () => {
      const mockTask: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      const action = TasksActions.addTask({
        task: mockTask
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        tasks: {
          backlog: [mockTask],
          'in-progress': [],
          'in-review': [],
          completed: []
        },
        status: 'loading'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Add Task Success] should update the id of the task and set the status to success', () => {
      const mockTask: Task = {
        id: undefined,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      const action = TasksActions.addTaskSuccess({ idTask: 1 });
      const state = tasksReducer(
        {
          ...initialState,
          tasks: {
            backlog: [mockTask],
            'in-progress': [],
            'in-review': [],
            completed: []
          }
        },
        action
      );

      const newTask: Task = {
        ...mockTask,
        id: 1
      };

      const newState: TaskState = {
        ...initialState,
        tasks: {
          backlog: [newTask],
          'in-progress': [],
          'in-review': [],
          completed: []
        },
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Add Task Failure] should set the status to failure', () => {
      const action = TasksActions.addTaskFailure({
        error: 'Error adding task'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error adding task'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Update Task', () => {
    it('[Update Task] should set the status to loading', () => {
      const action = TasksActions.updateTask({} as any);
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'loading'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });

    it('[Update Task Success] should update the task in the specified section', () => {
      const mockTask: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      const mockState: TaskState = {
        ...initialState,
        tasks: {
          backlog: [mockTask],
          'in-progress': [],
          'in-review': [],
          completed: []
        }
      };

      const updatedTask: Task = {
        ...mockTask,
        title: 'Updated Task'
      };

      const action = TasksActions.updateTaskSuccess({
        task: updatedTask
      });
      const state = tasksReducer(mockState, action);

      const newState: TaskState = {
        ...mockState,
        tasks: {
          backlog: [updatedTask],
          'in-progress': [],
          'in-review': [],
          completed: []
        },
        status: 'success'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(mockState);
    });

    it('[Update Task Failure] should set the status to failure', () => {
      const action = TasksActions.updateTaskFailure({
        error: 'Error updating task'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error updating task'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });

  describe('Delete Task', () => {
    it('[Delete Task Success] should delete the task from the specified section', () => {
      const mockTask: Task = {
        id: 1,
        boardId: 1,
        index: 0,
        title: 'Default Task',
        status: 'backlog',
        tags: [],
        image: { url: '', publicId: '' },
        createdAt: new Date()
      };

      const mockState: TaskState = {
        ...initialState,
        tasks: {
          backlog: [mockTask],
          'in-progress': [],
          'in-review': [],
          completed: []
        }
      };

      const action = TasksActions.deleteTaskSuccess({
        task: mockTask
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

    it('[Delete Task Failure] should set the status to failure', () => {
      const action = TasksActions.deleteTaskFailure({
        error: 'Error deleting task'
      });
      const state = tasksReducer(initialState, action);

      const newState: TaskState = {
        ...initialState,
        status: 'failure',
        error: 'Error deleting task'
      };

      expect(state).toEqual(newState);
      expect(state).not.toBe(initialState);
    });
  });
});
