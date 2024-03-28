export interface Task {
  id?: number;
  boardId: number;
  title: string;
  status: TaskStatus;
  tags: string[];
  image: string;
  createdAt: Date;
}

export enum TaskStatus {
  Backlog = 'backlog',
  InProgress = 'in-progress',
  InReview = 'in-review',
  Completed = 'completed',
}
