import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Board } from '../../../core/models/board.interface';

@Component({
  selector: 'board-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './board-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCardComponent {
  @Input({ required: true }) board!: Board;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
