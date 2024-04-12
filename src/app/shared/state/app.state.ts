import { BoardsState } from "../../boards/state/boards";
import { TaskState } from "../../boards/state/tasks";

export interface AppState {
  boardsState: BoardsState;
  tasksState: TaskState;
}
