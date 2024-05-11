import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast = inject(ToastrService);

  constructor() {}

  showSuccessToast(message: string) {
    this.toast.success(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground font-medium border border-border rounded-md shadow-[0_0_2px_0_var(--muted)] dark:shadow-[0_0_2px_1px_var(--muted)] p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: false
    });
  }

  showErrorToast(message: string) {
    this.toast.error(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground font-medium border border-border rounded-md shadow-[0_0_2px_0_var(--muted)] dark:shadow-[0_0_2px_1px_var(--muted)] p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: true
    });
  }

  showWarningToast(message: string) {
    this.toast.warning(message, '', {
      toastClass:
        'relative overflow-hidden w-80 bg-background text-foreground font-medium border border-border rounded-md shadow-[0_0_2px_0_var(--muted)] dark:shadow-[0_0_2px_1px_var(--muted)] p-4 pl-12 m-3 bg-no-repeat bg-[length:24px] bg-[15px_center] pointer-events-auto',
      positionClass: 'toast-bottom-right',
      tapToDismiss: false
    });
  }
}
