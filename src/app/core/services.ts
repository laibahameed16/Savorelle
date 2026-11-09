import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Dish } from './data';
import { I18n } from './i18n';

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

export interface CartLine { dish: Dish; qty: number; }
export interface Toast { id: number; message: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private n = 0;
  show(message: string) {
    const id = ++this.n;
    this.toasts.update(t => [...t, { id, message }]);
    setTimeout(() => this.dismiss(id), 3200);
  }
  dismiss(id: number) { this.toasts.update(t => t.filter(x => x.id !== id)); }
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly lines = signal<CartLine[]>(load<CartLine[]>('sv-cart', []));
  readonly count = computed(() => this.lines().reduce((s, l) => s + l.qty, 0));
  readonly subtotal = computed(() => this.lines().reduce((s, l) => s + l.qty * l.dish.price, 0));
  readonly bump = signal(0);
  private i18n = inject(I18n);
  constructor(private toast: ToastService) { effect(() => save('sv-cart', this.lines())); }

  add(dish: Dish, qty = 1, silent = false) {
    this.lines.update(ls => {
      const found = ls.find(l => l.dish.id === dish.id);
      return found ? ls.map(l => l.dish.id === dish.id ? { ...l, qty: l.qty + qty } : l) : [...ls, { dish, qty }];
    });
    this.bump.update(b => b + 1);
    if (!silent) this.toast.show(this.i18n.t('{name} added to your order', { name: this.i18n.t(dish.name) }));
  }
  setQty(id: string, qty: number) {
    this.lines.update(ls => qty <= 0 ? ls.filter(l => l.dish.id !== id) : ls.map(l => l.dish.id === id ? { ...l, qty } : l));
  }
  remove(id: string) { this.setQty(id, 0); }
  clear() { this.lines.set([]); }
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly ids = signal<string[]>(load<string[]>('sv-favs', []));
  private i18n = inject(I18n);
  constructor(private toast: ToastService) { effect(() => save('sv-favs', this.ids())); }
  has(id: string) { return this.ids().includes(id); }
  toggle(dish: Dish) {
    const on = this.has(dish.id);
    this.ids.update(a => on ? a.filter(x => x !== dish.id) : [...a, dish.id]);
    this.toast.show(this.i18n.t(on ? '{name} removed from favorites' : '{name} saved to favorites', { name: this.i18n.t(dish.name) }));
  }
}

export interface Booking {
  code: string; name: string; email: string; phone: string; location: string;
  guests: string; date: string; time: string; occasion: string; notes: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly bookings = signal<Booking[]>(load<Booking[]>('sv-bookings', []));
  constructor() { effect(() => save('sv-bookings', this.bookings())); }
  create(b: Omit<Booking, 'code'>): Booking {
    const code = 'SV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const booking = { ...b, code };
    this.bookings.update(a => [booking, ...a]);
    return booking;
  }
}

/* ---------------------------------------------------------------- orders */
export type OrderStatus = 'received' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
export interface OrderLine { id: string; name: string; image: string; price: number; qty: number; }
export interface Order {
  id: string; placedAt: number; lines: OrderLine[];
  name: string; phone: string; address: string; pay: string;
  subtotal: number; tax: number; delivery: number; total: number;
  cancelled?: boolean;
}

/** Demo timeline (seconds after placing): received -> preparing -> on the way -> delivered. */
const STAGES = [0, 45, 150, 300];

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly orders = signal<Order[]>(load<Order[]>('sv-orders', []));
  /** ticks so statuses advance on their own */
  readonly now = signal(Date.now());
  constructor() {
    effect(() => save('sv-orders', this.orders()));
    if (typeof window !== 'undefined') setInterval(() => this.now.set(Date.now()), 4000);
  }

  stepOf(o: Order): number {
    const sec = (this.now() - o.placedAt) / 1000;
    let step = 0;
    STAGES.forEach((t, i) => { if (sec >= t) step = i; });
    return step;
  }
  statusOf(o: Order): OrderStatus {
    if (o.cancelled) return 'cancelled';
    return (['received', 'preparing', 'on-the-way', 'delivered'] as const)[this.stepOf(o)];
  }
  readonly active = computed(() => this.orders().filter(o => { const s = this.statusOf(o); return s !== 'delivered' && s !== 'cancelled'; }));
  readonly spent = computed(() => this.orders().filter(o => !o.cancelled).reduce((s, o) => s + o.total, 0));

  place(d: Pick<Order, 'name' | 'phone' | 'address' | 'pay' | 'subtotal' | 'tax' | 'delivery' | 'total'>, lines: CartLine[]): Order {
    const order: Order = {
      ...d, id: '#SV' + Math.floor(10000 + Math.random() * 89999), placedAt: Date.now(),
      lines: lines.map(l => ({ id: l.dish.id, name: l.dish.name, image: l.dish.image, price: l.dish.price, qty: l.qty })),
    };
    this.orders.update(a => [order, ...a]);
    return order;
  }
  cancel(id: string) { this.orders.update(a => a.map(o => o.id === id ? { ...o, cancelled: true } : o)); }
  remove(id: string) { this.orders.update(a => a.filter(o => o.id !== id)); }
  clearHistory() { this.orders.update(a => a.filter(o => { const s = this.statusOf(o); return s !== 'delivered' && s !== 'cancelled'; })); }
}
