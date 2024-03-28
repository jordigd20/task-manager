import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  inject,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'w-full max-h-screen py-4 px-0 lg:px-4  overflow-y-hidden overflow-x-hidden ',
  },
})
export class SidebarComponent {
  renderer = inject(Renderer2);

  isDarkMode = signal<boolean>(
    document.documentElement.classList.contains('dark')
  );

  toggleThemeMode() {
    this.isDarkMode() ? this.switchToLightMode() : this.switchToDarkMode();
  }

  switchToDarkMode() {
    this.isDarkMode.set(true);
    this.renderer.addClass(document.documentElement, 'dark');
  }

  switchToLightMode() {
    this.isDarkMode.set(false);
    this.renderer.removeClass(document.documentElement, 'dark');
  }
}
