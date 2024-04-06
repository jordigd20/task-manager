import { Injectable, inject } from '@angular/core';
import { DbService } from './db.service';
import { liveQuery } from 'dexie';
import { Board } from '../models/board.interface';
import { TaskStatus } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private db = inject(DbService);

  constructor() {}

  getBoards() {
    return liveQuery(() => this.db.boards.toArray());
  }

  async getBoardById(id: number) {
    const board = await this.db.boards.get(id);

    if (board == null) {
      throw new Error('Board not found');
    }

    return board;
  }

  async addBoard(board: Board) {
    const idBoard = await this.db.boards.add(board);

    await this.db.tasks.add({
      boardId: idBoard,
      title: 'Default Task',
      status: TaskStatus.Backlog,
      tags: [],
      image: '',
      createdAt: new Date(),
    });

    return idBoard;
  }

  async updateBoard(board: Board) {
    if (board.id == null) {
      throw new Error('Board id is required');
    }

    return await this.db.boards.where('id').equals(board.id).modify(board);
  }

  async deleteBoard(id: number) {
    return await this.db.boards.where('id').equals(id).delete();
  }
}