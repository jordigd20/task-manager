import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'board-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './board-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardLayoutComponent {}
