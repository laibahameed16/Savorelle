import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { T } from '../core/i18n';
import { CartService, OrderService } from '../core/services';
import { Icon } from './icon';
import { Cta } from './cta';
import { LangSwitch } from './lang-switch';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon, Cta, T, LangSwitch, ThemeToggle],
  template: `
    <header class="fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color] duration-300" [class]="scrolled() || open() ? 'bg-bg/95 border-b border-line py-3' : 'py-5'">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 sm:px-8" [attr.aria-label]="'Main' | t">
        <a routerLink="/" class="group flex items-center gap-2 font-display text-xl tracking-wide transition hover:text-brand">
          <span class="grid size-8 place-items-center rounded-full bg-brand text-white transition duration-500 group-hover:rotate-[360deg]"><app-icon name="utensils" [size]="16"/></span>Savorelle
        </a>

        <ul class="hidden items-center gap-4 whitespace-nowrap text-[12.5px] lg:flex xl:gap-6 xl:text-[13px] 2xl:gap-9">
          @for (l of links; track l.path) {
            <li><a [routerLink]="l.path" routerLinkActive="text-brand after:scale-x-100" [routerLinkActiveOptions]="{ exact: l.path === '/' }"
                class="relative pb-1 transition-colors hover:text-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100 rtl:after:origin-right">{{ l.label | t }}@if (l.path === '/orders' && orders.active().length) { <span class="ms-1.5 inline-grid size-4 place-items-center rounded-full bg-amber-500 text-[10px] font-semibold text-black">{{ orders.active().length }}</span> }</a></li>
          }
        </ul>

        <div class="flex items-center gap-2 sm:gap-3">
          <app-lang-switch />
          <app-theme-toggle />
          <a routerLink="/orders" class="relative hidden size-10 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand sm:grid lg:hidden" [attr.aria-label]="'My Orders' | t">
            <app-icon name="receipt" [size]="18"/>
            @if (orders.active().length > 0) {
              <span class="absolute -end-1 -top-1 grid size-5 animate-pop place-items-center rounded-full bg-amber-500 text-[11px] font-semibold text-black"><span class="ping-soft absolute inset-0 rounded-full text-amber-500"></span><span class="relative">{{ orders.active().length }}</span></span>
            }
          </a>
          <a routerLink="/cart" class="relative grid size-9 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand sm:size-10" [attr.aria-label]="'Open your order' | t">
            <app-icon name="cart" [size]="18"/>
            @if (cart.count() > 0) {
              @for (k of [cart.bump()]; track k) {
                <span class="absolute -end-1 -top-1 grid size-5 animate-pop place-items-center rounded-full bg-brand text-[11px] font-semibold text-white">{{ cart.count() }}</span>
              }
            }
          </a>
          <span class="hidden min-[1500px]:inline-block"><app-cta label="Order Now" link="/menu"/></span>
          <button class="grid size-9 place-items-center rounded-full border border-line sm:size-10 lg:hidden" (click)="open.set(!open())" [attr.aria-expanded]="open()" [attr.aria-label]="'Toggle menu' | t">
            <app-icon [name]="open() ? 'close' : 'menu'"/>
          </button>
        </div>
      </nav>

      <div class="grid overflow-hidden transition-[grid-template-rows] duration-500 lg:hidden" [style.grid-template-rows]="open() ? '1fr' : '0fr'">
        <ul class="max-h-[calc(100dvh-4.5rem)] min-h-0 overflow-y-auto px-5">
          @for (l of mobileLinks; track l.path; let i = $index) {
            <li class="border-b border-line/60">
              <a [routerLink]="l.path" routerLinkActive="text-brand" [routerLinkActiveOptions]="{ exact: l.path === '/' }"
                 class="flex items-center justify-between py-4 font-display text-2xl transition-all duration-500" [class]="open() ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 rtl:translate-x-4'" [style.transition-delay]="open() ? i * 50 + 'ms' : '0ms'">
                {{ l.label | t }}
                @if (l.path === '/orders' && orders.active().length) { <span class="rounded-full bg-amber-500 px-2 py-0.5 font-body text-xs text-black">{{ orders.active().length }}</span> }
              </a>
            </li>
          }
          <li class="py-5"><app-cta label="Order Now" link="/menu" size="lg"/></li>
        </ul>
      </div>
    </header>`,
})
export class Navbar {
  cart = inject(CartService);
  orders = inject(OrderService);
  open = signal(false);
  scrolled = signal(false);
  links = [
    { path: '/', label: 'Home' }, { path: '/menu', label: 'Menu' }, { path: '/about', label: 'About Us' },
    { path: '/experiences', label: 'Experiences' }, { path: '/gallery', label: 'Gallery' },
    { path: '/reserve', label: 'Reservations' }, { path: '/orders', label: 'My Orders' }, { path: '/contact', label: 'Contact' },
  ];
  mobileLinks = this.links;
  constructor() {
    inject(Router).events.subscribe(e => { if (e instanceof NavigationEnd) this.open.set(false); });
    effect(() => { document.body.style.overflow = this.open() ? 'hidden' : ''; });
    this.onScroll();
  }
  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 24); }
}
