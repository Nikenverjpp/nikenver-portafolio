import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'portfolio-locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly locale = signal<Locale>(this.detectInitialLocale());

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }

  toggle(): void {
    this.setLocale(this.locale() === 'es' ? 'en' : 'es');
  }

  private detectInitialLocale(): Locale {
    if (!this.isBrowser) {
      return 'es';
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') {
      return stored;
    }
    return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
  }
}
