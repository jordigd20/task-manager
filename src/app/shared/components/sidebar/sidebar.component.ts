import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Renderer2,
  inject,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BoardsActions, BoardsSelectors } from '../../../boards/state';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'w-full max-h-screen py-4 px-0 xl:px-4  overflow-y-hidden overflow-x-hidden ',
  },
})
export class SidebarComponent implements OnInit {
  renderer = inject(Renderer2);
  store = inject(Store);

  isDarkMode = signal<boolean>(
    document.documentElement.classList.contains('dark')
  );
  boards = toSignal(this.store.select(BoardsSelectors.boards));
  boardStatus = toSignal(this.store.select(BoardsSelectors.boardStatus));

  ngOnInit() {
    this.store.dispatch(BoardsActions.loadBoards());
  }

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
