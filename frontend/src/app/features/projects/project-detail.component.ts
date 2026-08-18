import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, switchMap } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/api/project.service';
import { StackBadgesComponent } from '../../shared/components/stack-badges.component';
import { SocialCarouselComponent } from '../../shared/components/social-carousel.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    StackBadgesComponent,
    SocialCarouselComponent,
    RevealOnScrollDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (project$ | async; as project) {
      <article class="container-page py-16 sm:py-24">
        <p class="font-mono text-sm text-accent-cyan" appRevealOnScroll>
          <a routerLink="/proyectos" class="hover:underline">{{ 'projects.title' | t: locale.locale() }}</a>
          / {{ project.title | t: locale.locale() }}
        </p>
        @if (project.preview_image_url) {
          <div class="card-surface mt-6 aspect-video max-w-3xl overflow-hidden" appRevealOnScroll>
            <img
              [src]="project.preview_image_url"
              [alt]="''"
              aria-hidden="true"
              width="960"
              height="474"
              decoding="async"
              class="h-full w-full object-cover object-top"
            />
          </div>
        }
        <header appRevealOnScroll class="mt-8 flex max-w-3xl items-start gap-4">
          @if (project.thumbnail_url) {
            <span class="logo-chip h-16 w-16">
              <img
                [src]="project.thumbnail_url"
                [alt]="project.company ?? (project.title | t: locale.locale())"
                width="64"
                height="64"
                decoding="async"
                class="h-full w-full object-contain"
              />
            </span>
          }
          <div>
            @if (project.year) {
              <p class="font-mono text-xs text-text-muted">{{ project.year }}</p>
            }
            <h1 class="section-title mt-2">{{ project.title | t: locale.locale() }}</h1>
            @if (project.tagline) {
              <p class="mt-3 text-lg text-text-secondary">{{ project.tagline | t: locale.locale() }}</p>
            }
            @if (project.stack?.length) {
              <app-stack-badges [items]="project.stack!" class="mt-5 block" />
            }
          </div>
        </header>

        @if (project.description) {
          <section appRevealOnScroll class="prose-portfolio mt-10 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailSummary' | t: locale.locale() }}
            </h2>
            <p>{{ project.description | t: locale.locale() }}</p>
          </section>
        }

        @if (project.challenge) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailChallenge' | t: locale.locale() }}
            </h2>
            <p>{{ project.challenge | t: locale.locale() }}</p>
          </section>
        }

        @if (project.solution) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailSolution' | t: locale.locale() }}
            </h2>
            <p>{{ project.solution | t: locale.locale() }}</p>
          </section>
        }

        @if (project.results) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailResults' | t: locale.locale() }}
            </h2>
            <p>{{ project.results | t: locale.locale() }}</p>
          </section>
        }

        @if (project.links?.length) {
          <section appRevealOnScroll class="mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailLinks' | t: locale.locale() }}
            </h2>
            <p class="mt-3 flex flex-wrap gap-3">
              @for (link of project.links; track link.url) {
                <a
                  [href]="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="filter-chip gap-1 text-text-secondary hover:text-accent-cyan"
                >
                  {{ link.label | t: locale.locale() }}
                  <span class="material-symbols-outlined !text-sm" aria-hidden="true">open_in_new</span>
                </a>
              }
            </p>
          </section>
        }

        @if (project.socialPosts?.length) {
          <section appRevealOnScroll class="mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailSocial' | t: locale.locale() }}
            </h2>
            <app-social-carousel [posts]="project.socialPosts!" class="mt-4 block" />
          </section>
        }

        <p class="mt-12 flex flex-wrap gap-4" appRevealOnScroll>
          <a routerLink="/proyectos" class="btn-ghost">{{ 'projects.backToPortfolio' | t: locale.locale() }}</a>
          @if (project.demo_url) {
            <a [href]="project.demo_url" target="_blank" rel="noopener noreferrer" class="btn-primary gap-1.5">
              {{ 'projects.viewDemo' | t: locale.locale() }}
              <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
            </a>
          }
          @if (project.repo_url) {
            <a [href]="project.repo_url" target="_blank" rel="noopener noreferrer" class="btn-ghost gap-1.5">
              {{ 'projects.viewCode' | t: locale.locale() }}
              <span class="material-symbols-outlined" aria-hidden="true">code</span>
            </a>
          }
        </p>
      </article>
    }
  `,
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projects = inject(ProjectService);
  private readonly pageTitle = inject(Title);
  readonly locale = inject(LocaleService);

  readonly project$ = this.route.paramMap.pipe(
    switchMap((params) => this.projects.getBySlug(params.get('slug') ?? '')),
    filter((project): project is Project => !!project)
  );

  private readonly project = toSignal(this.project$);

  constructor() {
    // Static routes get their title from TranslatedTitleStrategy; this route's
    // title depends on async-loaded project data, so it's set here instead.
    effect(() => {
      const project = this.project();
      const locale = this.locale.locale();
      if (project) {
        this.pageTitle.setTitle(`${project.title[locale]} - Nikenver Pulgar`);
      }
    });
  }
}
