import { Injectable, inject } from '@angular/core';
import { DbService } from './db.service';
import { PromiseExtended, liveQuery } from 'dexie';
import { Board } from '../models/board.interface';
import { TasksService } from './tasks.service';
import { TaskSections } from '../../boards/state/tasks';
import { Tag } from '../models/task.interface';
import { sampleImageIds } from '../../shared/utils/images';
import { UploadService } from './upload.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private db = inject(DbService);
  private tasksService = inject(TasksService);
  private uploadService = inject(UploadService);

  constructor() {}

  getBoards() {
    return liveQuery(() => this.db.boards.toArray());
  }

  async getBoardById(id: number) {
    const board = await this.db.boards.get(id);

    if (board == null) {
      throw new Error('Board not found');
    }

    const tasks = await this.tasksService.getTasksByBoard(id);

    return { board, tasks };
  }

  async addBoard(board: Board) {
    const idBoard = await this.db.boards.add(board);

    await this.db.tasks.add({
      boardId: idBoard,
      title: 'Default Task',
      status: 'backlog',
      index: 0,
      tags: [],
      image: { url: '', publicId: '' },
      createdAt: new Date()
    });

    return idBoard;
  }

  async updateBoard(board: Board) {
    if (board.id == null) {
      throw new Error('Board id is required');
    }

    return await this.db.boards.where('id').equals(board.id).modify(board);
  }

  async reorderTaskSections(idBoard: number, sections: (keyof TaskSections)[]) {
    return await this.db.boards.where('id').equals(idBoard).modify({ tasksOrder: sections });
  }

  async deleteBoard(id: number) {
    const tasks = await this.tasksService.getTasksByBoard(id);

    const tasksWithImage = tasks.filter(
      (task) => task.image.publicId !== '' && !sampleImageIds.includes(task.image.publicId)
    );

    for (const task of tasksWithImage) {
      await firstValueFrom(this.uploadService.deleteImage(task.image.publicId));
    }

    await this.tasksService.deleteTasksByBoard(id);

    return await this.db.boards.where('id').equals(id).delete();
  }

  async createTag(board: Board, tag: Tag) {
    if (board.id == null) {
      throw new Error('Board id is required');
    }

    await this.db.boards
      .where('id')
      .equals(board.id)
      .modify({ ...board, tags: [...board.tags, tag] });

    return tag;
  }

  async deleteTag(board: Board, tag: Tag) {
    if (board.id == null) {
      throw new Error('Board id is required');
    }

    await this.db.boards.where('id').equals(board.id).modify(board);

    const tasks = await this.tasksService.getTasksByBoard(board.id);
    const modifyTasks: PromiseExtended<number>[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      if (task.tags.some((t) => t.id === tag.id)) {
        modifyTasks.push(
          this.db.tasks
            .where('id')
            .equals(task.id!)
            .modify({ ...task, tags: task.tags.filter((t) => t.id !== tag.id) })
        );
      }
    }

    return await this.db.transaction('rw', this.db.tasks, async () => {
      return await Promise.all(modifyTasks);
    });
  }
}
