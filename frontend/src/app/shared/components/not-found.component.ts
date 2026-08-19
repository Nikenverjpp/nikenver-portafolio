import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <p class="font-sans text-sm text-accent-cyan">404</p>
      <h1 class="section-title mt-3">{{ titleKey | t: locale.locale() }}</h1>
      <p class="mt-4 max-w-md text-lg text-text-secondary">
        {{ 'notFound.message' | t: locale.locale() }}
      </p>
      <p class="mt-8 flex flex-wrap gap-4">
        <a routerLink="/" class="btn-primary">{{ 'notFound.backHome' | t: locale.locale() }}</a>
        @if (showProjectsLink) {
          <a routerLink="/proyectos" class="btn-ghost">{{ 'notFound.backProjects' | t: locale.locale() }}</a>
        }
      </p>
    </section>
  `,
})
export class NotFoundComponent {
  @Input() titleKey = 'notFound.title';
  @Input() showProjectsLink = false;

  readonly locale = inject(LocaleService);
}
