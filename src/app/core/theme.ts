import { Injectable, signal } from '@angular/core';

export type Mode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<Mode>(this.initial());
  constructor() { this.apply(this.mode()); }

  private initial(): Mode {
    try { return localStorage.getItem('sv-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  }
  private apply(m: Mode) {
    const d = document.documentElement;
    d.classList.toggle('light', m === 'light');
    d.style.colorScheme = m;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', m === 'light' ? '#fbf7f1' : '#000000');
    try { localStorage.setItem('sv-theme', m); } catch { /* ignore */ }
  }

  /** Toggles the theme with a circular reveal from the click point when the browser supports it. */
  toggle(ev?: MouseEvent) {
    const next: Mode = this.mode() === 'dark' ? 'light' : 'dark';
    const run = () => { this.mode.set(next); this.apply(next); };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduced) {
      const el = (ev?.currentTarget as HTMLElement | null)?.getBoundingClientRect();
      const x = ev && ev.clientX ? ev.clientX : el ? el.left + el.width / 2 : window.innerWidth / 2;
      const y = ev && ev.clientY ? ev.clientY : el ? el.top + el.height / 2 : 0;
      document.documentElement.style.setProperty('--vt-x', x + 'px');
      document.documentElement.style.setProperty('--vt-y', y + 'px');
      doc.startViewTransition(run);
    } else run();
  }
}
