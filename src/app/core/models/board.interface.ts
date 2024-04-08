import { Tag } from './task.interface';

export interface Board {
  id?: number;
  name: string;
  icon: IconType;
  color: string;
  tags: Tag[];
  tasksOrder: ('backlog' | 'in-progress' | 'in-review' | 'completed')[];
  createdAt: Date;
}

export enum IconType {
  Tools = 'tools',
  Gear = 'gear',
  Rocket = 'rocket',
  Key = 'key',
  Clock = 'clock',
  Computer = 'computer',
  Eyes = 'eyes',
  Food = 'food',
  Airplane = 'airplane',
  Star = 'star',
  Books = 'books',
  Artist = 'artist',
  Helmet = 'helmet'
}

export enum Colors {
  Pink = '#f6cccb',
  Orange = '#f8d8b0',
  Yellow = '#f9f1a5',
  Green = '#c7f5d3',
  Blue = '#c4dafb',
  Purple = '#e6d6fc',
  Red = '#f9c1c1'
}
