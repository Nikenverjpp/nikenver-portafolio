import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '@env/environment';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll>
        <p class="font-sans text-sm text-accent-cyan">{{ 'contact.eyebrow' | t: locale.locale() }}</p>
        <h1 class="section-title mt-3">{{ 'contact.title' | t: locale.locale() }}</h1>
        <p class="mt-4 max-w-2xl text-lg text-text-secondary">
          {{ 'contact.intro' | t: locale.locale() }}
        </p>
      </header>

      <section class="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
        <article appRevealOnScroll class="card-surface p-6">
          <p class="font-sans text-xs text-text-muted">{{ 'contact.emailLabel' | t: locale.locale() }}</p>
          @if (emailRevealed()) {
            <a
              [href]="'mailto:' + contact.email"
              class="mt-2 block font-display text-xl text-accent-cyan hover:underline"
            >
              {{ contact.email }}
            </a>
          } @else {
            <button
              type="button"
              (click)="emailRevealed.set(true)"
              class="mt-2 inline-flex min-h-11 items-center gap-1.5 font-display text-xl text-accent-cyan hover:underline"
            >
              {{ 'contact.showEmail' | t: locale.locale() }}
              <span class="material-symbols-outlined !text-lg" aria-hidden="true">visibility</span>
            </button>
          }
          <p class="mt-3 text-sm text-text-secondary">
            {{ 'contact.emailHint' | t: locale.locale() }}
          </p>
        </article>

        <article appRevealOnScroll class="card-surface p-6">
          <p class="font-sans text-xs text-text-muted">{{ 'contact.phoneLabel' | t: locale.locale() }}</p>
          @if (phoneRevealed()) {
            <a
              [href]="whatsappLink"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 block font-display text-xl text-text-primary hover:text-accent-cyan"
            >
              {{ contact.phoneDisplay }}
            </a>
          } @else {
            <button
              type="button"
              (click)="phoneRevealed.set(true)"
              class="mt-2 inline-flex min-h-11 items-center gap-1.5 font-display text-xl text-accent-cyan hover:underline"
            >
              {{ 'contact.showPhone' | t: locale.locale() }}
              <span class="material-symbols-outlined !text-lg" aria-hidden="true">visibility</span>
            </button>
          }
          <p class="mt-3 text-sm text-text-secondary">
            {{ 'contact.phoneHint' | t: locale.locale() }}
          </p>
        </article>

        <article appRevealOnScroll class="card-surface p-6 sm:col-span-2">
          <p class="font-sans text-xs text-text-muted">{{ 'contact.linkedinLabel' | t: locale.locale() }}</p>
          <a
            [href]="contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex font-display text-xl text-accent-cyan hover:underline"
          >
            linkedin.com/in/nikenver
          </a>
        </article>
      </section>
    </section>
  `,
})
export class ContactComponent {
  readonly contact = environment.contact;
  readonly locale = inject(LocaleService);
  readonly whatsappLink = `https://wa.me/${this.contact.phone.replace(/\D/g, '')}`;

  // Both start unrevealed so prerendering never bakes the raw address/number
  // into the static HTML; a real click is what writes them into the DOM.
  readonly emailRevealed = signal(false);
  readonly phoneRevealed = signal(false);
}
