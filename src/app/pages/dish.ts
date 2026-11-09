import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DISHES } from '../core/data';
import { CartService, FavoritesService } from '../core/services';
import { DishCard } from '../shared/dish-card';
import { Icon } from '../shared/icon';
import { Cta } from '../shared/cta';

import { T } from '../core/i18n';
@Component({
  selector: 'app-dish',
  imports: [RouterLink, Icon, Cta, DishCard, T],
  template: `
    @if (dish(); as d) {
      <section class="grain pt-28 sm:pt-36">
        <div class="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-2">
          <div class="mx-auto w-full max-w-xs animate-pop sm:max-w-md" [class]="modeClass(d.anim)" style="--dur:34s">
            <div class="plate-frame aspect-square overflow-hidden rounded-full shadow-[0_30px_80px_-20px_#000] ring-1 ring-fg/10">
              <img [src]="d.image" [alt]="d.name" decoding="async" class="plate-img size-full object-cover" />
            </div>
          </div>
          <div class="animate-fade-up">
            <a routerLink="/menu" class="inline-flex items-center gap-2 text-sm text-fg/60 transition hover:-translate-x-1 hover:text-brand"><app-icon name="left" [size]="16"/> {{ 'Back to menu' | t }}</a>
            <div class="mt-4 flex flex-wrap gap-2">@for (t of d.tags; track t) { <span class="rounded-full border border-brand/50 px-3 py-1 text-xs text-brand">{{ t | t }}</span> }</div>
            <h1 class="mt-4 text-4xl sm:text-6xl">{{ d.name | t }}</h1>
            <div class="mt-3 flex items-center gap-4 text-sm text-fg/70">
              <span class="flex items-center gap-1 text-fg"><span class="text-brand"><app-icon name="star" [size]="14"/></span>{{ d.rating.toFixed(1) }}</span>
              <span class="flex items-center gap-1"><app-icon name="clock" [size]="14"/>{{ d.prep | t }}</span><span>{{ d.category | t }}</span>
            </div>
            <p class="mt-5 max-w-lg leading-relaxed text-fg/70">{{ d.description | t }}</p>
            <ul class="mt-5 flex flex-wrap gap-2">@for (i of d.ingredients; track i) { <li class="rounded-lg bg-card px-3 py-1.5 text-xs text-fg/80 transition hover:bg-card-2">{{ i | t }}</li> }</ul>
            <p class="mt-7 font-display text-4xl">\${{ d.price * qty() }}</p>
            <div class="mt-5 flex flex-wrap items-center gap-4">
              <div class="flex items-center rounded-full border border-line">
                <button class="grid size-11 place-items-center transition hover:text-brand active:scale-75" [attr.aria-label]="'Decrease' | t" (click)="qty.set(Math.max(1, qty() - 1))"><app-icon name="minus" [size]="16"/></button>
                <span class="w-8 text-center">{{ qty() }}</span>
                <button class="grid size-11 place-items-center transition hover:text-brand active:scale-75" [attr.aria-label]="'Increase' | t" (click)="qty.set(qty() + 1)"><app-icon name="plus" [size]="16"/></button>
              </div>
              <app-cta label="Add to Order" size="lg" (pressed)="cart.add(d, qty())"/>
              <button class="grid size-12 place-items-center rounded-full border border-line transition hover:border-brand active:scale-90" [class.text-brand]="fav.has(d.id)" [attr.aria-label]="'Favorite' | t" (click)="fav.toggle(d)">
                <svg width="20" height="20" viewBox="0 0 24 24" [attr.fill]="fav.has(d.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <h2 class="text-3xl sm:text-4xl">{{ 'You may also like' | t }}</h2>
        <div class="mt-4 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (r of related(); track r.id) { <app-dish-card [dish]="r"/> }
        </div>
      </section>
    } @else {
      <section class="grid min-h-[70vh] place-items-center px-5 pt-24 text-center">
        <div><h1 class="text-4xl">{{ "We couldn't find that dish" | t }}</h1><div class="mt-6"><app-cta label="Back to Menu" link="/menu"/></div></div>
      </section>
    }`,
})
export class DishPage {
  Math = Math;
  modeClass(a: 'spin' | 'spin-rev' | 'float') { return ({ spin: 'plate-spin', 'spin-rev': 'plate-spin-rev', float: 'plate-float' })[a]; }
  cart = inject(CartService);
  fav = inject(FavoritesService);
  qty = signal(1);
  private id = toSignal(inject(ActivatedRoute).paramMap.pipe(map(p => p.get('id'))));
  dish = computed(() => DISHES.find(d => d.id === this.id()));
  constructor() { effect(() => { this.id(); this.qty.set(1); }); }
  related = computed(() => DISHES.filter(d => d.id !== this.id() && d.category === this.dish()?.category).concat(DISHES.filter(d => d.id !== this.id() && d.category !== this.dish()?.category)).slice(0, 3));
}
