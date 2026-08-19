import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '@core/api/project.service';
import { ProjectCardComponent } from '@components/project-card.component';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCardComponent, RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll>
        <p class="font-sans text-sm text-accent-cyan">{{ 'projects.eyebrow' | t: locale.locale() }}</p>
        <h1 class="section-title mt-3">{{ 'projects.title' | t: locale.locale() }}</h1>
        <p class="mt-2 max-w-2xl text-text-secondary">
          {{ 'projects.subtitle' | t: locale.locale() }}
        </p>
      </header>

      <h2 class="sr-only">{{ 'projects.gridHeading' | t: locale.locale() }}</h2>
      <section class="mt-10 grid items-start gap-6 md:grid-cols-2">
        @for (project of allProjects(); track project.id) {
          <app-project-card [project]="project" appRevealOnScroll />
        }
      </section>
    </section>
  `,
})
export class ProjectsListComponent {
  private readonly projectService = inject(ProjectService);
  readonly locale = inject(LocaleService);

  readonly allProjects = toSignal(this.projectService.list(), { initialValue: [] });
}
