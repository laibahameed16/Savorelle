import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHEFS } from '../core/data';
import { CountUp, Reveal, Tilt } from '../core/directives';
import { Cta } from '../shared/cta';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

import { T } from '../core/i18n';
@Component({
  selector: 'app-about',
  imports: [PageHero, Reveal, Tilt, CountUp, Cta, Icon, RouterLink, T],
  template: `
    <app-page-hero title="A table built on craft, warmth and fire" subtitle="Savorelle opened with one idea: fine dining should feel generous. Every plate is made from scratch, every guest is looked after like family."/>

    <section class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
      <div appReveal="left" class="relative mx-auto w-full max-w-md">
        <img src="img/gallery-1.jpg" alt="Chef's table" class="aspect-square w-full rounded-3xl object-cover ring-1 ring-fg/10" />
        <img src="img/salad.jpg" alt="Roast chicken plate" class="absolute -bottom-6 -end-4 w-2/5 animate-float rounded-2xl ring-4 ring-bg sm:-end-8" />
      </div>
      <div>
        <h2 appReveal class="text-3xl sm:text-5xl">{{ 'Our story' | t }}</h2>
        <p appReveal [delay]="80" class="mt-5 leading-relaxed text-fg/70">{{ 'What began as a twelve-seat counter in New York has grown into a dining room known for its tasting menus, seasonal produce and an open kitchen where guests watch the team work.' | t }}</p>
        <p appReveal [delay]="160" class="mt-4 leading-relaxed text-fg/70">{{ 'We buy from small farms and trusted fishmongers, cook over live fire, and make our pasta, breads and desserts every morning. Nothing leaves the pass until the chef is proud of it.' | t }}</p>
        <div appReveal [delay]="240" class="mt-7"><app-cta label="Book a Table" link="/reserve"/></div>
      </div>
    </section>

    <section class="border-y border-line bg-card/50">
      <dl class="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-14 text-center sm:px-8 md:grid-cols-4">
        @for (s of stats; track s.label) {
          <div><dt class="sr-only">{{ s.label | t }}</dt><dd class="font-display text-4xl text-brand sm:text-5xl" [appCountUp]="s.value" [suffix]="s.suffix"></dd><p class="mt-2 text-sm text-fg/60">{{ s.label | t }}</p></div>
        }
      </dl>
    </section>

    <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <h2 appReveal class="text-3xl sm:text-5xl">{{ 'What we stand for' | t }}</h2>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        @for (v of values; track v.title; let i = $index) {
          <div appReveal [delay]="i * 100"><div appTilt class="h-full rounded-3xl bg-card p-7 transition-[transform,box-shadow] duration-200 hover:shadow-[0_20px_50px_-20px_rgb(242_107_13/.35)]">
            <span class="grid size-11 place-items-center rounded-xl bg-brand"><app-icon [name]="v.icon"/></span>
            <h3 class="mt-5 text-xl">{{ v.title | t }}</h3><p class="mt-2 text-sm leading-relaxed text-fg/60">{{ v.text | t }}</p>
          </div></div>
        }
      </div>
    </section>

    <section id="team" class="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8">
      <h2 appReveal class="text-3xl sm:text-5xl">{{ 'Meet the chefs' | t }}</h2>
      <div class="mt-10 grid gap-6 md:grid-cols-3">
        @for (c of chefs; track c.name; let i = $index) {
          <article appReveal [delay]="i * 100" class="group overflow-hidden rounded-3xl bg-card">
            <div class="overflow-hidden"><img [src]="c.image" [alt]="c.name" loading="lazy" class="aspect-[1/0.9] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" /></div>
            <div class="p-6"><h3 class="text-2xl transition-colors group-hover:text-brand">{{ c.name | t }}</h3><p class="text-sm text-brand">{{ c.role | t }}</p><p class="mt-3 text-sm leading-relaxed text-fg/60">{{ c.bio | t }}</p></div>
          </article>
        }
      </div>
      <p class="mt-10 text-center text-sm text-fg/60">{{ 'Want to meet them in person?' | t }} <a routerLink="/experiences" fragment="tasting" class="text-brand underline-offset-4 hover:underline">{{ "Book the chef's tasting" | t }}</a>.</p>
    </section>`,
})
export class About {
  chefs = CHEFS;
  stats = [
    { value: 12, suffix: '', label: 'Years of service' }, { value: 48000, suffix: '+', label: 'Guests hosted' },
    { value: 9, suffix: '', label: 'Seasonal menus a year' }, { value: 4, suffix: '.9', label: 'Average guest rating' },
  ];
  values = [
    { icon: 'sparkle', title: 'Fresh, always', text: 'Produce and seafood arrive daily. If it is not at its best, it is not on the plate.' },
    { icon: 'chef', title: 'Made by hand', text: 'Pasta, sauces, breads and desserts are made in-house every morning by our own team.' },
    { icon: 'users', title: 'Hospitality first', text: 'We remember your name, your allergies and your anniversary. Warm service is part of the recipe.' },
  ];
}
