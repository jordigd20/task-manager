import { Component, NgZone, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  store = inject(Store);
  ngZone = inject(NgZone);

  constructor() {}

  ngOnInit() {
    // @ts-ignore
    if (window.Cypress) {
      // @ts-ignore
      window.store = this.store;
      // @ts-ignore
      window.ngZone = this.ngZone;
    }
  }
}
