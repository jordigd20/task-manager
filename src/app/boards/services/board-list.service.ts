import { Injectable, inject } from '@angular/core';
import { DbService } from '../../core/services/db.service';
import { liveQuery } from 'dexie';
import { Board } from '../../core/models/board.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardListService {
  private db = inject(DbService);

  constructor() {}

  getBoards() {
    return liveQuery(() => this.db.boards.toArray());
  }

  async addBoard(board: Board) {
    return await this.db.boards.add(board);
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
