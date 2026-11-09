import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from './icon';
import { Reveal } from '../core/directives';

import { T } from '../core/i18n';
@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon, Reveal, T],
  template: `
    <footer class="border-t border-line bg-bg">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 pb-10 pt-16 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div appReveal>
          <h2 class="text-5xl sm:text-6xl">Savorelle</h2>
          <p class="mt-4 text-fg/70">{{ 'Where Taste Meets Elegance' | t }}</p>
          <p class="mt-12 text-sm">{{ 'Visit Us' | t }}</p>
          <div class="mt-4 flex gap-3">
            @for (s of socials; track s.label) {
              <a href="#" [attr.aria-label]="s.label" (click)="$event.preventDefault()" class="grid size-10 place-items-center rounded-full border border-line text-fg/70 transition hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="s.d"/></svg>
              </a>
            }
          </div>
        </div>
        <div appReveal [delay]="100">
          <h3 class="mb-4 text-sm">Savorelle</h3>
          <ul class="space-y-2.5 text-sm text-fg/70">
            @for (l of links; track l.label) {
              <li><a [routerLink]="l.path" [fragment]="l.fragment" class="inline-block transition hover:translate-x-1 hover:text-brand rtl:hover:-translate-x-1">{{ l.label | t }}</a></li>
            }
          </ul>
        </div>
        <div appReveal [delay]="200">
          <h3 class="mb-4 text-sm">{{ 'Connect With Us' | t }}</h3>
          <ul class="space-y-3 text-sm text-fg/70">
            <li class="flex gap-3"><app-icon name="pin" [size]="16"/>{{ '123 Culinary Avenue, New York, NY' | t }}</li>
            <li class="flex gap-3"><app-icon name="phone" [size]="16"/><a href="tel:+18005551234" class="hover:text-brand">+1 (800) 555-1234</a></li>
            <li class="flex gap-3"><app-icon name="mail" [size]="16"/><a href="mailto:reservations@savorelle.com" class="hover:text-brand">reservations&#64;savorelle.com</a></li>
            <li class="flex gap-3"><app-icon name="clock" [size]="16"/>{{ 'Mon-Sun: 12PM - 11:30PM' | t }}</li>
          </ul>
        </div>
      </div>
      <div class="mx-auto flex max-w-7xl flex-col gap-3 border-t border-line px-5 py-5 text-xs text-fg/60 sm:flex-row sm:justify-between sm:px-8">
        <p>{{ '© 2025 Savorelle Restaurant. All rights reserved.' | t }}</p>
        <p class="flex flex-wrap gap-3"><a href="#" class="hover:text-brand">{{ 'Privacy Policy' | t }}</a>|<a href="#" class="hover:text-brand">{{ 'Terms & Conditions' | t }}</a>|<a href="#" class="hover:text-brand">{{ 'Accessibility' | t }}</a></p>
      </div>
    </footer>`,
})
export class Footer {
  links = [
    { label: 'Home', path: '/', fragment: undefined }, { label: 'Our Menu', path: '/menu', fragment: undefined },
    { label: 'Tasting Experience', path: '/experiences', fragment: 'tasting' }, { label: 'Book a Table', path: '/reserve', fragment: undefined },
    { label: 'Gift Cards', path: '/experiences', fragment: 'gift-cards' }, { label: 'Private Dining', path: '/experiences', fragment: 'private' },
    { label: 'Events', path: '/experiences', fragment: 'events' }, { label: 'My Orders', path: '/orders', fragment: undefined },
  ];
  socials = [
    { label: 'Instagram', d: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm5.5-1.5h.01' },
    { label: 'Facebook', d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z' },
    { label: 'X', d: 'M4 4l16 16M20 4 4 20' },
    { label: 'Google', d: 'M21 12h-9m9 0a9 9 0 1 1-3-6.7' },
  ];
}
