import { Component, HostListener, computed, signal } from '@angular/core';
import { GALLERY } from '../core/data';
import { Reveal } from '../core/directives';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

import { T } from '../core/i18n';
@Component({
  selector: 'app-gallery',
  imports: [PageHero, Icon, Reveal, T],
  template: `
    <app-page-hero title="Gallery" subtitle="A look at the plates, the people and the moments that make Savorelle."/>
    <section class="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div class="flex flex-wrap gap-2">
        @for (t of tags; track t) {
          <button class="rounded-full border px-4 py-2 text-sm transition active:scale-95" [class]="tag() === t ? 'border-brand bg-brand' : 'border-line text-white/70 hover:border-brand/60'" (click)="tag.set(t)">{{ t | t }}</button>
        }
      </div>
      <div class="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">
        @for (g of items(); track g.src; let i = $index) {
          <button appReveal="zoom" [delay]="(i % 4) * 70" class="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-card" (click)="open.set(i)" [attr.aria-label]="'Open ' + g.title">
            <img [src]="g.src" [alt]="g.title" loading="lazy" class="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <span class="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 text-start text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{{ g.title | t }}</span>
            <span class="absolute end-3 top-3 grid size-8 scale-75 place-items-center rounded-full bg-brand opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100"><app-icon name="zoom" [size]="16"/></span>
          </button>
        }
      </div>
    </section>

    @if (current(); as c) {
      <div class="fixed inset-0 z-[90] grid animate-pop place-items-center bg-black/95 p-4 text-white" role="dialog" aria-modal="true" [attr.aria-label]="c.title" (click)="open.set(null)">
        <button class="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand" [attr.aria-label]="'Close' | t" (click)="open.set(null)"><app-icon name="close"/></button>
        <button class="absolute start-3 grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand sm:start-6 rtl:rotate-180" [attr.aria-label]="'Previous' | t" (click)="step(-1); $event.stopPropagation()"><app-icon name="left"/></button>
        <figure class="max-h-full w-full max-w-3xl px-12 text-center sm:px-0" (click)="$event.stopPropagation()">
          <img [src]="c.src" [alt]="c.title" class="mx-auto max-h-[78vh] max-w-full rounded-2xl object-contain" />
          <figcaption class="mt-3 font-display text-xl">{{ c.title | t }}</figcaption>
        </figure>
        <button class="absolute end-3 grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand sm:end-6 rtl:rotate-180" [attr.aria-label]="'Next' | t" (click)="step(1); $event.stopPropagation()"><app-icon name="right"/></button>
      </div>
    }`,
})
export class Gallery {
  tags = ['All', 'Dishes', 'Team', 'Kitchen'];
  tag = signal('All');
  open = signal<number | null>(null);
  items = computed(() => GALLERY.filter(g => this.tag() === 'All' || g.tag === this.tag()));
  current = computed(() => { const i = this.open(); return i === null ? null : this.items()[i]; });
  step(d: number) { const n = this.items().length; this.open.update(i => i === null ? i : (i + d + n) % n); }
  @HostListener('window:keydown', ['$event']) key(e: KeyboardEvent) {
    if (this.open() === null) return;
    if (e.key === 'Escape') this.open.set(null);
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }
}
