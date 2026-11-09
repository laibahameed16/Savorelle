import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reveal, Tilt } from '../core/directives';
import { ToastService } from '../core/services';
import { Cta } from '../shared/cta';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

import { T, I18n } from '../core/i18n';
@Component({
  selector: 'app-experiences',
  imports: [PageHero, Reveal, Tilt, Cta, Icon, FormsModule, T],
  template: `
    <app-page-hero title="Experiences beyond dinner" subtitle="Tasting menus, private rooms, celebrations and gifts. Pick the way you want to enjoy Savorelle."/>

    <section id="tasting" class="mx-auto grid max-w-7xl scroll-mt-24 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
      <div appReveal="left" class="overflow-hidden rounded-3xl"><img src="img/gallery-1.jpg" alt="Tasting menu" class="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" /></div>
      <div>
        <h2 appReveal class="text-3xl sm:text-5xl">{{ "The Chef's Tasting" | t }}</h2>
        <p appReveal [delay]="80" class="mt-4 max-w-md leading-relaxed text-fg/70">{{ "Seven courses, chosen by the kitchen that morning, served at the chef's counter with a front-row view of the line." | t }}</p>
        <div appReveal [delay]="160" class="mt-6 inline-flex rounded-full border border-line p-1" role="tablist">
          @for (t of tastings; track t.name; let i = $index) {
            <button role="tab" [attr.aria-selected]="tasting() === i" class="rounded-full px-4 py-2 text-sm transition duration-300" [class]="tasting() === i ? 'bg-brand' : 'text-fg/70 hover:text-fg'" (click)="tasting.set(i)">{{ t.name | t }}</button>
          }
        </div>
        <div class="mt-5 animate-pop rounded-2xl bg-card p-5" [attr.key]="tasting()">
          @for (k of [tasting()]; track k) { <div class="animate-pop"><p class="font-display text-3xl">\${{ tastings[k].price }} <span class="text-sm text-fg/50">{{ 'per guest' | t }}</span></p><p class="mt-2 text-sm text-fg/60">{{ tastings[k].text | t }}</p></div> }
        </div>
        <div class="mt-6"><app-cta label="Book the Tasting" link="/reserve" [params]="{ location: 'Chef\\'s Counter' }"/></div>
      </div>
    </section>

    <section id="private" class="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
      <h2 appReveal class="text-3xl sm:text-5xl">{{ 'Private Dining' | t }}</h2>
      <p appReveal [delay]="80" class="mt-3 max-w-lg text-sm text-fg/60">{{ 'Three rooms, each with its own menu, sommelier and dedicated host.' | t }}</p>
      <div class="mt-8 grid gap-5 md:grid-cols-3">
        @for (r of rooms; track r.name; let i = $index) {
          <div appReveal [delay]="i * 100"><div appTilt class="h-full rounded-3xl bg-card p-7 transition-[transform,box-shadow] duration-200 hover:shadow-[0_20px_50px_-20px_rgb(242_107_13/.35)]">
            <span class="grid size-11 place-items-center rounded-xl bg-brand"><app-icon [name]="r.icon"/></span>
            <h3 class="mt-5 text-xl">{{ r.name | t }}</h3><p class="text-sm text-brand">{{ 'Up to' | t }} {{ r.seats }} {{ 'guests' | t }}</p>
            <p class="mt-3 text-sm leading-relaxed text-fg/60">{{ r.text | t }}</p>
          </div></div>
        }
      </div>
    </section>

    <section id="events" class="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
      <h2 appReveal class="text-3xl sm:text-5xl">{{ 'Upcoming Events' | t }}</h2>
      <ul class="mt-8 divide-y divide-line border-y border-line">
        @for (e of events; track e.title; let i = $index) {
          <li appReveal [delay]="i * 80" class="group grid items-center gap-3 py-6 transition-colors hover:bg-card/60 sm:grid-cols-[7rem_1fr_auto] sm:px-4">
            <p class="font-display text-brand"><span class="text-3xl">{{ e.day }}</span> {{ e.month | t }}</p>
            <div><h3 class="text-xl transition-colors group-hover:text-brand">{{ e.title | t }}</h3><p class="text-sm text-fg/60">{{ e.text | t }}</p></div>
            <app-cta label="Reserve" link="/reserve"/>
          </li>
        }
      </ul>
    </section>

    <section id="gift-cards" class="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 pb-24 sm:px-8">
      <div class="grid items-center gap-10 rounded-3xl bg-card p-6 sm:p-10 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl sm:text-5xl">{{ 'Gift Cards' | t }}</h2>
          <p class="mt-3 max-w-md text-sm text-fg/60">{{ 'Give someone a night to remember. Delivered by email, redeemable on any dish, drink or experience.' | t }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            @for (a of amounts; track a) { <button class="rounded-full border px-5 py-2 text-sm transition active:scale-95" [class]="amount() === a ? 'border-brand bg-brand' : 'border-line hover:border-brand/60'" (click)="amount.set(a)">\${{ a }}</button> }
          </div>
          <input class="field field-dark mt-4" [placeholder]="'Recipient\\'s name' | t" [attr.aria-label]="'Recipient name' | t" [(ngModel)]="to" />
          <textarea class="field field-dark mt-3" rows="3" [placeholder]="'Add a short message' | t" [attr.aria-label]="'Message' | t" [(ngModel)]="msg"></textarea>
          <div class="mt-5"><app-cta label="Send Gift Card" (pressed)="send()"/></div>
        </div>
        <div appTilt [max]="10" class="mx-auto aspect-[1.6] w-full max-w-md rounded-3xl bg-gradient-to-br from-brand via-orange-500 to-amber-300 p-6 text-black shadow-2xl transition-transform duration-200">
          <div class="flex h-full flex-col justify-between">
            <div class="flex justify-between"><span class="font-display text-2xl">Savorelle</span><app-icon name="gift" [size]="28"/></div>
            <div><p class="font-display text-5xl">\${{ amount() }}</p><p class="mt-1 text-sm">{{ 'For' | t }} {{ to() || ('someone special' | t) }}</p><p class="line-clamp-1 text-xs opacity-70">{{ msg() }}</p></div>
          </div>
        </div>
      </div>
    </section>`,
})
export class Experiences {
  private toast = inject(ToastService);
  private i18n = inject(I18n);
  tasting = signal(0);
  amount = signal(100);
  to = signal('');
  msg = signal('');
  amounts = [50, 100, 150, 250];
  tastings = [
    { name: '5 courses', price: 120, text: 'A lighter journey through the season with one wine pairing included.' },
    { name: '7 courses', price: 185, text: 'The full chef\'s tasting with a pairing for every course.' },
    { name: 'Omakase', price: 260, text: 'No menu, no limits. The team cooks what is best that night, with reserve wines.' },
  ];
  rooms = [
    { icon: 'wine', name: 'The Cellar', seats: 12, text: 'Candle-lit and surrounded by wine, ideal for anniversaries and small gatherings.' },
    { icon: 'users', name: 'The Gallery', seats: 24, text: 'A long table beneath the art wall, made for birthdays and business dinners.' },
    { icon: 'star2', name: 'The Terrace', seats: 40, text: 'Open-air and heated all year, with its own bar for receptions and launches.' },
  ];
  events = [
    { day: '14', month: 'Nov', title: 'Truffle Season Dinner', text: 'Five courses built around fresh black truffle, with paired wines.' },
    { day: '28', month: 'Nov', title: 'Sake & Seafood Night', text: 'Chef Takeshi pairs the freshest catch with rare sakes.' },
    { day: '12', month: 'Dec', title: 'Dessert Masterclass', text: 'Learn to make our matcha lava cake with Chef Elena.' },
  ];
  send() {
    this.toast.show(this.i18n.t(this.to() ? 'Gift card of ${amount} is on its way to {to}' : 'Gift card of ${amount} is on its way', { amount: this.amount(), to: this.to() }));
    this.to.set(''); this.msg.set('');
  }
}
