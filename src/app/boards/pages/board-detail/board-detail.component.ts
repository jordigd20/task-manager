import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'board-detail',
  standalone: true,
  templateUrl: './board-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full bg-background-elevated rounded-lg p-4',
  },
})
export class BoardDetailComponent {}
