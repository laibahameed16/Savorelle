import { Component, computed, signal } from '@angular/core';
import { CATEGORIES, DISHES } from '../core/data';
import { Reveal } from '../core/directives';
import { DishCard } from '../shared/dish-card';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

import { T } from '../core/i18n';
@Component({
  selector: 'app-menu-page',
  imports: [DishCard, Icon, PageHero, Reveal, T],
  template: `
    <app-page-hero title="Our Menu" subtitle="Seasonal plates, signature classics and desserts worth saving room for. Add anything to your order with one click."/>
    <section class="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div class="sticky top-[60px] z-30 -mx-5 flex flex-col gap-3 bg-bg/95 px-5 py-4 sm:top-[64px] sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div class="no-scrollbar flex gap-2 overflow-x-auto" role="tablist">
          @for (c of categories; track c) {
            <button role="tab" [attr.aria-selected]="cat() === c" (click)="cat.set(c)"
              class="shrink-0 rounded-full border px-4 py-2 text-sm transition duration-300 active:scale-95"
              [class]="cat() === c ? 'border-brand bg-brand text-white' : 'border-line text-fg/70 hover:border-brand/60 hover:text-fg'">{{ c | t }}</button>
          }
        </div>
        <div class="flex gap-2">
          <label class="relative flex-1 sm:w-56 sm:flex-none">
            <span class="pointer-events-none absolute start-3.5 top-1/2 z-10 -translate-y-1/2 text-fg/50"><app-icon name="search" [size]="16"/></span>
            <input class="field field-dark field-search" type="search" [placeholder]="'Search dishes' | t" [attr.aria-label]="'Search dishes' | t" [value]="q()" (input)="q.set($any($event.target).value)" />
          </label>
          <select class="field field-dark w-auto" [attr.aria-label]="'Sort' | t" (change)="sort.set($any($event.target).value)">
            <option value="pop">{{ 'Top rated' | t }}</option><option value="low">{{ 'Price: low' | t }}</option><option value="high">{{ 'Price: high' | t }}</option>
          </select>
        </div>
      </div>

      @if (list().length) {
        <p class="mt-2 text-xs text-fg/50">{{ list().length }} {{ (list().length === 1 ? 'dish' : 'dishes') | t }}</p>
        <div class="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          @for (d of list(); track d.id; let i = $index) {
            <div appReveal [delay]="(i % 3) * 80"><app-dish-card [dish]="d" [showDesc]="true"/></div>
          }
        </div>
      } @else {
        <div class="mt-20 text-center">
          <p class="font-display text-2xl">{{ 'No dishes match “{q}”' | t:{ q: q() } }}</p>
          <p class="mt-2 text-sm text-fg/60">{{ 'Try a different search or pick another category.' | t }}</p>
          <button class="mt-5 rounded-full border border-line px-5 py-2 text-sm transition hover:border-brand hover:text-brand" (click)="reset()">{{ 'Clear filters' | t }}</button>
        </div>
      }
    </section>`,
})
export class MenuPage {
  categories = CATEGORIES;
  cat = signal<string>('All');
  q = signal('');
  sort = signal('pop');
  list = computed(() => {
    const q = this.q().trim().toLowerCase();
    const l = DISHES.filter(d => (this.cat() === 'All' || d.category === this.cat()) &&
      (!q || (d.name + d.description + d.ingredients.join(' ')).toLowerCase().includes(q)));
    const s = this.sort();
    return [...l].sort((a, b) => s === 'low' ? a.price - b.price : s === 'high' ? b.price - a.price : b.rating - a.rating);
  });
  reset() { this.q.set(''); this.cat.set('All'); }
}
