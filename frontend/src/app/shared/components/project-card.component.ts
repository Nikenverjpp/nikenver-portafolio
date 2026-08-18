import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../core/models/project.model';
import { StackBadgesComponent } from './stack-badges.component';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, StackBadgesComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <article
      class="card-surface group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-accent-cyan/40"
    >
      @if (project.preview_image_url) {
        <a
          [routerLink]="['/proyectos', project.slug]"
          class="block aspect-video w-full overflow-hidden bg-bg-primary"
          tabindex="-1"
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
      }
      <div class="flex h-full flex-col p-6">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            @if (project.thumbnail_url) {
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
            <div>
              @if (project.year) {
                <p class="font-mono text-xs text-text-muted">{{ project.year }}</p>
              }
              <h3 class="mt-1 font-display text-xl font-semibold text-text-primary group-hover:text-accent-cyan">
                <a [routerLink]="['/proyectos', project.slug]">{{ project.title | t: locale.locale() }}</a>
              </h3>
            </div>
          </div>
          @if (project.company) {
            <span class="rounded-full border border-border px-2 py-1 text-xs text-text-muted">
              {{ project.company }}
            </span>
          }
        </div>
        @if (project.tagline) {
          <p class="mb-4 text-sm text-text-secondary">{{ project.tagline | t: locale.locale() }}</p>
        }
        @if (project.stack?.length) {
          <app-stack-badges [items]="project.stack!" class="mt-auto" />
        }
        <a
          [routerLink]="['/proyectos', project.slug]"
          class="mt-5 inline-flex text-sm font-medium text-accent-cyan hover:underline"
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
}
