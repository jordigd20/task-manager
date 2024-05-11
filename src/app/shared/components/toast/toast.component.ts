import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from 'ngx-toastr';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations: [
    trigger('flyInOut', [
      state(
        'inactive',
        style({
          opacity: 0,
        })
      ),
      transition(
        'inactive => active',
        animate(
          '500ms cubic-bezier(0.6, 0.6, 0, 1)',
          keyframes([
            style({
              opacity: 0,
              transform: 'translateY(1000px)',
            }),
            style({
              opacity: 1,
              transform: 'translateY(0)',
            }),
          ])
        )
      ),
      transition(
        'active => removed',
        animate(
          '1000ms cubic-bezier(0.6, 0.6, 0, 1)',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateY(0)',
            }),
            style({
              transform: 'translateY(500px)',
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class ToastComponent extends Toast {
  action(event: Event) {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }
}
