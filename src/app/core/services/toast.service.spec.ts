import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { ToastrService } from 'ngx-toastr';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: ToastrService,
        useValue: {
          success: jest.fn(),
          error: jest.fn(),
          warning: jest.fn()
        }
      }]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
