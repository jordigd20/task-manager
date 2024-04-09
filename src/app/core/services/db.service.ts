import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Board, Colors, IconType } from '../models/board.interface';
import { Task } from '../models/task.interface';

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
    // const defaultBoard = await this.boards.add({
    //   name: 'Default Board',
    //   icon: IconType.Tools,
    //   color: Colors.Blue,
    //   tags: [{ id: 'concept', name: 'Concept', color: 'red'}],
    //  tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
    //   createdAt: new Date(),
    // });

    // await this.tasks.add({
    //   boardId: defaultBoard,
    //   title: 'Default Task',
    //   status: TaskStatus.Backlog,
    //   tags: [{ id: 'concept', name: 'Concept', color: 'red'}],
    //   image: '',
    //   createdAt: new Date(),
    // });

    //FIXME: Just for testing, delete later
    const boardProperties = [
      { color: Colors.Pink, icon: IconType.Gear },
      { color: Colors.Orange, icon: IconType.Rocket },
      { color: Colors.Yellow, icon: IconType.Key },
      { color: Colors.Green, icon: IconType.Clock },
      { color: Colors.Blue, icon: IconType.Computer },
      { color: Colors.Purple, icon: IconType.Eyes },
      { color: Colors.Red, icon: IconType.Food },
      { color: Colors.Pink, icon: IconType.Airplane },
      { color: Colors.Orange, icon: IconType.Star },
      { color: Colors.Yellow, icon: IconType.Books },
      { color: Colors.Green, icon: IconType.Artist },
      { color: Colors.Blue, icon: IconType.Helmet },
      { color: Colors.Purple, icon: IconType.Tools },
      { color: Colors.Red, icon: IconType.Gear },
      { color: Colors.Pink, icon: IconType.Rocket },
      { color: Colors.Orange, icon: IconType.Key },
      { color: Colors.Yellow, icon: IconType.Clock },
      { color: Colors.Green, icon: IconType.Computer },
      { color: Colors.Blue, icon: IconType.Eyes },
      { color: Colors.Purple, icon: IconType.Food },
      { color: Colors.Red, icon: IconType.Airplane },
      { color: Colors.Pink, icon: IconType.Star },
      { color: Colors.Orange, icon: IconType.Books },
      { color: Colors.Yellow, icon: IconType.Artist }
    ];

    const defaultProperties = {
      color: Colors.Blue,
      icon: IconType.Tools,
      tags: [{ id: 'concept', name: 'Concept', color: 'red' }]
    };

    const boards: Board[] = [
      {
        name: `Default Board`,
        color: Colors.Blue,
        icon: IconType.Tools,
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        tags: [{ id: 'concept', name: 'Concept', color: 'red' }],
        createdAt: new Date()
      }
    ];

    for (let i = 0; i < 4; i++) {
      const properties = boardProperties[i] || defaultProperties;
      boards.push({
        name: `Board ${i + 1}`,
        ...properties,
        tasksOrder: ['backlog', 'in-progress', 'in-review', 'completed'],
        tags: [{ id: 'concept', name: 'Concept', color: 'red' }],
        createdAt: new Date()
      });
    }

    await this.boards.bulkAdd(boards);

    const tasks: Task[] = [];

    for (let i = 0; i < boards.length; i++) {
      tasks.push({
        boardId: i + 1,
        title: 'Default Task',
        status: 'backlog',
        index: 0,
        tags: [{ id: 'concept', name: 'Concept', color: 'red' }],
        image:
          'https://images.unsplash.com/photo-1704318847747-1b3fc0e645ba?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        createdAt: new Date()
      });

      const min = 1;
      const max = 6;
      let randomCount = Math.random() * (max - min) + min;

      for (let j = 0; j < randomCount; j++) {
        tasks.push({
          boardId: i + 1,
          title: `Backlog ${j + 1}`,
          index: j + 1,
          status: 'backlog',
          tags: [],
          image: '',
          createdAt: new Date()
        });
      }

      randomCount = Math.random() * (max - min) + min;

      for (let j = 0; j < randomCount; j++) {
        tasks.push({
          boardId: i + 1,
          title: `Progress ${j + 1}`,
          index: j,
          status: 'in-progress',
          tags: [],
          image: '',
          createdAt: new Date()
        });
      }
    }

    await this.tasks.bulkAdd(tasks);
  }
}
