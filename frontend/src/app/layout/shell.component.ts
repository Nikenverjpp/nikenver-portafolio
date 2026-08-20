import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { environment } from '@env/environment';
import { Locale, LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { ThemeService } from '@core/theme/theme.service';
import { WhatsappButtonComponent } from '@components/whatsapp-button.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, WhatsappButtonComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="min-h-screen flex flex-col">
      <a href="#content" class="skip-link">{{ 'a11y.skipToContent' | t: locale.locale() }}</a>

      <header
        class="safe-top sticky top-0 z-50 border-b border-border/80 bg-bg-primary/90 backdrop-blur-md"
      >
        <nav
          class="container-page flex h-16 items-center justify-between gap-4"
          [attr.aria-label]="'nav.ariaLabel' | t: locale.locale()"
        >
          <a routerLink="/" class="flex items-center gap-3 font-display text-text-primary">
            <span class="flex items-baseline text-lg font-bold">
              <span class="relative z-10">N</span>
              <span class="relative -ml-[0.3em] z-0">P</span>
              <span class="text-accent-cyan">.</span>
            </span>
            <span class="flex items-center">
              <span class="inline-flex w-[15ch] items-center overflow-hidden text-sm font-medium lowercase text-text-secondary sm:w-[21ch]">
                <span class="truncate" aria-hidden="true">{{ typedName() }}</span>
                <span
                  class="ml-0.5 inline-block h-4 w-[2px] shrink-0 bg-accent-cyan motion-safe:animate-pulse"
                  aria-hidden="true"
                ></span>
              </span>
              <span class="sr-only">Nikenver Pulgar, Ingeniero de Sistemas, Angular y Laravel</span>
            </span>
          </a>
          <div class="hidden items-center gap-8 md:flex">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="nav-link-active"
                [ariaCurrentWhenActive]="'page'"
                class="nav-link"
                [routerLinkActiveOptions]="{ exact: link.exact }"
              >
                {{ link.labelKey | t: locale.locale() }}
              </a>
            }
          </div>

          <div class="hidden items-center gap-2 md:flex">
            <button
              type="button"
              class="filter-chip"
              [attr.title]="'theme.' + theme.mode() | t: locale.locale()"
              [attr.aria-label]="('theme.ariaLabel' | t: locale.locale()) + ': ' + ('theme.' + theme.mode() | t: locale.locale())"
              (click)="theme.cycle()"
            >
              <span class="material-symbols-outlined" aria-hidden="true">{{ theme.icon() }}</span>
            </button>
            <button
              type="button"
              class="filter-chip"
              [class.filter-chip-active]="locale.locale() === 'es'"
              [attr.aria-label]="'lang.ariaLabel' | t: locale.locale()"
              (click)="locale.setLocale('es')"
            >
              ES
            </button>
            <button
              type="button"
              class="filter-chip"
              [class.filter-chip-active]="locale.locale() === 'en'"
              [attr.aria-label]="'lang.ariaLabel' | t: locale.locale()"
              (click)="locale.setLocale('en')"
            >
              EN
            </button>
          </div>

          <details #menuDetails class="relative md:hidden">
            <summary
              class="inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-border text-text-secondary"
              [attr.aria-label]="'nav.menu' | t: locale.locale()"
            >
              <span class="material-symbols-outlined" aria-hidden="true">menu</span>
            </summary>
            <div class="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-bg-secondary p-2 shadow-glow">
              @for (link of navLinks; track link.path) {
                <a
                  [routerLink]="link.path"
                  routerLinkActive="nav-link-active"
                  [ariaCurrentWhenActive]="'page'"
                  [routerLinkActiveOptions]="{ exact: link.exact }"
                  class="flex min-h-11 items-center rounded-lg px-3 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  (click)="closeMenu($event)"
                >
                  {{ link.labelKey | t: locale.locale() }}
                </a>
              }
              <div class="mt-2 flex items-center gap-2 border-t border-border px-3 pt-2">
                <button
                  type="button"
                  class="filter-chip"
                  [attr.title]="'theme.' + theme.mode() | t: locale.locale()"
                  [attr.aria-label]="('theme.ariaLabel' | t: locale.locale()) + ': ' + ('theme.' + theme.mode() | t: locale.locale())"
                  (click)="theme.cycle()"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">{{ theme.icon() }}</span>
                </button>
                <button
                  type="button"
                  class="filter-chip"
                  [class.filter-chip-active]="locale.locale() === 'es'"
                  [attr.aria-label]="'lang.ariaLabel' | t: locale.locale()"
                  (click)="locale.setLocale('es')"
                >
                  ES
                </button>
                <button
                  type="button"
                  class="filter-chip"
                  [class.filter-chip-active]="locale.locale() === 'en'"
                  [attr.aria-label]="'lang.ariaLabel' | t: locale.locale()"
                  (click)="locale.setLocale('en')"
                >
                  EN
                </button>
              </div>
            </div>
          </details>
        </nav>
      </header>

      <main id="content" tabindex="-1" class="flex-1">
        <ng-content />
      </main>

      <footer class="border-t border-border py-10">
        <div class="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-text-muted">{{ year }} {{ 'footer.tagline' | t: locale.locale() }}</p>
          <div class="flex flex-wrap gap-4 text-sm">
            <a [href]="'mailto:' + contact.email" class="text-text-secondary hover:text-accent-cyan">
              {{ contact.email }}
            </a>
            <a
              [href]="contact.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="text-text-secondary hover:text-accent-cyan"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      @if (!onContactPage()) {
        <app-whatsapp-button />
      }
    </div>
  `,
})
export class ShellComponent implements OnDestroy {
  @ViewChild('menuDetails') private readonly menuDetails?: ElementRef<HTMLDetailsElement>;

  readonly locale = inject(LocaleService);
  readonly theme = inject(ThemeService);

  private readonly router = inject(Router);
  // Contact's own WhatsApp card already covers this action, so the floating
  // button would just duplicate it right where a decision should be reinforced.
  readonly onContactPage = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/contacto'))
    ),
    { initialValue: this.router.url.startsWith('/contacto') }
  );

  readonly year = new Date().getFullYear();
  readonly contact = environment.contact;

  readonly navLinks = [
    { path: '/', labelKey: 'nav.home', exact: true },
    { path: '/sobre-mi', labelKey: 'nav.about', exact: false },
    { path: '/proyectos', labelKey: 'nav.projects', exact: false },
    { path: '/contacto', labelKey: 'nav.contact', exact: false },
  ];

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ngZone = inject(NgZone);
  private readonly typewriterWords: Record<Locale, string>[] = [
    { es: 'Nikenver', en: 'Nikenver' },
    { es: 'Pulgar', en: 'Pulgar' },
    { es: 'Ingeniero de Sistemas', en: 'Systems Engineer' },
    { es: 'Angular', en: 'Angular' },
    { es: 'Laravel', en: 'Laravel' },
  ];
  private typewriterTimeout?: ReturnType<typeof setTimeout>;

  readonly typedName = signal('Nikenver');

  constructor() {
    if (this.isBrowser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.ngZone.runOutsideAngular(() => {
        this.runTypewriter(0, this.typewriterWords[0].es.length, 'deleting');
      });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typewriterTimeout);
  }

  private runTypewriter(wordIndex: number, charIndex: number, phase: 'typing' | 'deleting'): void {
    const TYPE_MS = 70;
    const DELETE_MS = 35;
    const HOLD_MS = 1400;
    const PAUSE_MS = 300;
    const word = this.typewriterWords[wordIndex][this.locale.locale()];
    const schedule = (delay: number, next: () => void) => {
      this.typewriterTimeout = setTimeout(next, delay);
    };

    if (phase === 'typing') {
      this.typedName.set(word.slice(0, charIndex));
      if (charIndex < word.length) {
        schedule(TYPE_MS, () => this.runTypewriter(wordIndex, charIndex + 1, 'typing'));
      } else {
        schedule(HOLD_MS, () => this.runTypewriter(wordIndex, charIndex, 'deleting'));
      }
      return;
    }

    this.typedName.set(word.slice(0, charIndex));
    if (charIndex > 0) {
      schedule(DELETE_MS, () => this.runTypewriter(wordIndex, charIndex - 1, 'deleting'));
      return;
    }
    const nextWordIndex = (wordIndex + 1) % this.typewriterWords.length;
    schedule(PAUSE_MS, () => this.runTypewriter(nextWordIndex, 0, 'typing'));
  }

  closeMenu(event: Event): void {
    const details = (event.target as HTMLElement).closest('details');
    if (details) {
      details.open = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const details = this.menuDetails?.nativeElement;
    if (details?.open && !details.contains(event.target as Node)) {
      details.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    const details = this.menuDetails?.nativeElement;
    if (details?.open) {
      details.open = false;
    }
  }
}
