import { Injectable, Pipe, PipeTransform, computed, effect, inject, signal } from '@angular/core';
import { DICT } from './dict';

export type Lang = 'en' | 'ar' | 'zh';
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'ع' },
  { code: 'zh', label: '中文', short: '中' },
];

function initial(): Lang {
  try {
    const s = localStorage.getItem('sv-lang');
    if (s === 'en' || s === 'ar' || s === 'zh') return s;
    const n = (navigator.language || 'en').toLowerCase();
    if (n.startsWith('ar')) return 'ar';
    if (n.startsWith('zh')) return 'zh';
  } catch { /* ignore */ }
  return 'en';
}

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>(initial());
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly rtl = computed(() => this.lang() === 'ar');
  /** locale used for dates */
  readonly locale = computed(() => ({ en: 'en-US', ar: 'ar-u-nu-latn', zh: 'zh-CN' })[this.lang()]);

  constructor() {
    effect(() => {
      const l = this.lang();
      const d = document.documentElement;
      d.lang = l;
      d.dir = this.dir();
      try { localStorage.setItem('sv-lang', l); } catch { /* ignore */ }
    });
  }

  set(l: Lang) { this.lang.set(l); }

  /** Translate an English key. `{name}` placeholders are filled from params. */
  t(key: string, params?: Record<string, string | number>): string {
    const l = this.lang();
    let s = key;
    if (l !== 'en') {
      const e = DICT[key];
      if (e) s = e[l === 'ar' ? 0 : 1] || key;
    }
    if (params) for (const k of Object.keys(params)) s = s.split('{' + k + '}').join(String(params[k]));
    return s;
  }

  date(ts: number | string | Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
    return new Intl.DateTimeFormat(this.locale(), opts).format(new Date(ts));
  }
}

/** {{ 'English text' | t }} - impure so it re-evaluates when the language signal changes. */
@Pipe({ name: 't', pure: false })
export class T implements PipeTransform {
  private i18n = inject(I18n);
  transform(key: string | null | undefined, params?: Record<string, string | number>): string {
    return key == null ? '' : this.i18n.t(key, params);
  }
}
