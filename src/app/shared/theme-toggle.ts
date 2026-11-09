import { Component, inject } from '@angular/core';
import { T } from '../core/i18n';
import { ThemeService } from '../core/theme';
import { Icon } from './icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon, T],
  template: `
    <button type="button" (click)="theme.toggle($event)" class="group relative grid size-9 place-items-center overflow-hidden rounded-full border border-line transition hover:border-brand hover:text-brand active:scale-90 sm:size-10"
      [attr.aria-label]="(theme.mode() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') | t" [attr.aria-pressed]="theme.mode() === 'light'">
      <span class="absolute inset-0 grid place-items-center transition-all duration-500 ease-out" [class]="theme.mode() === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'"><app-icon name="moon" [size]="18"/></span>
      <span class="absolute inset-0 grid place-items-center text-amber-500 transition-all duration-500 ease-out" [class]="theme.mode() === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'"><app-icon name="sun" [size]="18"/></span>
    </button>`,
  host: { class: 'inline-block' },
})
export class ThemeToggle { theme = inject(ThemeService); }
