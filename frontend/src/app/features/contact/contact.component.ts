import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll>
        <p class="font-mono text-sm text-accent-cyan">{{ 'contact.eyebrow' | t: locale.locale() }}</p>
        <h1 class="section-title mt-3">{{ 'contact.title' | t: locale.locale() }}</h1>
        <p class="mt-4 max-w-2xl text-lg text-text-secondary">
          {{ 'contact.intro' | t: locale.locale() }}
        </p>
      </header>

      <section class="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
        <article appRevealOnScroll class="card-surface p-6">
          <p class="font-mono text-xs text-text-muted">{{ 'contact.emailLabel' | t: locale.locale() }}</p>
          <a
            [href]="'mailto:' + contact.email"
            class="mt-2 block font-display text-xl text-accent-cyan hover:underline"
          >
            {{ contact.email }}
          </a>
          <p class="mt-3 text-sm text-text-secondary">
            {{ 'contact.emailHint' | t: locale.locale() }}
          </p>
        </article>

        <article appRevealOnScroll class="card-surface p-6">
          <p class="font-mono text-xs text-text-muted">{{ 'contact.phoneLabel' | t: locale.locale() }}</p>
          <a
            [href]="'tel:' + contact.phone"
            class="mt-2 block font-display text-xl text-text-primary hover:text-accent-cyan"
          >
            {{ contact.phoneDisplay }}
          </a>
          <p class="mt-3 text-sm text-text-secondary">
            {{ 'contact.phoneHint' | t: locale.locale() }}
          </p>
        </article>

        <article appRevealOnScroll class="card-surface p-6 sm:col-span-2">
          <p class="font-mono text-xs text-text-muted">{{ 'contact.linkedinLabel' | t: locale.locale() }}</p>
          <a
            [href]="contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex font-display text-xl text-accent-cyan hover:underline"
          >
            linkedin.com/in/nikenver-pulgar
          </a>
        </article>
      </section>
    </section>
  `,
})
export class ContactComponent {
  readonly contact = environment.contact;
  readonly locale = inject(LocaleService);
}
