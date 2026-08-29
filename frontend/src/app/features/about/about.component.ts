import { AsyncPipe } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ExperienceService } from '@core/api/experience.service';
import { TimelineItemComponent } from '@components/timeline-item.component';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { SKILL_GROUPS, COURSE_GROUPS } from '@core/data/skills.data';
import { CvPdfService } from '@core/pdf/cv-pdf.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AsyncPipe, TimelineItemComponent, RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll>
        <div class="flex flex-row items-center gap-4 sm:gap-6">
          <img
            src="/img/nikenver-pulgar.webp"
            alt="Nikenver Pulgar"
            width="128"
            height="128"
            decoding="async"
            class="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-accent-cyan/50 ring-offset-4 ring-offset-bg-primary sm:h-32 sm:w-32"
          />
          <div>
            <p class="font-sans text-sm text-accent-cyan">{{ 'about.eyebrow' | t: locale.locale() }}</p>
            <h1 class="section-title mt-3">Nikenver Pulgar</h1>
          </div>
        </div>
        <p class="mt-6 text-lg text-text-secondary">
          {{ 'about.subtitle' | t: locale.locale() }}
        </p>
        <p class="mt-2 font-sans text-xs text-text-muted">
          {{ 'about.personalMeta' | t: locale.locale() }}
        </p>
      </header>

      <div class="mt-10 ">
        <article
          id="bio-content"
          appRevealOnScroll
          class="prose-portfolio bio-clamp"
          [class.is-expanded]="bioExpanded()"
        >
          <p [innerHTML]="'about.paragraph1' | t: locale.locale()"></p>
          <p [innerHTML]="'about.paragraph2' | t: locale.locale()"></p>
          <p [innerHTML]="'about.paragraph3' | t: locale.locale()"></p>
        </article>

        <button
          type="button"
          class="mt-3 inline-flex min-h-11 items-center gap-1 font-sans text-sm text-accent-cyan sm:hidden"
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

      <div class="mt-6">
        <button
          type="button"
          class="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          [disabled]="cvState() === 'generating'"
          (click)="downloadCv()"
        >
          <span
            class="material-symbols-outlined !text-lg"
            [class.animate-spin]="cvState() === 'generating'"
            aria-hidden="true"
          >
            {{ cvState() === 'generating' ? 'progress_activity' : 'download' }}
          </span>
          {{
            (cvState() === 'error'
              ? 'about.downloadCvError'
              : cvState() === 'generating'
                ? 'about.downloadCvGenerating'
                : 'about.downloadCv'
            ) | t: locale.locale()
          }}
        </button>
      </div>

      <section class="mt-16">
        <h2 class="section-title mb-8" appRevealOnScroll>{{ 'shared.experienceTitle' | t: locale.locale() }}</h2>
        <section class="text-justify [hyphens:auto]">
          @if (experiences$ | async; as experiences) {
            @for (exp of experiences; track exp.id) {
              <app-timeline-item [experience]="exp" [detailed]="true" appRevealOnScroll />
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
        <div class="grid gap-x-8 gap-y-8 sm:grid-cols-3">
          @for (group of courseGroups; track group.titleKey) {
            <div>
              <h3 class="font-sans text-xs font-medium uppercase tracking-wide text-text-muted">
                {{ group.titleKey | t: locale.locale() }}
              </h3>
              <ul class="mt-3 space-y-2 text-sm text-text-secondary">
                @for (course of group.items; track course.es) {
                  <li class="flex items-start gap-2">
                    <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"></span>
                    {{ course | t: locale.locale() }}
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </section>
    </section>
  `,
})
export class AboutComponent {
  private readonly experiences = inject(ExperienceService);
  private readonly cvPdf = inject(CvPdfService);
  readonly locale = inject(LocaleService);
  readonly experiences$ = this.experiences.list();
  readonly bioExpanded = signal(false);
  readonly cvState = signal<'idle' | 'generating' | 'error'>('idle');

  readonly skillGroups = SKILL_GROUPS;

  readonly courseGroups = COURSE_GROUPS;

  async downloadCv(): Promise<void> {
    if (this.cvState() === 'generating') {
      return;
    }
    this.cvState.set('generating');
    try {
      await this.cvPdf.download(this.locale.locale());
      this.cvState.set('idle');
    } catch (error) {
      console.error('CV PDF generation failed', error);
      this.cvState.set('error');
      setTimeout(() => this.cvState.set('idle'), 4000);
    }
  }
}
