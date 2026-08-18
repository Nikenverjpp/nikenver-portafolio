import { Component, ElementRef, HostListener, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../environments/environment';
import { LocaleService } from '../core/i18n/locale.service';
import { TranslatePipe } from '../core/i18n/translate.pipe';
import { ThemeService } from '../core/theme/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
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
          <a routerLink="/" class="font-display text-lg font-bold tracking-tight text-text-primary">
            NP<span class="text-accent-cyan">.</span>
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
                  [attr.aria-label]="'theme.ariaLabel' | t: locale.locale()"
                  (click)="theme.cycle()"
                >
                  {{ 'theme.' + theme.mode() | t: locale.locale() }}
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
    </div>
  `,
})
export class ShellComponent {
  @ViewChild('menuDetails') private readonly menuDetails?: ElementRef<HTMLDetailsElement>;

  readonly locale = inject(LocaleService);
  readonly theme = inject(ThemeService);

  readonly year = new Date().getFullYear();
  readonly contact = environment.contact;

  readonly navLinks = [
    { path: '/', labelKey: 'nav.home', exact: true },
    { path: '/sobre-mi', labelKey: 'nav.about', exact: false },
    { path: '/proyectos', labelKey: 'nav.projects', exact: false },
    { path: '/contacto', labelKey: 'nav.contact', exact: false },
  ];

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
