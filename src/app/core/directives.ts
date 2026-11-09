import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/** Fades/slides an element in when it scrolls into view. */
@Directive({ selector: '[appReveal]' })
export class Reveal implements OnInit, OnDestroy {
  readonly appReveal = input<'' | 'up' | 'left' | 'right' | 'zoom'>('');
  readonly delay = input(0);
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;

  ngOnInit() {
    const c = this.el.classList;
    c.add('reveal');
    const dir = this.appReveal();
    if (dir === 'left') c.add('reveal-left');
    if (dir === 'right') c.add('reveal-right');
    if (dir === 'zoom') c.add('reveal-zoom');
    this.el.style.setProperty('--d', this.delay() + 'ms');
    if (typeof IntersectionObserver === 'undefined') { c.add('in'); return; }
    this.io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { c.add('in'); this.io?.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    this.io.observe(this.el);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}

/** Subtle 3D tilt that follows the pointer. */
@Directive({
  selector: '[appTilt]',
  host: { '(pointermove)': 'move($event)', '(pointerleave)': 'reset()' },
})
export class Tilt {
  readonly max = input(6);
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  move(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    const r = this.el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const m = this.max();
    this.el.style.transform = `perspective(900px) rotateX(${(-y * m).toFixed(2)}deg) rotateY(${(x * m).toFixed(2)}deg) translateY(-4px)`;
  }
  reset() { this.el.style.transform = ''; }
}

/** Counts a number up when it becomes visible. */
@Directive({ selector: '[appCountUp]' })
export class CountUp implements OnInit, OnDestroy {
  readonly appCountUp = input.required<number>();
  readonly suffix = input('');
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;
  ngOnInit() {
    this.el.textContent = '0' + this.suffix();
    this.io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      this.io?.disconnect();
      const end = this.appCountUp(); const t0 = performance.now(); const dur = 1600;
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        this.el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + this.suffix();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    this.io.observe(this.el);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}

/** Adds `is-off` while the element is outside the viewport so its CSS animations pause (saves GPU/CPU). */
@Directive({ selector: '[appInView]' })
export class InView implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;
  ngOnInit() {
    if (typeof IntersectionObserver === 'undefined') return;
    this.io = new IntersectionObserver(([e]) => this.el.classList.toggle('is-off', !e.isIntersecting), { rootMargin: '120px' });
    this.io.observe(this.el);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}
