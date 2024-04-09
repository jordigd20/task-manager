export interface Task {
  id?: number;
  boardId: number;
  index: number;
  title: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'completed';
  tags: Tag[];
  image: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
