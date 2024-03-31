import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'board-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './board-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCardComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) color!: string;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
