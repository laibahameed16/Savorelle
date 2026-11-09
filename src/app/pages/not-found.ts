import { Component } from '@angular/core';
import { Cta } from '../shared/cta';

import { T } from '../core/i18n';
@Component({
  selector: 'app-not-found',
  imports: [Cta, T],
  template: `
    <section class="grain grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p class="animate-float font-display text-8xl text-brand sm:text-9xl">404</p>
        <h1 class="mt-4 text-3xl sm:text-4xl">{{ "This table isn't set" | t }}</h1>
        <p class="mx-auto mt-3 max-w-sm text-sm text-fg/60">{{ "The page you're looking for has moved or doesn't exist. Let's get you back to the good stuff." | t }}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3"><app-cta label="Go Home" link="/"/><app-cta label="View Menu" link="/menu"/></div>
      </div>
    </section>`,
})
export class NotFound {}
