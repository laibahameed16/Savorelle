import { Injectable } from '@angular/core';

/**
 * Smooth, inertial mouse-wheel scrolling (like Lenis, ~60 lines, no dependency).
 * - only mouse wheels are smoothed; trackpads / touch keep their native (already smooth) scrolling
 * - skipped for reduced-motion, while a modal/menu locks the body, and when the pointer is over an inner scroller
 */
@Injectable({ providedIn: 'root' })
export class SmoothScroll {
  private target = 0;
  private current = 0;
  private raf = 0;
  private active = false;

  init() {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    this.sync();
    window.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    // keep in sync with scrolling done by other means (keyboard, scrollbar drag, router, anchors)
    window.addEventListener('scroll', () => {
      if (!this.active) this.sync();
      else if (Math.abs(window.scrollY - this.current) > 3) { cancelAnimationFrame(this.raf); this.active = false; this.sync(); } // moved by something else (router, keyboard, scrollbar)
    }, { passive: true });
    window.addEventListener('resize', () => this.sync(), { passive: true });
  }

  private max() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  private sync() { this.current = this.target = window.scrollY; }

  private isMouseWheel(e: WheelEvent) {
    if (e.deltaX !== 0 || e.ctrlKey) return false;
    if (e.deltaMode === 1) return true;                       // Firefox line mode
    const a = Math.abs(e.deltaY);
    return a >= 50 && (a % 100 === 0 || a % 120 === 0 || a % 53 === 0);   // notched wheel steps
  }

  private scrollableAncestor(el: EventTarget | null, dy: number): boolean {
    let n = el as HTMLElement | null;
    while (n && n !== document.body && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1) {
        if ((dy < 0 && n.scrollTop > 0) || (dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 1)) return true;
      }
      n = n.parentElement;
    }
    return false;
  }

  private onWheel(e: WheelEvent) {
    if (e.defaultPrevented || !this.isMouseWheel(e)) return;
    if (document.body.style.overflow === 'hidden' || this.scrollableAncestor(e.target, e.deltaY)) return;
    e.preventDefault();
    if (!this.active) this.sync();
    const dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
    this.target = Math.min(this.max(), Math.max(0, this.target + dy * 1.1));
    if (!this.active) { this.active = true; this.raf = requestAnimationFrame(() => this.tick()); }
  }

  private tick() {
    const diff = this.target - this.current;
    if (Math.abs(diff) < 0.4) {
      this.current = this.target;
      window.scrollTo({ top: this.current, behavior: 'instant' as ScrollBehavior });
      this.active = false;
      return;
    }
    this.current += diff * 0.14;                               // ease-out: fast start, soft landing
    window.scrollTo({ top: this.current, behavior: 'instant' as ScrollBehavior });
    this.raf = requestAnimationFrame(() => this.tick());
  }
}
