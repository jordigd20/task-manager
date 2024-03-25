import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon1Component } from './icon-1.component';

describe('Icon1Component', () => {
  let component: Icon1Component;
  let fixture: ComponentFixture<Icon1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Icon1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
