import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DISHES } from '../core/data';
import { I18n, T } from '../core/i18n';
import { CartService, Order, OrderService, ToastService } from '../core/services';
import { Cta } from '../shared/cta';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';

type Filter = 'all' | 'active' | 'delivered' | 'cancelled';

@Component({
  selector: 'app-orders',
  imports: [PageHero, Cta, Icon, T],
  template: `
    <app-page-hero title="My Orders" subtitle="Track your meals, reorder your favourites and see everything you have ordered."/>
    <section class="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
      @if (svc.orders().length) {
        <!-- summary -->
        <div class="grid gap-4 sm:grid-cols-3">
          @for (s of stats(); track s.label; let i = $index) {
            <div class="animate-pop flex items-center gap-4 rounded-3xl bg-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgb(242_107_13/.5)]" [style.animation-delay]="i * 90 + 'ms'">
              <span class="grid size-12 place-items-center rounded-2xl bg-brand"><app-icon [name]="s.icon"/></span>
              <div><p class="text-xs text-fg/50">{{ s.label | t }}</p><p class="font-display text-3xl leading-tight">{{ s.value }}</p></div>
            </div>
          }
        </div>

        <!-- filters -->
        <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div class="no-scrollbar flex gap-2 overflow-x-auto" role="tablist">
            @for (f of filters; track f.key) {
              <button role="tab" [attr.aria-selected]="filter() === f.key" (click)="filter.set(f.key)"
                class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition duration-300 active:scale-95"
                [class]="filter() === f.key ? 'border-brand bg-brand text-white' : 'border-line text-fg/70 hover:border-brand/60 hover:text-fg'">
                {{ f.label | t }}<span class="rounded-full bg-black/20 px-1.5 text-[11px]">{{ count(f.key) }}</span>
              </button>
            }
          </div>
          @if (finished() > 0) {
            <button class="flex items-center gap-2 text-xs text-fg/50 transition hover:text-rose-400" (click)="clear()"><app-icon name="trash" [size]="14"/>{{ 'Clear history' | t }}</button>
          }
        </div>

        <!-- list -->
        @if (list().length) {
          <ul class="mt-6 space-y-4">
            @for (o of list(); track o.id; let i = $index) {
              <li class="animate-fade-up overflow-hidden rounded-3xl bg-card transition-shadow duration-300 hover:shadow-[0_18px_44px_-26px_rgb(242_107_13/.55)]" [style.animation-delay]="(i % 6) * 70 + 'ms'">
                <button type="button" class="flex w-full flex-wrap items-center gap-x-4 gap-y-3 p-4 text-start sm:p-5" [attr.aria-expanded]="open() === o.id" (click)="toggle(o.id)">
                  <span class="flex items-center ps-3">
                    @for (l of o.lines.slice(0, 3); track l.id) {
                      <img [src]="l.image" [alt]="l.name" loading="lazy" class="-ms-3 size-12 rounded-full object-cover ring-2 ring-card sm:size-14" />
                    }
                    @if (o.lines.length > 3) { <span class="-ms-3 grid size-12 place-items-center rounded-full bg-card-2 text-xs ring-2 ring-card sm:size-14">+{{ o.lines.length - 3 }}</span> }
                  </span>
                  <span class="min-w-0 flex-1 basis-40">
                    <span class="block font-display text-lg">{{ o.id }}</span>
                    <span class="block text-xs text-fg/50">{{ fmt(o.placedAt) }} · {{ qty(o) }} {{ (qty(o) === 1 ? 'item' : 'items') | t }}</span>
                  </span>
                  <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium" [class]="badge(o)">
                    <span class="size-2 rounded-full bg-current" [class.animate-pulse]="isActive(o)"></span>{{ label(o) | t }}
                  </span>
                  <span class="font-display text-xl">\${{ o.total.toFixed(2) }}</span>
                  <span class="text-fg/50 transition-transform duration-300" [class.rotate-180]="open() === o.id"><app-icon name="down"/></span>
                </button>

                <div class="grid transition-[grid-template-rows] duration-500 ease-out" [style.grid-template-rows]="open() === o.id ? '1fr' : '0fr'">
                  <div class="min-h-0 overflow-hidden">
                    <div class="border-t border-line p-4 sm:p-6">
                      @if (status(o) === 'cancelled') {
                        <p class="flex items-center gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-400"><app-icon name="ban"/>{{ 'This order was cancelled.' | t }}</p>
                      } @else {
                        <div class="relative px-1 pb-2 pt-1">
                          <div class="absolute end-6 start-6 top-[1.35rem] h-1 rounded-full bg-line"></div>
                          <div class="absolute start-6 top-[1.35rem] h-1 rounded-full bg-brand transition-[width] duration-1000 ease-out" [class.bar-live]="step(o) < 3" [style.width]="'calc((100% - 3rem) * ' + step(o) / 3 + ')'"></div>
                          <ol class="relative flex justify-between">
                            @for (st of steps; track st.label; let k = $index) {
                              <li class="flex w-20 flex-col items-center text-center sm:w-24">
                                <span class="relative grid size-11 place-items-center rounded-full border-2 transition-all duration-500"
                                  [class]="k < step(o) || step(o) === 3 ? 'border-brand bg-brand text-white' : k === step(o) ? 'scale-110 border-brand bg-card text-brand' : 'border-line bg-card text-fg/40'">
                                  @if (k === step(o) && step(o) < 3) { <span class="ping-soft absolute inset-0 rounded-full text-brand"></span> }
                                  <span class="relative"><app-icon [name]="st.icon" [size]="18"/></span>
                                </span>
                                <span class="mt-2 text-[11px] leading-tight sm:text-xs" [class]="k <= step(o) ? 'text-fg' : 'text-fg/40'">{{ st.label | t }}</span>
                              </li>
                            }
                          </ol>
                        </div>
                        <p class="mt-4 text-center text-sm text-fg/60">{{ steps[step(o)].hint | t }}</p>
                      }

                      <div class="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                        <ul class="divide-y divide-line rounded-2xl bg-card-2 px-4">
                          @for (l of o.lines; track l.id) {
                            <li class="flex items-center gap-3 py-3">
                              <img [src]="l.image" [alt]="l.name" loading="lazy" class="size-12 rounded-full object-cover" />
                              <div class="min-w-0 flex-1"><p class="truncate font-display">{{ l.name | t }}</p><p class="text-xs text-fg/50">\${{ l.price }} × {{ l.qty }}</p></div>
                              <p class="font-display">\${{ l.price * l.qty }}</p>
                            </li>
                          }
                        </ul>
                        <div class="space-y-4 text-sm">
                          <dl class="space-y-2 text-fg/70">
                            <div class="flex justify-between"><dt>{{ 'Subtotal' | t }}</dt><dd>\${{ o.subtotal.toFixed(2) }}</dd></div>
                            <div class="flex justify-between"><dt>{{ 'Tax (8.875%)' | t }}</dt><dd>\${{ o.tax.toFixed(2) }}</dd></div>
                            <div class="flex justify-between"><dt>{{ 'Delivery' | t }}</dt><dd>{{ o.delivery ? '$' + o.delivery.toFixed(2) : ('Free' | t) }}</dd></div>
                            <div class="flex justify-between border-t border-line pt-2 font-display text-lg text-fg"><dt>{{ 'Total' | t }}</dt><dd>\${{ o.total.toFixed(2) }}</dd></div>
                          </dl>
                          <ul class="space-y-2 rounded-2xl bg-card-2 p-4 text-fg/70">
                            <li class="flex gap-2"><span class="text-brand"><app-icon name="pin" [size]="16"/></span><span class="min-w-0 break-words">{{ o.address }}</span></li>
                            <li class="flex gap-2"><span class="text-brand"><app-icon name="phone" [size]="16"/></span><span dir="ltr">{{ o.phone }}</span></li>
                            <li class="flex gap-2"><span class="text-brand"><app-icon name="wallet" [size]="16"/></span><span>{{ o.pay | t }}</span></li>
                          </ul>
                        </div>
                      </div>

                      <div class="mt-6 flex flex-wrap items-center gap-3">
                        <app-cta label="Reorder" (pressed)="reorder(o)"/>
                        @if (cancellable(o)) {
                          <button class="rounded-full border border-line px-5 py-2 text-sm text-fg/70 transition hover:border-rose-400 hover:text-rose-400 active:scale-95" (click)="cancel(o)">{{ 'Cancel order' | t }}</button>
                        }
                        @if (!isActive(o)) {
                          <button class="ms-auto flex items-center gap-2 text-xs text-fg/40 transition hover:text-rose-400" (click)="remove(o)"><app-icon name="trash" [size]="14"/>{{ 'Remove' | t }}</button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            }
          </ul>
        } @else {
          <p class="animate-fade-up py-16 text-center text-fg/50">{{ 'Nothing in this tab yet.' | t }}</p>
        }
      } @else {
        <div class="mx-auto max-w-md animate-fade-up py-12 text-center">
          <span class="relative mx-auto grid size-28 animate-float place-items-center rounded-full bg-card text-brand"><span class="orb inset-0 size-full opacity-20"></span><span class="relative"><app-icon name="receipt" [size]="48" [stroke]="1.4"/></span></span>
          <h2 class="mt-8 text-3xl">{{ 'No orders yet' | t }}</h2>
          <p class="mt-2 text-sm text-fg/60">{{ 'Place your first order and it will appear here.' | t }}</p>
          <div class="mt-7"><app-cta label="Browse Menu" link="/menu"/></div>
        </div>
      }
    </section>`,
})
export class Orders {
  svc = inject(OrderService);
  private cart = inject(CartService);
  private toast = inject(ToastService);
  private i18n = inject(I18n);
  private router = inject(Router);

