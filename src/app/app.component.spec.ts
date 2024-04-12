import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialState } from './boards/state/boards/boards.reducer';

describe('AppComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    store = TestBed.inject(MockStore);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
