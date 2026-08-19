import { AsyncPipe, SlicePipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ExperienceService } from '@core/api/experience.service';
import { ProjectService } from '@core/api/project.service';
import { environment } from '@env/environment';
import { ProjectCardComponent } from '@components/project-card.component';
import { TimelineItemComponent } from '@components/timeline-item.component';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    SlicePipe,
    RouterLink,
    ProjectCardComponent,
    TimelineItemComponent,
    RevealOnScrollDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-20 sm:py-28">
      <section appRevealOnScroll>
        <p class="font-mono text-sm text-accent-cyan">{{ 'home.eyebrow' | t: locale.locale() }}</p>
        <h1 class="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Nikenver Pulgar
          <span class="block text-2xl font-semibold text-text-secondary sm:text-3xl">
            {{ 'home.role' | t: locale.locale() }}
          </span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg text-text-secondary">
          {{ 'home.intro' | t: locale.locale() }}
        </p>
        <p class="mt-8 flex flex-wrap gap-4">
          <a routerLink="/proyectos" class="btn-primary">{{ 'home.ctaProjects' | t: locale.locale() }}</a>
          <a
            [href]="contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-ghost"
          >
            LinkedIn
          </a>
        </p>
      </section>
    </section>

    <section class="container-page pb-20">
      <section
        appRevealOnScroll
        class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
      >
        <article class="card-surface p-4 sm:p-6">
          <p class="font-display text-4xl font-bold text-accent-cyan">{{ 'home.statYears' | t: locale.locale() }}</p>
          <p class="mt-2 text-sm text-text-secondary">{{ 'home.statYearsLabel' | t: locale.locale() }}</p>
        </article>
        <article class="card-surface p-4 sm:p-6">
          <p class="font-display text-4xl font-bold text-accent-amber">{{ 'home.statCompanies' | t: locale.locale() }}</p>
          <p class="mt-2 text-sm text-text-secondary">{{ 'home.statCompaniesLabel' | t: locale.locale() }}</p>
        </article>
        <article class="card-surface col-span-2 p-4 sm:p-6 lg:col-span-1">
          <p class="font-mono text-xs text-text-muted">{{ 'home.statStackLabel' | t: locale.locale() }}</p>
          <p class="mt-2 font-display text-lg text-text-primary">Angular / Laravel / PostgreSQL</p>
        </article>
      </section>
    </section>

    <section class="container-page pb-24" id="experiencia">
      <header appRevealOnScroll class="mb-10 flex items-end justify-between gap-4">
        <section>
          <h2 class="section-title">{{ 'shared.experienceTitle' | t: locale.locale() }}</h2>
          <p class="mt-2 text-text-secondary">{{ 'home.experienceSubtitle' | t: locale.locale() }}</p>
        </section>
        <a routerLink="/sobre-mi" class="text-sm text-accent-cyan hover:underline">
          {{ 'home.viewFullBio' | t: locale.locale() }}
        </a>
      </header>
      <section class="text-justify">
        @if (experiences$ | async; as experiences) {
          @for (exp of experiences | slice: 0 : 4; track exp.id) {
            <app-timeline-item [experience]="exp" appRevealOnScroll />
          }
        }
      </section>
    </section>

    <section class="container-page pb-24">
      <header appRevealOnScroll class="mb-10">
        <h2 class="section-title">{{ 'home.featuredProjectsTitle' | t: locale.locale() }}</h2>
        <p class="mt-2 text-text-secondary">{{ 'home.featuredProjectsSubtitle' | t: locale.locale() }}</p>
      </header>
      <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @if (featuredProjects$ | async; as projects) {
          @for (project of projects; track project.id) {
            <app-project-card [project]="project" appRevealOnScroll />
          }
        }
      </section>
    </section>

    <section class="container-page pb-24">
      <article appRevealOnScroll class="card-surface flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
        <section>
          <h2 class="section-title text-2xl sm:text-3xl">{{ 'home.contactTitle' | t: locale.locale() }}</h2>
          <p class="mt-2 text-text-secondary">
            {{ 'home.contactText' | t: locale.locale() }}
          </p>
        </section>
        <a routerLink="/contacto" class="btn-primary shrink-0">{{ 'home.contactCta' | t: locale.locale() }}</a>
      </article>
    </section>
  `,
})
export class HomeComponent {
  private readonly projects = inject(ProjectService);
  private readonly experiences = inject(ExperienceService);
  readonly locale = inject(LocaleService);

  readonly contact = environment.contact;

  readonly featuredProjects$ = this.projects.list().pipe(
    map((items) => items.filter((p) => p.is_featured).slice(0, 3))
  );

  readonly experiences$ = this.experiences.list();
}
