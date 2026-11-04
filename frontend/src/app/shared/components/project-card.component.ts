import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECT_STATUS_LABEL_KEYS, Project } from '@core/models/project.model';
import { StackBadgesComponent } from './stack-badges.component';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, StackBadgesComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <article
      class="card-surface group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-accent-cyan/40"
    >
      @if (project.preview_image_url) {
        <a
          [routerLink]="['/proyectos', project.slug]"
          class="block h-36 w-full overflow-hidden bg-bg-primary sm:h-40"
          tabindex="-1"
          aria-hidden="true"
        >
          <img
            [src]="project.preview_image_url"
            [alt]="''"
            aria-hidden="true"
            width="960"
            height="474"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      } @else if (project.thumbnail_url) {
        <a
          [routerLink]="['/proyectos', project.slug]"
          class="flex h-36 w-full items-center justify-center border-b border-border bg-bg-primary sm:h-40"
          tabindex="-1"
          aria-hidden="true"
        >
          <span class="logo-chip h-20 w-20">
            <img
              [src]="project.thumbnail_url"
              alt=""
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-contain"
            />
          </span>
        </a>
      }
      <div class="flex flex-1 flex-col p-5">
        @if (project.thumbnail_url || project.year) {
          <div class="mb-3 flex items-center justify-between gap-3">
            @if (project.thumbnail_url && project.preview_image_url) {
              <span class="logo-chip h-11 w-11">
                <img
                  [src]="project.thumbnail_url"
                  [alt]="project.company ?? (project.title | t: locale.locale())"
                  width="44"
                  height="44"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-contain"
                />
              </span>
            }
            @if (project.year) {
              <span class="font-sans text-xs text-text-muted">
                {{ project.year }}
              </span>
            }
          </div>
        }
        <h3 class="font-display text-xl font-semibold text-text-primary group-hover:text-accent-cyan">
          <a [routerLink]="['/proyectos', project.slug]" class="block">
            {{ project.title | t: locale.locale() }}
          </a>
        </h3>
        @if (project.has_cicd || project.company || project.status !== 'production') {
          <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
            @if (project.status !== 'production') {
              <span class="rounded-full border border-accent-amber/40 bg-accent-amber/10 px-2 py-0.5 text-xs text-accent-amber">
                {{ statusKeys[project.status] | t: locale.locale() }}
              </span>
            }
            @if (project.has_cicd) {
              <span
                class="inline-flex items-center gap-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 font-sans text-[11px] font-medium text-accent-cyan"
                [title]="'projects.cicdTooltip' | t: locale.locale()"
              >
                <span class="material-symbols-outlined text-[13px] leading-none" aria-hidden="true">sync</span>
                CI/CD
              </span>
            }
            @if (project.company) {
              <span class="rounded-full border border-border px-2 py-0.5 text-xs text-text-muted">
                {{ project.company }}
              </span>
            }
          </div>
        }
        @if (project.tagline) {
          <p class="mb-3 text-sm text-text-secondary">{{ project.tagline | t: locale.locale() }}</p>
        }
        @if (project.stack?.length) {
          <app-stack-badges [items]="project.stack!" />
        }
        <a
          [routerLink]="['/proyectos', project.slug]"
          class="mt-auto inline-flex min-h-11 items-center pt-4 text-sm font-medium text-accent-cyan hover:underline"
        >
          {{ 'projects.viewCase' | t: locale.locale() }}
        </a>
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  readonly locale = inject(LocaleService);
  readonly statusKeys = PROJECT_STATUS_LABEL_KEYS;
}
