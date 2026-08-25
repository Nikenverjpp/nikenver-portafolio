import { isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectionStrategy, NgZone, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { environment } from '@env/environment';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <a
      [href]="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
      [attr.aria-label]="'whatsapp.ariaLabel' | t: locale.locale()"
      [title]="'whatsapp.ariaLabel' | t: locale.locale()"
      class="fixed right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:opacity-100 focus-visible:scale-105 focus-visible:opacity-100 sm:right-6"
      [class.opacity-20]="isScrolling()"
      style="bottom: calc(1.25rem + env(safe-area-inset-bottom))"
    >
      <svg viewBox="0 0 32 32" class="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path
          d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.653 4.53 1.786 6.394L4 29l7.8-1.746A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.77 9.77 0 0 1-4.986-1.365l-.358-.213-4.63 1.036 1.06-4.512-.234-.372A9.76 9.76 0 0 1 5.2 15c0-5.965 4.85-10.818 10.804-10.818S26.808 9.035 26.808 15 21.958 24.818 16.004 24.818Zm5.62-7.32c-.308-.154-1.82-.898-2.102-1-.282-.103-.487-.154-.692.154-.205.308-.795 1-.975 1.205-.18.205-.36.231-.667.077-.308-.154-1.3-.479-2.476-1.526-.915-.816-1.533-1.824-1.713-2.132-.18-.308-.02-.474.135-.627.138-.138.308-.36.462-.539.154-.18.205-.308.308-.513.103-.205.051-.385-.026-.539-.077-.154-.692-1.667-.949-2.283-.25-.6-.505-.519-.692-.529l-.59-.01c-.205 0-.539.077-.821.385-.282.308-1.077 1.052-1.077 2.565s1.103 2.975 1.257 3.18c.154.205 2.171 3.313 5.26 4.646.735.317 1.309.507 1.756.649.738.235 1.41.202 1.941.123.592-.089 1.82-.744 2.077-1.462.257-.718.257-1.333.18-1.462-.077-.128-.282-.205-.59-.36Z"
        />
      </svg>
      <span class="sr-only">{{ 'whatsapp.ariaLabel' | t: locale.locale() }}</span>
    </a>
  `,
})
export class WhatsappButtonComponent implements OnDestroy {
  readonly locale = inject(LocaleService);
  readonly whatsappLink = `https://wa.me/${environment.contact.phone.replace(/\D/g, '')}`;

  // Fades the button while scrolling so it doesn't sit opaque over body text on
  // narrow mobile viewports (it's fixed-positioned, so running prose passes
  // under it as the page scrolls); it returns to full opacity once scrolling stops.
  readonly isScrolling = signal(false);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ngZone = inject(NgZone);
  private scrollTimeout?: ReturnType<typeof setTimeout>;

  private readonly onScroll = (): void => {
    if (!this.isScrolling()) {
      this.ngZone.run(() => this.isScrolling.set(true));
    }
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => this.ngZone.run(() => this.isScrolling.set(false)), 400);
  };

  constructor() {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onScroll, { passive: true });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll);
    }
    clearTimeout(this.scrollTimeout);
  }
}
