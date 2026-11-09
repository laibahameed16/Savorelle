import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { I18n, T } from '../core/i18n';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CHEFS, DISHES, LOCATIONS, REVIEWS, TIMES } from '../core/data';
import { Reveal } from '../core/directives';
import { Carousel } from '../shared/carousel';
import { Cta } from '../shared/cta';
import { DishCard } from '../shared/dish-card';
import { Icon } from '../shared/icon';
import { SectionHead } from '../shared/section-head';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, Reveal, Carousel, Cta, DishCard, Icon, SectionHead, T],
  template: `
  <!-- HERO -->
  <section class="grain relative overflow-hidden pt-28 sm:pt-32">
    <span class="orb -start-24 top-10 size-80" aria-hidden="true"></span>
    <span class="orb -bottom-20 end-1/4 size-64" style="animation-delay:-7s;opacity:.15" aria-hidden="true"></span>
    <div class="mx-auto grid max-w-7xl items-center lg:min-h-[620px] gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
      <div class="relative z-10">
        <h1 class="text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
          @for (w of heroWords(); track w; let i = $index) { <span class="hero-word me-[.28em] inline-block" [style.animation-delay]="i * 110 + 'ms'">{{ w }}</span> }
          <span class="hero-word text-shimmer inline-block" [style.animation-delay]="heroWords().length * 110 + 'ms, 0s'">{{ 'Every Bite' | t }}</span>
        </h1>
        <svg class="absolute -end-6 top-6 hidden w-44 text-fg/80 xl:block rtl:-scale-x-100" viewBox="0 0 170 70" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
          <path d="M2 40c20-30 70-40 100-18 20 15 0 38-18 24-16-13 8-40 60-26m0 0-10-8m10 8-12 7" stroke-dasharray="400" stroke-dashoffset="400" style="animation: draw 2.2s .6s ease forwards"/>
        </svg>
        <p class="mt-6 max-w-sm animate-fade-up text-sm leading-relaxed text-fg/70" style="animation-delay:.15s">{{ 'Experience gourmet dining crafted with passion, fresh ingredients, and unforgettable flavors.' | t }}</p>
        <div class="mt-7 animate-fade-up" style="animation-delay:.3s"><app-cta label="Reserve Your Table" link="/reserve" size="lg"/></div>
      </div>

      <div class="relative mx-auto w-full max-w-[34rem] animate-fade-up lg:max-w-none" style="animation-delay:.2s">
        <div class="relative mx-auto aspect-square w-[88%] animate-float lg:ms-auto lg:me-0">
          <span class="plate-ring pointer-events-none absolute -inset-4 rounded-full border border-dashed border-brand/50" aria-hidden="true"></span>
          <span class="plate-ring pointer-events-none absolute -inset-9 rounded-full border border-fg/10" style="animation-direction:reverse;animation-duration:70s" aria-hidden="true"></span>
          <div class="relative size-full overflow-hidden rounded-full bg-card-2 shadow-[0_30px_80px_-20px_#000] ring-1 ring-fg/10">
            @for (p of heroPlates; track p.src; let i = $index) {
              <img [src]="p.src" [alt]="p.alt" decoding="async" [attr.fetchpriority]="i === 0 ? 'high' : null"
                class="absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ease-in-out" [class]="heroIdx() === i ? 'opacity-100' : 'opacity-0'" />
            }
          </div>
        </div>
        <ul class="relative -mt-14 w-full max-w-xs space-y-3.5 rounded-2xl border border-fg/10 bg-card/90 p-5 sm:absolute sm:-bottom-6 sm:-start-4 sm:mt-0 lg:-start-24 lg:max-w-[17rem]">
          @for (f of heroFeatures; track f.title) {
            <li>
              <a [routerLink]="f.link" class="group flex items-start gap-3 transition hover:translate-x-1 rtl:hover:-translate-x-1">
                <span class="mt-0.5 text-fg transition group-hover:text-brand"><app-icon [name]="f.icon" [size]="20"/></span>
                <span><span class="block text-sm font-medium">{{ f.title | t }}</span><span class="block text-[11px] text-fg/60">{{ f.text | t }}</span></span>
              </a>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <!-- MARQUEE -->
  <div dir="ltr" class="marquee-mask overflow-hidden border-y border-line bg-card/60 py-4" aria-hidden="true">
    <div class="marquee-track flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-xl text-fg/70">
      @for (n of [1, 2]; track n) {
        @for (m of marquee; track m) { <span class="flex items-center gap-12"><span>{{ m | t }}</span><span class="text-brand">✦</span></span> }
      }
    </div>
  </div>

  <!-- DISHES -->
  <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
    <app-section-head sub="Explore our finest selections, crafted to perfection by world-class chefs.">{{ 'Indulge in Culinary Artistry' | t }}</app-section-head>
    <div class="mt-8">
      <app-carousel>
        @for (d of dishes; track d.id) {
          <div class="w-[78%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"><app-dish-card [dish]="d"/></div>
        }
      </app-carousel>
    </div>
  </section>

  <!-- SERVING -->
  <section class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
    <div>
      <h2 appReveal class="text-4xl sm:text-5xl lg:text-6xl">{{ 'Serving You Better' | t }}</h2>
      <p appReveal [delay]="100" class="mt-5 max-w-md text-sm leading-relaxed text-fg/60">{{ 'We offer more than great food. From online orders to world-class chefs, we ensure every part of your dining experience is exceptional.' | t }}</p>
      <ul class="mt-8 grid max-w-md gap-x-6 gap-y-4 sm:grid-cols-2">
        @for (f of features; track f.label; let i = $index) {
          <li appReveal [delay]="i * 70" class="group flex cursor-default items-center gap-3 text-sm text-fg/80">
            <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-white transition duration-300 group-hover:-rotate-6 group-hover:scale-110"><app-icon [name]="f.icon" [size]="16"/></span>
            <span class="transition group-hover:text-fg">{{ f.label | t }}</span>
          </li>
        }
      </ul>
      <div class="mt-9"><app-cta label="Book a Table" link="/reserve"/></div>
    </div>
    <div appReveal="right" class="relative mx-auto w-full max-w-lg">
      <div class="absolute -start-4 -top-6 z-10 w-[38%] animate-float overflow-hidden rounded-2xl ring-1 ring-fg/10 sm:-start-10"><img src="img/salad.jpg" loading="lazy" decoding="async" alt="Herb roasted chicken" class="aspect-square w-full object-cover" /></div>
      <div class="ms-[18%] overflow-hidden rounded-3xl bg-card"><img src="img/waiter.jpg" loading="lazy" decoding="async" alt="Waitress taking an order" class="aspect-[4/4.6] w-full object-cover transition-transform duration-700 hover:scale-105" /></div>
    </div>
  </section>

  <!-- LUXURY -->
  <section class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
    <div appReveal="left" class="relative mx-auto aspect-[1/1.02] w-full max-w-md">
      <div class="absolute bottom-4 start-0 top-6 w-[78%] overflow-hidden rounded-2xl ring-1 ring-fg/10"><img src="img/gallery-1.jpg" loading="lazy" decoding="async" alt="Chef's tasting table" class="size-full object-cover transition-transform duration-700 hover:scale-110" /></div>
      <div class="absolute end-0 top-0 w-[34%] animate-float overflow-hidden rounded-2xl ring-1 ring-fg/10"><img src="img/gallery-steak.jpg" loading="lazy" decoding="async" alt="Peppercorn wagyu" class="aspect-square w-full object-cover" /></div>
      <div class="absolute -bottom-2 -start-[4%] w-[32%] overflow-hidden rounded-2xl ring-1 ring-fg/10 transition hover:-translate-y-2"><img src="img/gallery-steak2.jpg" loading="lazy" decoding="async" alt="Glazed short rib" class="aspect-square w-full object-cover" /></div>
    </div>
    <div>
      <h2 appReveal class="text-4xl sm:text-5xl lg:text-6xl">{{ 'Luxury dining starts here' | t }}</h2>
      <p appReveal [delay]="100" class="mt-5 max-w-sm text-sm leading-relaxed text-fg/60">{{ "Whether it's an intimate dinner or a grand celebration, we're here to make it special." | t }}</p>
      <div class="mt-7"><app-cta label="Book a Table" link="/reserve"/></div>
    </div>
  </section>

  <!-- CHEFS -->
  <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8">
    <app-section-head sub="Each dish begins with vision, skill, and passion. Get to know the culinary artists who turn fresh ingredients into works of art.">{{ 'Crafted by Experts' | t }}</app-section-head>
    <div class="mt-8">
      <app-carousel>
        @for (c of chefs; track c.name) {
          <a routerLink="/about" fragment="team" class="group w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl bg-card text-center sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
            <div class="overflow-hidden"><img [src]="c.image" [alt]="c.name" loading="lazy" class="aspect-[1/0.88] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" /></div>
            <h3 class="py-5 text-2xl transition-colors group-hover:text-brand">{{ c.name | t }}</h3>
          </a>
        }
      </app-carousel>
    </div>
  </section>

  <!-- REVIEWS -->
  <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8">
    <app-section-head sub="Real voices. Honest praise. Unforgettable moments shared at our table.">{{ 'Praise from Our Patrons' | t }}</app-section-head>
    <div class="mt-8">
      <app-carousel>
        @for (r of reviews; track r.name) {
          <figure class="w-[85%] shrink-0 snap-start rounded-2xl border border-transparent bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/40 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
            <figcaption class="flex items-center gap-3">
              <span class="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand to-amber-300 text-sm font-semibold text-black">{{ r.name[0] }}</span>
              <span class="text-sm"><span class="block">{{ r.name }}</span><span class="block text-[11px] text-fg/50">{{ r.role | t }}</span></span>
              <span class="ms-auto flex text-brand">@for (s of [1,2,3,4,5]; track s) { <app-icon name="star" [size]="12"/> }</span>
            </figcaption>
            <blockquote class="mt-4 text-sm leading-relaxed text-fg/80">"{{ r.text | t }}"</blockquote>
          </figure>
        }
      </app-carousel>
    </div>
  </section>

  <!-- RESERVE -->
  <section class="mx-auto max-w-7xl px-5 py-16 sm:px-8">
    <div class="relative overflow-hidden rounded-3xl">
      <img src="img/noodles.jpg" loading="lazy" decoding="async" alt="Noodles being lifted with chopsticks" class="absolute inset-0 size-full object-cover" />
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative flex justify-end p-4 sm:p-8 lg:p-10">
        <form appReveal="zoom" class="w-full max-w-md space-y-3 rounded-2xl bg-white p-5 text-neutral-900 shadow-2xl sm:p-6" (ngSubmit)="goReserve()">
          <h3 class="font-display text-2xl">{{ 'Reserve Your Table' | t }}</h3>
          <label class="block text-xs font-medium">{{ 'Choose Location' | t }}
            <select name="loc" class="field mt-1.5" [(ngModel)]="loc"><option value="" disabled>{{ 'Select your preferred dining spot.' | t }}</option>@for (l of locations; track l) { <option [value]="l">{{ l | t }}</option> }</select></label>
          <label class="block text-xs font-medium">{{ 'Guests' | t }}
            <select name="g" class="field mt-1.5" [(ngModel)]="guests"><option value="" disabled>{{ 'How many seats would you like?' | t }}</option>@for (n of guestOpts; track n) { <option [value]="n">{{ n }} {{ (n === 1 ? 'guest' : 'guests') | t }}</option> }</select></label>
          <div class="grid grid-cols-2 gap-3">
            <label class="block text-xs font-medium">{{ 'Date' | t }}<input type="date" name="d" class="field mt-1.5" [min]="today" [(ngModel)]="date" /></label>
            <label class="block text-xs font-medium">{{ 'Time' | t }}<select name="t" class="field mt-1.5" [(ngModel)]="time">@for (t of times; track t) { <option [value]="t">{{ t | t }}</option> }</select></label>
          </div>
          <button type="submit" class="w-full rounded-lg bg-brand py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark hover:shadow-lg active:scale-[.98]">{{ 'Confirm Reservation' | t }}</button>
        </form>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
    <div class="grain grid-lines relative overflow-hidden rounded-3xl">
      <div class="relative grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1.15fr_1fr] md:gap-6 lg:p-14">
        <div class="relative z-10 text-center md:text-start">
          <h2 appReveal class="text-4xl sm:text-5xl lg:text-6xl">{{ 'Let Flavor Lead the Way' | t }}</h2>
          <p appReveal [delay]="100" class="mx-auto mt-4 max-w-sm text-sm text-fg/70 md:mx-0">{{ 'Reserve your table today and indulge in a taste that lingers.' | t }}</p>
          <div class="mt-7"><app-cta label="Book a Table" link="/reserve" size="lg"/></div>
        </div>
        <div appReveal="zoom" class="mx-auto w-full max-w-[16rem] sm:max-w-[20rem] md:ms-auto md:me-0 md:max-w-[24rem]">
          <div class="overflow-hidden rounded-full shadow-[0_30px_70px_-20px_#000] ring-1 ring-fg/10 transition-transform duration-500 hover:scale-105">
            <img src="img/penne-plate.jpg" alt="Truffle penne" loading="lazy" decoding="async" class="aspect-square w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class Home {
  private router = inject(Router);
  private i18n = inject(I18n);
  constructor() {
    const id = setInterval(() => this.heroIdx.update(i => (i + 1) % this.heroPlates.length), 4500);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
  heroPlates = [
    { src: 'img/penne-plate.jpg', alt: 'Truffle penne' }, { src: 'img/pasta-plate.jpg', alt: 'Truffle pasta' },
    { src: 'img/risotto-plate.jpg', alt: 'Sea urchin risotto' }, { src: 'img/matcha-plate.jpg', alt: 'Matcha lava cake' },
  ];
  heroIdx = signal(0);
  heroWords = computed(() => this.i18n.t('Savor Every Moment with').split(' '));
  marquee = ['Fresh Ingredients', 'World-Class Chefs', 'Seasonal Menus', 'Wood-Fired Flavor', 'Handmade Pasta', 'Private Dining'];
  dishes = DISHES;
  chefs = CHEFS;
  reviews = REVIEWS;
  locations = LOCATIONS;
  times = TIMES;
  guestOpts = Array.from({ length: 12 }, (_, i) => i + 1);
  today = new Date().toISOString().slice(0, 10);
  loc = ''; guests = ''; date = this.today; time = '7:00 PM';

  heroFeatures = [
    { icon: 'star2', title: 'Special Events', text: 'Let us bring luxury to your special event', link: '/experiences' },
    { icon: 'chef', title: "Chef's Experience", text: 'Enjoy a front-row seat to culinary excellence', link: '/experiences' },
    { icon: 'utensils', title: 'Teriyaki Wings', text: 'Crispy, saucy wings with a hint of sesame', link: '/menu/teriyaki-wings' },
  ];
  features = [
    { icon: 'bag', label: 'Online Orders' }, { icon: 'sparkle', label: 'Spotless Kitchen' },
    { icon: 'calendar', label: 'Table Reservation' }, { icon: 'chef', label: 'World-Class Chefs' },
    { icon: 'clock', label: '24/7 Availability' }, { icon: 'users', label: 'Organized Dining Spaces' },
  ];

  goReserve() {
    this.router.navigate(['/reserve'], { queryParams: { location: this.loc || null, guests: this.guests || null, date: this.date, time: this.time } });
  }
}
