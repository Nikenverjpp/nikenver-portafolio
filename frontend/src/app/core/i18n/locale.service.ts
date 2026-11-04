import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'portfolio-locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  readonly locale = signal<Locale>(this.detectInitialLocale());

  constructor() {
    // Screen readers and CSS hyphenation both read the language from <html lang>.
    this.document.documentElement.lang = this.locale();
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    this.document.documentElement.lang = locale;
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
