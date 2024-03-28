import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Board, Colors, IconType } from '../models/board.interface';
import { Task, TaskStatus } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class DbService extends Dexie {
  boards!: Dexie.Table<Board, number>;
  tasks!: Dexie.Table<Task, number>;

  constructor() {
    super('TaskManagerDB');

    this.version(1).stores({
      boards: '++id',
      tasks: '++id, boardId',
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
    //   tags: ['Concept'],
    //   createdAt: new Date(),
    // });

    // await this.tasks.add({
    //   boardId: defaultBoard,
    //   title: 'Default Task',
    //   status: TaskStatus.Backlog,
    //   tags: ['Concept'],
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
      { color: Colors.Yellow, icon: IconType.Artist },
    ];

    const defaultProperties = {
      color: Colors.Blue,
      icon: IconType.Tools,
      tags: ['Concept'],
    };

    const boards: Board[] = [{
      name: `Id laborum anim consectetur aliquip enim cupidatat nulla.`,
      color: Colors.Blue,
      icon: IconType.Tools,
      tags: ['Concept'],
      createdAt: new Date(),
    }];

    for (let i = 0; i < 24; i++) {
      const properties = boardProperties[i] || defaultProperties;
      boards.push({
        name: `Id laborum anim consectetur aliquip enim cupidatat nulla. ${i + 1}`,
        ...properties,
        tags: ['Concept'],
        createdAt: new Date(),
      });
    }

    await this.boards.bulkAdd(boards);
  }
}
