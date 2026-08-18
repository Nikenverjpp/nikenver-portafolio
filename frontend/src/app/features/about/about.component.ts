import { AsyncPipe } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ExperienceService } from '../../core/api/experience.service';
import { TimelineItemComponent } from '../../shared/components/timeline-item.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AsyncPipe, TimelineItemComponent, RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <img
          src="/img/nikenver-pulgar.webp"
          alt="Nikenver Pulgar"
          width="128"
          height="128"
          decoding="async"
          class="h-28 w-28 shrink-0 rounded-full object-cover ring-2 ring-accent-cyan/50 ring-offset-4 ring-offset-bg-primary sm:h-32 sm:w-32"
        />
        <div class="max-w-3xl">
          <p class="font-mono text-sm text-accent-cyan">{{ 'about.eyebrow' | t: locale.locale() }}</p>
          <h1 class="section-title mt-3">Nikenver Pulgar</h1>
          <p class="mt-2 text-lg text-text-secondary">
            {{ 'about.subtitle' | t: locale.locale() }}
          </p>
          <p class="mt-2 font-mono text-xs text-text-muted">
            {{ 'about.personalMeta' | t: locale.locale() }}
          </p>
        </div>
      </header>

      <div class="mt-10 max-w-3xl">
        <div class="relative">
          <article
            id="bio-content"
            appRevealOnScroll
            class="prose-portfolio bio-clamp"
            [class.is-expanded]="bioExpanded()"
          >
            <p>{{ 'about.paragraph1' | t: locale.locale() }}</p>
            <p>{{ 'about.paragraph2' | t: locale.locale() }}</p>
            <p>{{ 'about.paragraph3' | t: locale.locale() }}</p>
          </article>

          @if (!bioExpanded()) {
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-primary to-transparent sm:hidden"
              aria-hidden="true"
            ></div>
          }
        </div>

        <button
          type="button"
          class="mt-3 inline-flex items-center gap-1 font-mono text-sm text-accent-cyan sm:hidden"
          [attr.aria-expanded]="bioExpanded()"
          aria-controls="bio-content"
          (click)="bioExpanded.set(!bioExpanded())"
        >
          {{ (bioExpanded() ? 'about.readLess' : 'about.readMore') | t: locale.locale() }}
          <span class="material-symbols-outlined !text-base" aria-hidden="true">
            {{ bioExpanded() ? 'expand_less' : 'expand_more' }}
          </span>
        </button>
      </div>

      <section class="mt-16">
        <h2 class="section-title mb-8" appRevealOnScroll>{{ 'shared.experienceTitle' | t: locale.locale() }}</h2>
        <section class="max-w-3xl">
          @if (experiences$ | async; as experiences) {
            @for (exp of experiences; track exp.id) {
              <app-timeline-item [experience]="exp" appRevealOnScroll />
            }
          }
        </section>
      </section>

      <section class="mt-16" appRevealOnScroll>
        <h2 class="section-title mb-6">{{ 'about.stackTitle' | t: locale.locale() }}</h2>
        <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (group of skillGroups; track group.titleKey) {
            <article class="card-surface p-5">
              <h3 class="font-display text-lg font-semibold text-text-primary">
                {{ group.titleKey | t: locale.locale() }}
              </h3>
              <ul class="mt-3 space-y-2 text-sm text-text-secondary">
                @for (skill of group.items; track skill) {
                  <li class="flex items-center gap-2">
                    <span class="h-1.5 w-1.5 rounded-full bg-accent-cyan"></span>
                    {{ skill }}
                  </li>
                }
              </ul>
            </article>
          }
        </section>
      </section>

      <section class="mt-16" appRevealOnScroll>
        <h2 class="section-title mb-6">{{ 'about.coursesTitle' | t: locale.locale() }}</h2>
        <ul class="grid gap-x-8 gap-y-2 text-sm text-text-secondary sm:grid-cols-2">
          @for (course of courses; track course.es) {
            <li class="flex items-start gap-2 py-1">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"></span>
              {{ course | t: locale.locale() }}
            </li>
          }
        </ul>
      </section>
    </section>
  `,
})
export class AboutComponent {
  private readonly experiences = inject(ExperienceService);
  readonly locale = inject(LocaleService);
  readonly experiences$ = this.experiences.list();
  readonly bioExpanded = signal(false);

  readonly skillGroups = [
    {
      titleKey: 'about.skillFrontend',
      items: ['Angular', 'React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
    },
    {
      titleKey: 'about.skillBackend',
      items: ['Laravel', 'PHP', 'REST APIs', 'PostgreSQL', 'MySQL'],
    },
    {
      titleKey: 'about.skillOther',
      items: ['Prompt Engineering', 'WordPress', '.NET (C#)', 'Git', 'Docker (básico)', 'Cloudinary'],
    },
    {
      titleKey: 'about.skillFragrance',
      items: [
        'Diagnóstico olfativo',
        'Layering de fragancias',
        'Matching de perfumes',
        'Familias olfativas',
      ],
    },
  ];

  readonly courses = [
    {
      es: 'Angular desde Cero a Experto: Crear una Aplicación Real',
      en: 'Angular from Scratch to Expert: Build a Real App',
    },
    { es: 'React: de Cero a Experto (Hooks y MERN)', en: 'React: From Scratch to Expert (Hooks & MERN)' },
    { es: 'Curso Profesional de JavaScript', en: 'Professional JavaScript Course' },
    {
      es: 'Aprende a Crear una Plataforma de Cursos con Laravel',
      en: 'Learn to Build a Course Platform with Laravel',
    },
    {
      es: 'Desarrollo Web en PHP con Laravel 5.6, VueJS y MariaDB MySQL',
      en: 'Web Development in PHP with Laravel 5.6, VueJS and MariaDB MySQL',
    },
    {
      es: 'Curso de Laravel y Livewire - Crea un Sistema de Parking',
      en: 'Laravel and Livewire Course - Build a Parking System',
    },
    {
      es: 'Construyendo Web APIs RESTful con ASP.NET Core 6',
      en: 'Building RESTful Web APIs with ASP.NET Core 6',
    },
    { es: 'Curso de Refactorización con PHP', en: 'PHP Refactoring Course' },
    { es: 'Curso de Laravel 10 desde Cero', en: 'Laravel 10 From Scratch' },
    { es: 'Diplomado: Webmaster', en: 'Diploma: Webmaster' },
    { es: 'Diplomado: Diseño de Medios Web', en: 'Diploma: Web Media Design' },
    {
      es: 'Diseño Gráfico, Edición de Video y Programación Web con IA (2026)',
      en: 'Graphic Design, Video Editing and Web Programming with AI (2026)',
    },
    {
      es: 'Diplomado Internacional en Marketing Digital con IA (2026)',
      en: 'International Diploma in Digital Marketing with AI (2026)',
    },
  ];
}
