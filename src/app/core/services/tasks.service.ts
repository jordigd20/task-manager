import { Injectable, inject } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private db = inject(DbService);

  constructor() {}

  async getTasksByBoard(idBoard: number) {
    return await this.db.tasks.where('boardId').equals(idBoard).toArray();
  }
}
