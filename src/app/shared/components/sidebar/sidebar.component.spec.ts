import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import Dexie, { PromiseExtended } from 'dexie';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let renderer: Renderer2;
  let spyDbOpen: jest.SpyInstance<PromiseExtended<Dexie>>;

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
