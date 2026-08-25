import { AsyncPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { Project } from '@core/models/project.model';
import { ProjectService } from '@core/api/project.service';
import { ServiceService } from '@core/api/service.service';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll>
        <p class="font-sans text-sm text-accent-cyan">{{ 'services.eyebrow' | t: locale.locale() }}</p>
        <h1 class="section-title mt-3">{{ 'services.title' | t: locale.locale() }}</h1>
        <p class="mt-2 max-w-2xl text-text-secondary">{{ 'services.subtitle' | t: locale.locale() }}</p>
      </header>

      <h2 class="sr-only">{{ 'services.gridHeading' | t: locale.locale() }}</h2>
      <section class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @if (services$ | async; as services) {
          @for (service of services; track service.slug) {
            <article appRevealOnScroll class="card-surface p-6">
              <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">{{
                service.icon
              }}</span>
              <h3 class="mt-3 font-display text-xl font-semibold text-text-primary">
                {{ service.title | t: locale.locale() }}
              </h3>
              <p class="mt-2 text-sm text-text-secondary">{{ service.description | t: locale.locale() }}</p>
              @if (service.relatedProjects.length) {
                <p class="mt-4 text-xs text-text-muted">
                  {{ 'services.evidenceLabel' | t: locale.locale() }}
                  @for (project of service.relatedProjects; track project.slug; let last = $last) {
                    <a [routerLink]="['/proyectos', project.slug]" class="text-accent-cyan hover:underline">{{
                      project.title | t: locale.locale()
                    }}</a
                    >{{ last ? '' : ', ' }}
                  }
                </p>
              }
            </article>
          }
        }
      </section>
    </section>

    <section class="container-page pb-24">
      <header appRevealOnScroll class="mb-10">
        <h2 class="section-title">{{ 'services.processTitle' | t: locale.locale() }}</h2>
        <p class="mt-2 text-text-secondary">{{ 'services.processSubtitle' | t: locale.locale() }}</p>
      </header>
      <ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li appRevealOnScroll class="card-surface p-6">
          <span class="font-display text-3xl font-bold text-accent-cyan">1</span>
          <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
            {{ 'services.processStep1Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep1Desc' | t: locale.locale() }}</p>
        </li>
        <li appRevealOnScroll class="card-surface p-6">
          <span class="font-display text-3xl font-bold text-accent-cyan">2</span>
          <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
            {{ 'services.processStep2Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep2Desc' | t: locale.locale() }}</p>
        </li>
        <li appRevealOnScroll class="card-surface p-6">
          <span class="font-display text-3xl font-bold text-accent-cyan">3</span>
          <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
            {{ 'services.processStep3Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep3Desc' | t: locale.locale() }}</p>
        </li>
        <li appRevealOnScroll class="card-surface p-6">
          <span class="font-display text-3xl font-bold text-accent-cyan">4</span>
          <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
            {{ 'services.processStep4Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep4Desc' | t: locale.locale() }}</p>
        </li>
      </ol>
    </section>

    <section class="container-page pb-24">
      <header appRevealOnScroll class="mb-10">
        <h2 class="section-title">{{ 'services.whyTitle' | t: locale.locale() }}</h2>
      </header>
      <div class="grid gap-6 sm:grid-cols-2">
        <article appRevealOnScroll class="card-surface p-6">
          <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">verified</span>
          <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
            {{ 'services.why1Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.why1Desc' | t: locale.locale() }}</p>
        </article>
        <article appRevealOnScroll class="card-surface p-6">
          <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">storefront</span>
          <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
            {{ 'services.why2Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.why2Desc' | t: locale.locale() }}</p>
        </article>
        <article appRevealOnScroll class="card-surface p-6">
          <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">layers</span>
          <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
            {{ 'services.why3Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.why3Desc' | t: locale.locale() }}</p>
        </article>
        <article appRevealOnScroll class="card-surface p-6">
          <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">auto_awesome</span>
          <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
            {{ 'services.why4Title' | t: locale.locale() }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ 'services.why4Desc' | t: locale.locale() }}</p>
        </article>
      </div>
    </section>

    <section class="container-page pb-24">
      <article
        appRevealOnScroll
        class="card-surface flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <section>
          <h2 class="section-title text-2xl sm:text-3xl">{{ 'services.ctaTitle' | t: locale.locale() }}</h2>
          <p class="mt-2 text-text-secondary">{{ 'services.ctaText' | t: locale.locale() }}</p>
        </section>
        <a routerLink="/contacto" class="btn-primary shrink-0">{{ 'services.ctaButton' | t: locale.locale() }}</a>
      </article>
    </section>
  `,
})
export class ServicesComponent {
  private readonly serviceApi = inject(ServiceService);
  private readonly projectApi = inject(ProjectService);
  readonly locale = inject(LocaleService);

  readonly services$ = combineLatest([this.serviceApi.list(), this.projectApi.list()]).pipe(
    map(([services, projects]) =>
      services.map((service) => ({
        ...service,
        relatedProjects: (service.relatedProjectSlugs ?? [])
          .map((slug) => projects.find((p) => p.slug === slug))
          .filter((p): p is Project => !!p),
      }))
    )
  );
}
