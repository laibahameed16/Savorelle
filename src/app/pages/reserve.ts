import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LOCATIONS, TIMES } from '../core/data';
import { Booking, BookingService, ToastService } from '../core/services';
import { Reveal } from '../core/directives';
import { Cta } from '../shared/cta';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

import { T, I18n } from '../core/i18n';
@Component({
  selector: 'app-reserve',
  imports: [ReactiveFormsModule, PageHero, Cta, Icon, Reveal, T],
  template: `
    <app-page-hero title="Book a table" subtitle="Choose your spot, tell us who's coming and we'll hold your table. Confirmation is instant."/>
    <section class="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        @if (done(); as b) {
          <div class="animate-pop rounded-3xl bg-card p-8 text-center sm:p-12">
            <span class="mx-auto grid size-16 place-items-center rounded-full bg-brand"><app-icon name="check" [size]="30" [stroke]="2.5"/></span>
            <h2 class="mt-5 text-3xl">{{ "You're booked, {name}!" | t:{ name: b.name.split(' ')[0] } }}</h2>
            <p class="mt-2 text-sm text-fg/60">{{ (b.guests === '1' ? '{n} guest at {loc}, {date} at {time}.' : '{n} guests at {loc}, {date} at {time}.') | t:{ n: b.guests, loc: (b.location | t), date: b.date, time: (b.time | t) } }}</p>
            <p class="mt-6 inline-block rounded-xl border border-dashed border-brand px-6 py-3 font-display text-2xl tracking-widest text-brand">{{ b.code }}</p>
            <p class="mt-3 text-xs text-fg/50">{{ 'Show this code when you arrive. A confirmation was sent to {email}.' | t:{ email: b.email } }}</p>
            <div class="mt-8"><app-cta label="Make Another Booking" (pressed)="done.set(null)"/></div>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="space-y-4 rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl sm:p-8">
            <h2 class="font-display text-2xl">{{ 'Reservation details' | t }}</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-xs font-medium">{{ 'Full name' | t }}<input class="field mt-1.5" [class.invalid]="bad('name')" formControlName="name" autocomplete="name" />@if (bad('name')) { <span class="mt-1 block text-rose-600">{{ 'Please enter your name.' | t }}</span> }</label>
              <label class="block text-xs font-medium">{{ 'Email' | t }}<input class="field mt-1.5" [class.invalid]="bad('email')" type="email" formControlName="email" autocomplete="email" />@if (bad('email')) { <span class="mt-1 block text-rose-600">{{ 'Enter a valid email.' | t }}</span> }</label>
              <label class="block text-xs font-medium">{{ 'Phone' | t }}<input class="field mt-1.5" [class.invalid]="bad('phone')" type="tel" formControlName="phone" autocomplete="tel" />@if (bad('phone')) { <span class="mt-1 block text-rose-600">{{ 'Enter at least 7 digits.' | t }}</span> }</label>
              <label class="block text-xs font-medium">{{ 'Occasion' | t }}<select class="field mt-1.5" formControlName="occasion"><option value="None">{{ 'None' | t }}</option><option value="Birthday">{{ 'Birthday' | t }}</option><option value="Anniversary">{{ 'Anniversary' | t }}</option><option value="Business">{{ 'Business' | t }}</option><option value="Celebration">{{ 'Celebration' | t }}</option></select></label>
              <label class="block text-xs font-medium">{{ 'Location' | t }}<select class="field mt-1.5" formControlName="location">@for (l of locations; track l) { <option [value]="l">{{ l | t }}</option> }</select></label>
              <label class="block text-xs font-medium">{{ 'Guests' | t }}<select class="field mt-1.5" formControlName="guests">@for (n of guestOpts; track n) { <option [value]="n">{{ n }}</option> }</select></label>
              <label class="block text-xs font-medium">{{ 'Date' | t }}<input class="field mt-1.5" [class.invalid]="bad('date')" type="date" [min]="today" formControlName="date" />@if (bad('date')) { <span class="mt-1 block text-rose-600">{{ 'Pick a date from today onward.' | t }}</span> }</label>
              <label class="block text-xs font-medium">{{ 'Time' | t }}<select class="field mt-1.5" formControlName="time">@for (t of times; track t) { <option [value]="t">{{ t | t }}</option> }</select></label>
            </div>
            <label class="block text-xs font-medium">{{ 'Notes (allergies, seating requests)' | t }}<textarea class="field mt-1.5" rows="3" formControlName="notes"></textarea></label>
            <button type="submit" class="w-full rounded-lg bg-brand py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark hover:shadow-lg active:scale-[.98]">{{ 'Confirm Reservation' | t }}</button>
          </form>
        }
      </div>

      <aside class="space-y-6">
        <div appReveal class="rounded-3xl bg-card p-6">
          <h3 class="text-xl">{{ 'Good to know' | t }}</h3>
          <ul class="mt-4 space-y-3 text-sm text-fg/70">
            <li class="flex gap-3"><app-icon name="clock" [size]="18"/>{{ 'Tables are held for 15 minutes.' | t }}</li>
            <li class="flex gap-3"><app-icon name="users" [size]="18"/>{{ 'For parties over 12, contact us for a private room.' | t }}</li>
            <li class="flex gap-3"><app-icon name="sparkle" [size]="18"/>{{ 'Tell us about allergies and we will plan around them.' | t }}</li>
          </ul>
        </div>
        <div appReveal [delay]="100" class="rounded-3xl bg-card p-6">
          <h3 class="text-xl">{{ 'Your bookings' | t }}</h3>
          @if (bookings.bookings().length) {
            <ul class="mt-4 space-y-3">
              @for (b of bookings.bookings().slice(0, 4); track b.code) {
                <li class="animate-pop rounded-xl bg-card-2 p-3 text-sm transition hover:ring-1 hover:ring-brand/50"><span class="font-display text-brand">{{ b.code }}</span><span class="block text-fg/70">{{ b.date }}, {{ b.time | t }} · {{ b.guests }} {{ 'guests' | t }}</span></li>
              }
            </ul>
          } @else { <p class="mt-3 text-sm text-fg/50">{{ 'Nothing booked yet. Your reservations will appear here.' | t }}</p> }
        </div>
      </aside>
    </section>`,
})
export class Reserve {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private i18n = inject(I18n);
  bookings = inject(BookingService);
  locations = LOCATIONS; times = TIMES;
  guestOpts = Array.from({ length: 12 }, (_, i) => String(i + 1));
  today = new Date().toISOString().slice(0, 10);
  done = signal<Booking | null>(null);
  private q = this.route.snapshot.queryParamMap;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+()\d\s-]{7,}$/)]],
    occasion: ['None'],
    location: [this.pick(this.q.get('location'), LOCATIONS, LOCATIONS[0])],
    guests: [this.pick(this.q.get('guests'), this.guestOpts, '2')],
    date: [this.q.get('date') && this.q.get('date')! >= this.today ? this.q.get('date')! : this.today, Validators.required],
    time: [this.pick(this.q.get('time'), TIMES, '7:00 PM')],
    notes: [''],
  });

  private pick(v: string | null, list: string[], fb: string) { return v && list.includes(v) ? v : fb; }
  bad(n: keyof typeof this.form.controls) { const c = this.form.controls[n]; return c.invalid && (c.touched || c.dirty); }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.controls.date.value < this.today) this.form.controls.date.setErrors({ past: true });
    if (this.form.invalid) { this.toast.show(this.i18n.t('Please fix the highlighted fields')); return; }
    const b = this.bookings.create(this.form.getRawValue());
    this.done.set(b);
    this.toast.show(this.i18n.t('Table booked. Code {code}', { code: b.code }));
    this.form.reset({ ...this.form.getRawValue(), name: '', email: '', phone: '', notes: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
