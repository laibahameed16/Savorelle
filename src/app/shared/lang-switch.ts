import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { I18n, LANGS, Lang, T } from '../core/i18n';
import { Icon } from './icon';

@Component({
  selector: 'app-lang-switch',
  imports: [Icon, T],
  template: `
    <div class="relative">
      <button type="button" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-haspopup="listbox" [attr.aria-label]="'Language' | t"
        class="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium transition hover:border-brand hover:text-brand active:scale-95 sm:h-10"
        [class.border-brand]="open()">
        <app-icon name="globe" [size]="16"/><span>{{ current().short }}</span>
        <span class="transition-transform duration-300" [class.rotate-180]="open()"><app-icon name="down" [size]="14"/></span>
      </button>
      <ul role="listbox" class="absolute end-0 top-full z-50 mt-2 w-40 origin-top overflow-hidden rounded-2xl border border-line bg-card p-1.5 shadow-2xl transition duration-200"
        [class]="open() ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'">
        @for (l of langs; track l.code; let i = $index) {
          <li role="option" [attr.aria-selected]="l.code === i18n.lang()">
            <button type="button" (click)="pick(l.code)" class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-brand/15 hover:text-brand"
              [class]="l.code === i18n.lang() ? 'bg-brand/15 text-brand' : ''" [style.transition-delay]="open() ? i * 40 + 'ms' : '0ms'">
              <span>{{ l.label }}</span>
              @if (l.code === i18n.lang()) { <app-icon name="check" [size]="14" [stroke]="2.5"/> }
            </button>
          </li>
        }
      </ul>
    </div>`,
  host: { class: 'inline-block' },
})
export class LangSwitch {
  i18n = inject(I18n);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  langs = LANGS;
  open = signal(false);
  current = () => LANGS.find(l => l.code === this.i18n.lang())!;
  pick(l: Lang) { this.i18n.set(l); this.open.set(false); }
  @HostListener('document:click', ['$event']) away(e: Event) { if (this.open() && !this.host.nativeElement.contains(e.target as Node)) this.open.set(false); }
  @HostListener('document:keydown.escape') esc() { this.open.set(false); }
}
