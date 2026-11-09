import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, OrderService, ToastService } from '../core/services';
import { I18n, T } from '../core/i18n';
import { Cta } from '../shared/cta';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

@Component({
  selector: 'app-cart',
  imports: [ReactiveFormsModule, RouterLink, PageHero, Cta, Icon, T],
  template: `
    <app-page-hero title="Your order" subtitle="Review your dishes and tell us where to deliver them."/>
    <section class="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      @if (placed(); as id) {
        <div class="mx-auto max-w-lg animate-pop rounded-3xl bg-card p-10 text-center">
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-brand"><app-icon name="check" [size]="30" [stroke]="2.5"/></span>
          <h2 class="mt-5 text-3xl">{{ 'Order placed' | t }}</h2>
          <p class="mt-2 text-sm text-fg/60">{{ 'Order' | t }} <b class="text-brand">{{ id }}</b> {{ 'is being prepared. Estimated arrival: 35-45 minutes.' | t }}</p>
          <div class="mt-8 flex flex-wrap justify-center gap-3"><app-cta label="Track My Order" link="/orders"/><app-cta label="Back to Menu" link="/menu"/></div>
        </div>
      } @else if (!cart.lines().length) {
        <div class="py-16 text-center">
          <p class="font-display text-3xl">{{ 'Your order is empty' | t }}</p><p class="mt-2 text-sm text-fg/60">{{ 'Add a dish or two and it will show up here.' | t }}</p>
          <div class="mt-7"><app-cta label="Browse Menu" link="/menu"/></div>
        </div>
      } @else {
        <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ul class="space-y-4">
            @for (l of cart.lines(); track l.dish.id) {
              <li class="flex animate-pop items-center gap-4 rounded-2xl bg-card p-4 transition hover:bg-card-2">
                <a [routerLink]="['/menu', l.dish.id]"><img [src]="l.dish.image" [alt]="l.dish.name" class="size-20 rounded-full object-cover transition hover:scale-105 sm:size-24" /></a>
                <div class="min-w-0 flex-1">
                  <a [routerLink]="['/menu', l.dish.id]" class="font-display text-lg hover:text-brand sm:text-xl">{{ l.dish.name | t }}</a>
                  <p class="text-sm text-fg/50">\${{ l.dish.price }} {{ 'each' | t }}</p>
                  <div class="mt-2 flex w-fit items-center rounded-full border border-line">
                    <button class="grid size-8 place-items-center transition hover:text-brand active:scale-75" [attr.aria-label]="'Decrease' | t" (click)="cart.setQty(l.dish.id, l.qty - 1)"><app-icon name="minus" [size]="14"/></button>
                    <span class="w-6 text-center text-sm">{{ l.qty }}</span>
                    <button class="grid size-8 place-items-center transition hover:text-brand active:scale-75" [attr.aria-label]="'Increase' | t" (click)="cart.setQty(l.dish.id, l.qty + 1)"><app-icon name="plus" [size]="14"/></button>
                  </div>
                </div>
                <div class="text-end"><p class="font-display text-xl">\${{ l.dish.price * l.qty }}</p>
                  <button class="mt-2 text-fg/40 transition hover:text-rose-400" [attr.aria-label]="'Remove' | t" (click)="cart.remove(l.dish.id)"><app-icon name="trash" [size]="18"/></button></div>
              </li>
            }
          </ul>

          <form [formGroup]="form" (ngSubmit)="place()" novalidate class="h-fit space-y-4 rounded-3xl bg-card p-6 lg:sticky lg:top-28">
            <h2 class="text-2xl">{{ 'Checkout' | t }}</h2>
            <input class="field field-dark" [class.invalid]="bad('name')" [placeholder]="'Full name' | t" [attr.aria-label]="'Full name' | t" formControlName="name" />
            <input class="field field-dark" [class.invalid]="bad('phone')" type="tel" [placeholder]="'Phone' | t" [attr.aria-label]="'Phone' | t" formControlName="phone" />
            <input class="field field-dark" [class.invalid]="bad('address')" [placeholder]="'Delivery address' | t" [attr.aria-label]="'Address' | t" formControlName="address" />
            <div class="grid grid-cols-2 gap-2 text-sm">
              @for (p of ['Card', 'Cash']; track p) {
                <label class="cursor-pointer rounded-lg border border-line px-3 py-2.5 text-center transition has-[:checked]:border-brand has-[:checked]:bg-brand/15 hover:border-brand/60"><input type="radio" class="sr-only" formControlName="pay" [value]="p"/>{{ p | t }}</label>
              }
            </div>
            <dl class="space-y-2 border-t border-line pt-4 text-sm text-fg/70">
              <div class="flex justify-between"><dt>{{ 'Subtotal' | t }}</dt><dd>\${{ cart.subtotal().toFixed(2) }}</dd></div>
              <div class="flex justify-between"><dt>{{ 'Tax (8.875%)' | t }}</dt><dd>\${{ tax().toFixed(2) }}</dd></div>
              <div class="flex justify-between"><dt>{{ 'Delivery' | t }}</dt><dd>{{ delivery() ? '$' + delivery().toFixed(2) : ('Free' | t) }}</dd></div>
              <div class="flex justify-between border-t border-line pt-3 font-display text-xl text-fg"><dt>{{ 'Total' | t }}</dt><dd>\${{ total().toFixed(2) }}</dd></div>
            </dl>
            <app-cta label="Place Order" type="submit" size="lg" [block]="true"/>
            <button type="button" class="w-full text-center text-xs text-fg/40 transition hover:text-rose-400" (click)="cart.clear()">{{ 'Clear order' | t }}</button>
          </form>
        </div>
      }
    </section>`,
})
export class Cart {
  cart = inject(CartService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private orders = inject(OrderService);
  private i18n = inject(I18n);
  placed = signal<string | null>(null);
  tax = computed(() => this.cart.subtotal() * 0.08875);
  delivery = computed(() => this.cart.subtotal() >= 100 ? 0 : 6);
  total = computed(() => this.cart.subtotal() + this.tax() + this.delivery());
  form = this.fb.nonNullable.group({
    name: ['', Validators.required], phone: ['', [Validators.required, Validators.pattern(/^[+()\d\s-]{7,}$/)]],
    address: ['', [Validators.required, Validators.minLength(6)]], pay: ['Card'],
  });
  bad(n: 'name' | 'phone' | 'address') { const c = this.form.controls[n]; return c.invalid && (c.touched || c.dirty); }
  place() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.toast.show(this.i18n.t('Add your delivery details to continue')); return; }
    const v = this.form.getRawValue();
    const o = this.orders.place({ name: v.name, phone: v.phone, address: v.address, pay: v.pay, subtotal: this.cart.subtotal(), tax: this.tax(), delivery: this.delivery(), total: this.total() }, this.cart.lines());
    this.placed.set(o.id);
    this.cart.clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
