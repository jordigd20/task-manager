import { Injectable, inject } from '@angular/core';
import { DbService } from '../../core/services/db.service';
import { liveQuery } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class BoardListService {
  private db = inject(DbService);

  constructor() {}

  getBoards() {
    return liveQuery(() => this.db.boards.toArray());
  }
}
