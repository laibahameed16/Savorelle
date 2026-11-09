import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { I18n, T } from '../core/i18n';
import { Icon } from './icon';

@Component({
  selector: 'app-carousel',
  imports: [Icon, T],
  template: `
    <div #track class="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 py-4 md:mx-0 md:px-0">
      <ng-content />
    </div>
    <div class="mt-4 flex items-center justify-between text-fg/70">
      <button class="grid size-11 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand active:scale-90 rtl:rotate-180" [attr.aria-label]="'Previous' | t" (click)="go(-1)"><app-icon name="left"/></button>
      <button class="grid size-11 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand active:scale-90 rtl:rotate-180" [attr.aria-label]="'Next' | t" (click)="go(1)"><app-icon name="right"/></button>
    </div>`,
  host: { class: 'block' },
})
export class Carousel {
  private track = viewChild.required<ElementRef<HTMLElement>>('track');
  private i18n = inject(I18n);
  go(dir: number) {
    const t = this.track().nativeElement;
    const card = t.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? t.clientWidth) + 20;
    const sign = this.i18n.rtl() ? -1 : 1;           // RTL scrollers use negative scrollLeft
    const pos = Math.abs(t.scrollLeft), max = t.scrollWidth - t.clientWidth;
    if (dir > 0 && pos >= max - 8) t.scrollTo({ left: 0 });
    else if (dir < 0 && pos <= 8) t.scrollTo({ left: sign * max });
    else t.scrollBy({ left: dir * step * sign });
  }
}
