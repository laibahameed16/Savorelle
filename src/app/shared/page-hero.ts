import { Component, input } from '@angular/core';
import { T } from '../core/i18n';

@Component({
  selector: 'app-page-hero',
  imports: [T],
  template: `
    <section class="grain relative overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40">
      <span class="orb -end-24 -top-24 size-72" aria-hidden="true"></span>
      <span class="orb -bottom-32 start-1/4 size-60" style="animation-delay:-6s;opacity:.14" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-7xl px-5 sm:px-8">
        <h1 class="animate-fade-up max-w-3xl text-4xl leading-tight sm:text-6xl">{{ title() | t }}</h1>
        <p class="mt-5 max-w-xl animate-fade-up text-sm leading-relaxed text-fg/70 sm:text-base" style="animation-delay:.12s">{{ subtitle() | t }}</p>
        <ng-content />
      </div>
    </section>`,
})
export class PageHero { readonly title = input.required<string>(); readonly subtitle = input(''); }
