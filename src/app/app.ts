import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18n } from './core/i18n';
import { SmoothScroll } from './core/smooth-scroll';
import { ThemeService } from './core/theme';
import { Footer } from './shared/footer';
import { Navbar } from './shared/navbar';
import { Toasts } from './shared/toasts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toasts],
  template: `
    <div #bar class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand rtl:origin-right" style="transform:scaleX(0)"></div>
    <app-navbar />
    <main><router-outlet /></main>
    <app-footer />
    <app-toasts />
  `,
})
export class App {
  private bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  constructor() {
    inject(I18n); inject(ThemeService);
    const smooth = inject(SmoothScroll);
    afterNextRender(() => {
      smooth.init();
      // scroll progress bar: written straight to the DOM once per frame (no change detection on every scroll event)
      let queued = false;
      const paint = () => {
        queued = false;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        this.bar().nativeElement.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      };
      window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
      paint();
    });
  }
}
