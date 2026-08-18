import { Injectable, signal } from '@angular/core';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'portfolio-locale';

function detectInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') {
    return stored;
  }
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
}

@Injectable({ providedIn: 'root' })
export class LocaleService {
  readonly locale = signal<Locale>(detectInitialLocale());

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }

  toggle(): void {
    this.setLocale(this.locale() === 'es' ? 'en' : 'es');
  }
}
