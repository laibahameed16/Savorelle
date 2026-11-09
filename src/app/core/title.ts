import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18n } from './i18n';

/** Page titles follow the selected language. */
@Injectable({ providedIn: 'root' })
export class AppTitle extends TitleStrategy {
  private title = inject(Title);
  private i18n = inject(I18n);
  private current = signal('Savorelle | Fine Dining');
  constructor() {
    super();
    effect(() => this.title.setTitle(this.i18n.t(this.current())));
  }
  override updateTitle(state: RouterStateSnapshot) { this.current.set(this.buildTitle(state) ?? 'Savorelle | Fine Dining'); }
}