  filter = signal<Filter>('all');
  open = signal<string | null>(null);
  filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'delivered', label: 'Delivered' }, { key: 'cancelled', label: 'Cancelled' },
  ];
  steps = [
    { label: 'Order received', icon: 'check', hint: 'We have your order and the kitchen has been notified.' },
    { label: 'Preparing', icon: 'chef', hint: 'Our chefs are cooking your dishes right now.' },
    { label: 'On the way', icon: 'truck', hint: 'Your order is on its way to you.' },
    { label: 'Delivered', icon: 'gift', hint: 'Delivered. Enjoy your meal!' },
  ];

  stats = computed(() => [
    { label: 'Total orders', icon: 'receipt', value: String(this.svc.orders().length) },
    { label: 'Active now', icon: 'flame', value: String(this.svc.active().length) },
    { label: 'Total spent', icon: 'wallet', value: '$' + this.svc.spent().toFixed(2) },
  ]);
  list = computed(() => {
    const f = this.filter();
    return this.svc.orders().filter(o => f === 'all' || this.group(o) === f);
  });
  finished = computed(() => this.svc.orders().length - this.svc.active().length);

  step(o: Order) { return this.svc.stepOf(o); }
  status(o: Order) { return this.svc.statusOf(o); }
  isActive(o: Order) { const s = this.status(o); return s !== 'delivered' && s !== 'cancelled'; }
  cancellable(o: Order) { return !o.cancelled && this.step(o) <= 1; }
  group(o: Order): Filter { const s = this.status(o); return s === 'delivered' ? 'delivered' : s === 'cancelled' ? 'cancelled' : 'active'; }
  count(f: Filter) { return f === 'all' ? this.svc.orders().length : this.svc.orders().filter(o => this.group(o) === f).length; }
  qty(o: Order) { return o.lines.reduce((s, l) => s + l.qty, 0); }
  label(o: Order) {
    return ({ received: 'Order received', preparing: 'Preparing', 'on-the-way': 'On the way', delivered: 'Delivered', cancelled: 'Cancelled' })[this.status(o)];
  }
  badge(o: Order) {
    return ({ received: 'bg-sky-500/15 text-sky-500', preparing: 'bg-amber-500/15 text-amber-500', 'on-the-way': 'bg-violet-500/15 text-violet-500',
      delivered: 'bg-emerald-500/15 text-emerald-500', cancelled: 'bg-rose-500/15 text-rose-500' })[this.status(o)];
  }
  fmt(ts: number) { return this.i18n.date(ts, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  toggle(id: string) { this.open.set(this.open() === id ? null : id); }

  reorder(o: Order) {
    for (const l of o.lines) { const d = DISHES.find(x => x.id === l.id); if (d) this.cart.add(d, l.qty, true); }
    this.toast.show(this.i18n.t('Items added to your order'));
    this.router.navigate(['/cart']);
  }
  cancel(o: Order) { this.svc.cancel(o.id); this.toast.show(this.i18n.t('Order cancelled')); }
  remove(o: Order) { this.svc.remove(o.id); }
  clear() { this.svc.clearHistory(); }
}
