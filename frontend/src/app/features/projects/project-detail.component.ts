import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter, switchMap } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/api/project.service';
import { StackBadgesComponent } from '../../shared/components/stack-badges.component';
import { SocialCarouselComponent } from '../../shared/components/social-carousel.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '../../core/i18n/locale.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

const SITE_ORIGIN = 'https://nikenver-portafolio.vercel.app';
const JSONLD_SCRIPT_ID = 'project-jsonld';

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
            <p [innerHTML]="project.description | t: locale.locale()"></p>
          </section>
        }

        @if (project.challenge) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailChallenge' | t: locale.locale() }}
            </h2>
            <p [innerHTML]="project.challenge | t: locale.locale()"></p>
          </section>
        }

        @if (project.solution) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailSolution' | t: locale.locale() }}
            </h2>
            <p [innerHTML]="project.solution | t: locale.locale()"></p>
          </section>
        }

        @if (project.results) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailResults' | t: locale.locale() }}
            </h2>
            <p [innerHTML]="project.results | t: locale.locale()"></p>
          </section>
        }

        @if (project.links?.length) {
          <section appRevealOnScroll class="mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailLinks' | t: locale.locale() }}
            </h2>
            <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              @for (link of project.links; track link.url) {
                <a
                  [href]="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="card-surface group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-accent-cyan/40"
                >
                  @if (link.preview_image_url) {
                    <span class="block h-20 w-full overflow-hidden bg-bg-primary">
                      <img
                        [src]="link.preview_image_url"
                        [alt]="''"
                        aria-hidden="true"
                        width="640"
                        height="360"
                        loading="lazy"
                        decoding="async"
                        class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                  }
                  <span
                    class="flex items-center justify-between gap-1 px-3 py-2 text-xs font-medium text-text-secondary group-hover:text-accent-cyan"
                  >
                    {{ link.label | t: locale.locale() }}
                    <span class="material-symbols-outlined !text-sm" aria-hidden="true">open_in_new</span>
                  </span>
                </a>
              }
            </div>
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
export class ProjectDetailComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projects = inject(ProjectService);
  private readonly pageTitle = inject(Title);
  private readonly pageMeta = inject(Meta);
  private readonly document = inject(DOCUMENT);
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
        const title = `${project.title[locale]} - Nikenver Pulgar`;
        this.pageTitle.setTitle(title);
        this.pageMeta.updateTag({ property: 'og:title', content: title });
        this.pageMeta.updateTag({ name: 'twitter:title', content: title });
        // description can carry <b> tags for on-page rendering; strip them here since
        // this value only ever lands in plain-text meta tags / JSON-LD, never innerHTML.
        const description = (project.tagline?.[locale] ?? project.description?.[locale])?.replace(
          /<\/?[^>]+>/g,
          ''
        );
        if (description) {
          this.pageMeta.updateTag({ name: 'description', content: description });
          this.pageMeta.updateTag({ property: 'og:description', content: description });
          this.pageMeta.updateTag({ name: 'twitter:description', content: description });
        }
        const image = project.preview_image_url
          ? `${SITE_ORIGIN}${project.preview_image_url}`
          : `${SITE_ORIGIN}/img/nikenver-pulgar.webp`;
        this.pageMeta.updateTag({ property: 'og:image', content: image });
        this.pageMeta.updateTag({ name: 'twitter:image', content: image });

        this.updateJsonLd(project, locale, description, image);
      }
    });
  }

  private updateJsonLd(
    project: Project,
    locale: 'es' | 'en',
    description: string | undefined,
    image: string
  ): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title[locale],
      description,
      image,
      url: `${SITE_ORIGIN}/proyectos/${project.slug}`,
      keywords: project.stack?.join(', '),
      author: { '@type': 'Person', name: 'Nikenver Pulgar', url: SITE_ORIGIN },
      ...(project.year ? { dateCreated: `${project.year}` } : {}),
    };

    let script = this.document.getElementById(JSONLD_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSONLD_SCRIPT_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }

  ngOnDestroy(): void {
    this.document.getElementById(JSONLD_SCRIPT_ID)?.remove();
    // Reset to the default profile image so a later static route doesn't inherit this project's og:image.
    const defaultImage = `${SITE_ORIGIN}/img/nikenver-pulgar.webp`;
    this.pageMeta.updateTag({ property: 'og:image', content: defaultImage });
    this.pageMeta.updateTag({ name: 'twitter:image', content: defaultImage });
  }
}
