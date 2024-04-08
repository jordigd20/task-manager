import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '../../../core/models/task.interface';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block bg-[#fafafa] dark:bg-background rounded-lg hover:bg-white dark:hover:bg-[#131316] transition-[background-color] shadow-sm'
  }
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
}
