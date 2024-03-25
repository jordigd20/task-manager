import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'icon-1',
  standalone: true,
  imports: [],
  templateUrl: './icon-1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon1Component {
  @Input() width: number = 32;
  @Input() height: number = 32;
  @Input() iconColor: string = '#f8d8b0';
}
