import { Component, inject } from '@angular/core';
import { ToastService } from '../core/services';
import { Icon } from './icon';

import { T } from '../core/i18n';
@Component({
  selector: 'app-toasts',
  imports: [Icon, T],
  template: `
    <div class="pointer-events-none fixed bottom-4 end-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="pointer-events-auto flex animate-pop items-center gap-3 rounded-2xl border border-line bg-card-2/95 p-3 pe-4 text-sm shadow-2xl backdrop-blur">
          <span class="grid size-7 shrink-0 place-items-center rounded-full bg-brand"><app-icon name="check" [size]="14" [stroke]="2.5"/></span>
          <span class="flex-1">{{ t.message }}</span>
          <button class="text-fg/50 hover:text-fg" [attr.aria-label]="'Dismiss' | t" (click)="toast.dismiss(t.id)"><app-icon name="close" [size]="16"/></button>
        </div>
      }
    </div>`,
})
export class Toasts { toast = inject(ToastService); }
