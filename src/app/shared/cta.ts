import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from './icon';
import { T } from '../core/i18n';

@Component({
  selector: 'app-cta',
  imports: [RouterLink, Icon, NgTemplateOutlet, T],
  template: `
    <ng-template #inner>
      <span class="ps-1">{{ label() | t }}</span>
      <span class="grid place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 rtl:-scale-x-100"
            [class]="size() === 'lg' ? 'size-9' : 'size-7'"><app-icon name="arrow" [size]="size() === 'lg' ? 16 : 14"/></span>
    </ng-template>
    @if (link()) {
      <a [routerLink]="link()" [queryParams]="params()" [class]="cls()" (click)="pressed.emit()"><ng-container *ngTemplateOutlet="inner"/></a>
    } @else {
      <button [type]="type()" [disabled]="disabled()" [class]="cls()" (click)="pressed.emit()"><ng-container *ngTemplateOutlet="inner"/></button>
    }
  `,
  host: { class: 'inline-block' },
})
export class Cta {
  readonly label = input.required<string>();
  readonly link = input<string | null>(null);
  readonly params = input<Record<string, string> | undefined>(undefined);
  readonly size = input<'sm' | 'lg'>('sm');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly block = input(false);
  readonly pressed = output<void>();
  cls() {
    return 'sheen group relative inline-flex items-center gap-3 rounded-full bg-brand font-medium text-white shadow-[0_0_0_0_rgb(242_107_13/.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_10px_30px_-8px_rgb(242_107_13/.7)] active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ' +
      (this.size() === 'lg' ? 'p-1.5 ps-5 text-base ' : 'p-1 ps-4 text-sm ') + (this.block() ? 'w-full justify-between' : '');
  }
}
