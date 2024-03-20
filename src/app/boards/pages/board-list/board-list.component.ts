import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoardLayoutComponent } from '../board-layout/board-layout.component';

@Component({
  selector: 'board-list',
  standalone: true,
  imports: [BoardLayoutComponent],
  templateUrl: './board-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full bg-background-elevated rounded-lg p-4',
  },
})
export class BoardListComponent {}
