import { BoardsState } from "../../boards/state";
import { TaskState } from "../../boards/state/tasks";

export interface AppState {
  boardsState: BoardsState;
  tasksState: TaskState;
}
