import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DISHES, Dish } from '../core/data';
import { CartService, FavoritesService } from '../core/services';
import { Tilt, InView } from '../core/directives';
import { Icon } from './icon';
import { Cta } from './cta';

import { T } from '../core/i18n';
@Component({
  selector: 'app-dish-card',
  imports: [RouterLink, Icon, Cta, Tilt, T, InView],
  template: `
    <article appTilt class="group relative mt-16 flex h-[calc(100%-4rem)] flex-col rounded-3xl bg-card px-6 pb-6 pt-24 text-center transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_20px_50px_-20px_rgb(242_107_13/.35)]">
      <!-- plate: positioned wrapper > animated frame (glow / bob) > link (hover zoom) > image (spin) -->
      <div appInView class="absolute -top-16 left-1/2 size-36 -translate-x-1/2 sm:size-40" [class]="modeClass()" [style.--dur]="dur()" [style.--delay]="delay()">
        @if (dish().anim !== 'float') {
          <span class="plate-ring pointer-events-none absolute -inset-2.5 rounded-full border border-dashed border-brand/40" aria-hidden="true"></span>
        }
        <a [routerLink]="['/menu', dish().id]" class="plate-frame group/plate relative block size-full overflow-hidden rounded-full bg-card-2 ring-1 ring-fg/10 transition-transform duration-500 group-hover:scale-110" [attr.aria-label]="'View ' + dish().name">
          <img [src]="dish().image" [alt]="dish().name" loading="lazy" decoding="async" class="plate-img size-full object-cover" />
        </a>
      </div>
      <a [routerLink]="['/menu', dish().id]" class="font-display text-xl transition-colors group-hover:text-brand">{{ dish().name | t }}</a>
      @if (showDesc()) { <p class="mt-2 line-clamp-2 text-sm text-fg/60">{{ dish().description | t }}</p> }
      <div class="mt-auto flex items-center justify-between pt-6">
        <span class="font-display text-xl">\${{ dish().price }}</span>
        <button class="grid size-8 place-items-center rounded-full transition hover:bg-fg/10 active:scale-75" [class]="fav.has(dish().id) ? 'text-brand' : 'text-fg/70'" (click)="fav.toggle(dish())" [attr.aria-pressed]="fav.has(dish().id)" [attr.aria-label]="'Toggle favorite' | t">
          <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="fav.has(dish().id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" [class.animate-pop]="fav.has(dish().id)"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <app-cta label="Order Now" (pressed)="cart.add(dish())"/>
        <span class="flex items-center gap-1 text-sm"><span class="text-brand"><app-icon name="star" [size]="14" /></span>{{ dish().rating.toFixed(1) }}</span>
      </div>
    </article>`,
  host: { class: 'block' },
})
export class DishCard {
  readonly dish = input.required<Dish>();
  readonly showDesc = input(false);
  cart = inject(CartService);
  fav = inject(FavoritesService);

  private idx = computed(() => Math.max(0, DISHES.findIndex(d => d.id === this.dish().id)));
  /** same dish always animates the same way everywhere on the site */
  modeClass = computed(() => ({ spin: 'plate-spin', 'spin-rev': 'plate-spin-rev', float: 'plate-float' })[this.dish().anim]);
  dur = computed(() => 22 + (this.idx() % 4) * 4 + 's');
  delay = computed(() => -(this.idx() % 5) * 0.8 + 's');
}
