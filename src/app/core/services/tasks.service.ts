import { Injectable, inject } from '@angular/core';
import { DbService } from './db.service';
import { Task } from '../models/task.interface';
import { PromiseExtended } from 'dexie';
import { TaskSections } from '../../boards/state/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private db = inject(DbService);

  constructor() {}

  async createTask(task: Task) {
    return await this.db.tasks.add(task);
  }

  async getTasksByBoard(idBoard: number) {
    return await this.db.tasks.where('boardId').equals(idBoard).sortBy('index');
  }

  async updateTask(task: Task) {
    if (task.id == null) {
      throw new Error('Task id is required');
    }

    await this.db.tasks.where('id').equals(task.id).modify(task);

    return task;
  }

  async reorderTasks({ tasks, status }: { tasks: Task[]; status: keyof TaskSections }) {
    const modifyTasks: PromiseExtended<number>[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      modifyTasks.push(
        this.db.tasks
          .where('id')
          .equals(task.id!)
          .modify({ ...task, index: i })
      );
    }

    await this.db.transaction('rw', this.db.tasks, async () => {
      return await Promise.all(modifyTasks);
    });

    return { status, tasks };
  }

  async transferTask({
    previousSectionTasks,
    targetSectionTasks,
    previousSection,
    targetSection
  }: {
    previousSectionTasks: Task[];
    targetSectionTasks: Task[];
    previousSection: keyof TaskSections;
    targetSection: keyof TaskSections;
  }) {
    const modifyTasks: PromiseExtended<number>[] = [];

    for (let i = 0; i < previousSectionTasks.length; i++) {
      const task = previousSectionTasks[i];

      modifyTasks.push(
        this.db.tasks
          .where('id')
          .equals(task.id!)
          .modify({ ...task, index: i, status: previousSection })
      );
    }

    for (let i = 0; i < targetSectionTasks.length; i++) {
      const task = targetSectionTasks[i];

      modifyTasks.push(
        this.db.tasks
          .where('id')
          .equals(task.id!)
          .modify({ ...task, index: i, status: targetSection })
      );
    }

    await this.db.transaction('rw', this.db.tasks, async () => {
      return await Promise.all(modifyTasks);
    });

    return {
      previousSectionTasks,
      targetSectionTasks,
      previousSection,
      targetSection
    };
  }

  async deleteTask(idTask: number) {
    if (idTask == null) {
      throw new Error('Task id is required');
    }

    return await this.db.tasks.where('id').equals(idTask).delete();
  }

  async deleteTasksByBoard(idBoard: number) {
    if (idBoard == null) {
      throw new Error('Board id is required');
    }

    return await this.db.tasks.where('boardId').equals(idBoard).delete();
  }
}
