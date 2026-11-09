import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reveal } from '../core/directives';
import { ToastService } from '../core/services';
import { Cta } from '../shared/cta';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

import { T, I18n } from '../core/i18n';
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, PageHero, Cta, Icon, Reveal, T],
  template: `
    <app-page-hero title="Get in touch" subtitle="Questions, special requests or press enquiries. We reply within one working day."/>
    <section class="mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
      <div class="space-y-4">
        @for (c of info; track c.label; let i = $index) {
          <a appReveal [delay]="i * 80" [href]="c.href" class="group flex items-center gap-4 rounded-2xl bg-card p-5 transition duration-300 hover:-translate-y-1 hover:bg-card-2 hover:shadow-[0_15px_40px_-20px_rgb(242_107_13/.5)]">
            <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-brand transition group-hover:rotate-6"><app-icon [name]="c.icon"/></span>
            <span class="min-w-0"><span class="block text-xs text-fg/50">{{ c.label | t }}</span><span class="block break-words">{{ c.value | t }}</span></span>
          </a>
        }
        <div appReveal [delay]="300" class="rounded-2xl bg-card p-5">
          <div class="flex items-center justify-between"><h3 class="text-xl">{{ 'Opening hours' | t }}</h3>
            <span class="flex items-center gap-2 text-xs" [class]="isOpen ? 'text-emerald-400' : 'text-rose-400'"><span class="size-2 animate-pulse rounded-full bg-current"></span>{{ (isOpen ? 'Open now' : 'Closed now') | t }}</span></div>
          <ul class="mt-4 space-y-1.5 text-sm">
            @for (d of days; track d; let i = $index) {
              <li class="flex justify-between rounded-lg px-3 py-1.5" [class]="i === todayIdx ? 'bg-brand/15 text-brand' : 'text-fg/70'"><span>{{ d | t }}</span><span>12:00 PM - 11:30 PM</span></li>
            }
          </ul>
        </div>
      </div>

      <div appReveal="right">
        @if (sent()) {
          <div class="animate-pop rounded-3xl bg-card p-10 text-center">
            <span class="mx-auto grid size-16 place-items-center rounded-full bg-brand"><app-icon name="check" [size]="30" [stroke]="2.5"/></span>
            <h2 class="mt-5 text-3xl">{{ 'Message sent' | t }}</h2><p class="mt-2 text-sm text-fg/60">{{ "Thank you. We'll get back to you shortly." | t }}</p>
            <div class="mt-8"><app-cta label="Send Another" (pressed)="sent.set(false)"/></div>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="space-y-4 rounded-3xl bg-white p-6 text-neutral-900 shadow-2xl sm:p-8">
            <h2 class="font-display text-2xl">{{ 'Send us a message' | t }}</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-xs font-medium">{{ 'Name' | t }}<input class="field mt-1.5" [class.invalid]="bad('name')" formControlName="name" />@if (bad('name')) { <span class="mt-1 block text-rose-600">{{ 'Please enter your name.' | t }}</span> }</label>
              <label class="block text-xs font-medium">{{ 'Email' | t }}<input class="field mt-1.5" [class.invalid]="bad('email')" type="email" formControlName="email" />@if (bad('email')) { <span class="mt-1 block text-rose-600">{{ 'Enter a valid email.' | t }}</span> }</label>
            </div>
            <label class="block text-xs font-medium">{{ 'Subject' | t }}<select class="field mt-1.5" formControlName="subject"><option value="General question">{{ 'General question' | t }}</option><option value="Private event">{{ 'Private event' | t }}</option><option value="Feedback">{{ 'Feedback' | t }}</option><option value="Press">{{ 'Press' | t }}</option></select></label>
            <label class="block text-xs font-medium">{{ 'Message' | t }}<textarea class="field mt-1.5" [class.invalid]="bad('message')" rows="5" formControlName="message"></textarea>
              <span class="mt-1 flex justify-between"><span class="text-rose-600">{{ bad('message') ? ('Write at least 10 characters.' | t) : '' }}</span><span class="text-neutral-400">{{ form.controls.message.value.length }}/500</span></span></label>
            <button type="submit" class="w-full rounded-lg bg-brand py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark hover:shadow-lg active:scale-[.98]">{{ 'Send Message' | t }}</button>
          </form>
        }
      </div>
    </section>`,
})
export class Contact {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private i18n = inject(I18n);
  sent = signal(false);
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  todayIdx = (new Date().getDay() + 6) % 7;
  isOpen = (() => { const h = new Date().getHours() + new Date().getMinutes() / 60; return h >= 12 && h < 23.5; })();
  info = [
    { icon: 'pin', label: 'Address', value: '123 Culinary Avenue, New York, NY', href: 'https://maps.google.com/?q=123+Culinary+Avenue+New+York' },
    { icon: 'phone', label: 'Phone', value: '+1 (800) 555-1234', href: 'tel:+18005551234' },
    { icon: 'mail', label: 'Email', value: 'reservations@savorelle.com', href: 'mailto:reservations@savorelle.com' },
  ];
  form = this.fb.nonNullable.group({
    name: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
    subject: ['General question'], message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });
  bad(n: keyof typeof this.form.controls) { const c = this.form.controls[n]; return c.invalid && (c.touched || c.dirty); }
  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.toast.show(this.i18n.t('Please fix the highlighted fields')); return; }
    this.sent.set(true); this.form.reset({ subject: 'General question' });
    this.toast.show(this.i18n.t('Message sent. Thank you!'));
  }
}
