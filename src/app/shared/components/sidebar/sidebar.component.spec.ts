import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import Dexie, { PromiseExtended } from 'dexie';
import { Board, Colors, IconType } from '../../../core/models/board.interface';
import { BoardsSelectors, BoardsState } from '../../../boards/state';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let renderer: Renderer2;
  let store: MockStore;
  let spyDbOpen: jest.SpyInstance<PromiseExtended<Dexie>>;

  const mockBoards: Board[] = [
    {
      id: 1,
      name: 'Default Board',
      icon: IconType.Key,
      color: Colors.Green,
      tags: ['Concept'],
      createdAt: new Date(),
    },
  ];

  const initialState: BoardsState = {
    boards: [],
    selectedBoard: null,
    status: 'pending',
    error: null,
  };

  beforeEach(async () => {
    spyDbOpen = jest
      .spyOn(Dexie.prototype, 'open')
      .mockResolvedValueOnce(new Dexie.Promise(() => {}));

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterLink, NgClass],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: Renderer2,
          useValue: {
            addClass: jest.fn(),
            removeClass: jest.fn(),
          },
        },
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: BoardsSelectors.boards,
              value: initialState.boards,
            },
            {
              selector: BoardsSelectors.boardStatus,
              value: initialState.status,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the boards', () => {
    expect(component.boards()).toEqual(initialState.boards);
    expect(component.boardStatus()).toEqual(initialState.status);

    store.overrideSelector(BoardsSelectors.boards, mockBoards);
    store.overrideSelector(BoardsSelectors.boardStatus, 'success');
    store.refreshState();
    fixture.detectChanges();

    expect(component.boards()).toEqual(mockBoards);
    expect(component.boardStatus()).toEqual('success');
  });

  it('should toggle the theme mode in mobile view', () => {
    const isDarkMode = component.isDarkMode();
    component.toggleThemeMode();

    expect(component.isDarkMode()).toEqual(!isDarkMode);
    expect(document.documentElement.classList.contains('dark')).toBe(
      !isDarkMode
    );
  });

  it('should switch to dark mode', () => {
    jest.spyOn(component.isDarkMode, 'set');
    component.switchToDarkMode();

    expect(component.isDarkMode.set).toHaveBeenCalledWith(true);
    expect(component.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should switch to light mode', () => {
    jest.spyOn(component.isDarkMode, 'set');
    component.switchToLightMode();

    expect(component.isDarkMode.set).toHaveBeenCalledWith(false);
    expect(component.isDarkMode()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
