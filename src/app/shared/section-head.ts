import { Component, input } from '@angular/core';
import { Reveal } from '../core/directives';
import { T } from '../core/i18n';

@Component({
  selector: 'app-section-head',
  imports: [Reveal, T],
  template: `
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <h2 appReveal class="max-w-lg text-4xl leading-tight sm:text-5xl"><ng-content /></h2>
      @if (sub()) { <p appReveal [delay]="150" class="max-w-xs text-sm leading-relaxed text-fg/60">{{ sub() | t }}</p> }
    </div>`,
  host: { class: 'block' },
})
export class SectionHead { readonly sub = input(''); }
