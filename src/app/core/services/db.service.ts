import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Board, Colors, IconType } from '../models/board.interface';
import { Tag, Task } from '../models/task.interface';
import { sampleImageIds, sampleImageUrls } from '../../shared/utils/images';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  boards!: Dexie.Table<Board, number>;
  tasks!: Dexie.Table<Task, number>;

  constructor() {
    super('TaskManagerDB');

    this.version(1).stores({
      boards: '++id',
      tasks: '++id, boardId, index, status, [boardId+status+index]'
    });

    // Triggered the first time the database is created
    this.on('populate', () => this.populate());

    this.open().catch((err) => console.error(err.message));
  }

  async populate() {
    const tags: Tag[] = [
      { id: 'concept', name: 'Concept', color: 'red' },
      { id: 'technical', name: 'Techincal', color: 'purple' },
      { id: 'frontend', name: 'Frontend', color: 'blue' },
      { id: 'backend', name: 'Backend', color: 'yellow' },
      { id: 'design', name: 'Design', color: 'green' }
    ];

    const defaultBoard: Board = {
      name: `Default Board`,
      color: Colors.Blue,
      icon: IconType.Tools,
      tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
      createdAt: new Date(),
      tags
    };

    const boardId = await this.boards.add(defaultBoard);

    const tasks: Task[] = [
      {
        boardId,
        title: 'Implement Drag & Drop tasks',
        index: 0,
        status: 'backlog',
        tags: [tags[1], tags[2]],
        image: {
          url: sampleImageUrls[0],
          publicId: sampleImageIds[0]
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Deploy the REST API to the production server',
        index: 1,
        status: 'backlog',
        tags: [tags[1], tags[3]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Implement the ability for users to edit tasks',
        index: 0,
        status: 'in-progress',
        tags: [tags[1], tags[2]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Use NgRx for state management in the application',
        index: 1,
        status: 'in-progress',
        tags: [tags[1], tags[2]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Implement the REST API for uploading images to the server',
        index: 2,
        status: 'in-progress',
        tags: [tags[1], tags[3]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Implement the ability for users to switch between dark and light mode',
        index: 0,
        status: 'in-review',
        tags: [tags[1], tags[2]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Implement the ability to create/delete tasks using the the keyboard',
        index: 1,
        status: 'in-review',
        tags: [tags[1], tags[2]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Design the Task Manager App',
        index: 0,
        status: 'completed',
        tags: [tags[4]],
        image: {
          url: sampleImageUrls[1],
          publicId: sampleImageIds[1]
        },
        createdAt: new Date()
      },
      {
        boardId,
        title: 'Investigate about NgRx and how to use it',
        index: 1,
        status: 'completed',
        tags: [tags[0]],
        image: {
          url: '',
          publicId: ''
        },
        createdAt: new Date()
      }
    ];

    await this.tasks.bulkAdd(tasks);
  }
}
