import { AsyncPipe, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, effect, inject, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { switchMap } from 'rxjs';
import { PROJECT_STATUS_LABEL_KEYS, Project } from '@core/models/project.model';
import { ProjectService } from '@core/api/project.service';
import { StackBadgesComponent } from '@components/stack-badges.component';
import { SocialCarouselComponent } from '@components/social-carousel.component';
import { NotFoundComponent } from '@components/not-found.component';
import { LinkPreviewGridComponent } from '@components/link-preview-grid.component';
import { PhoneVideoComponent } from '@components/phone-video.component';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { UI_STRINGS } from '@core/i18n/translations';

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
    NotFoundComponent,
    LinkPreviewGridComponent,
    PhoneVideoComponent,
    RevealOnScrollDirective,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (project$ | async; as project) {
      <article class="container-page py-16 sm:py-24">
        <p class="font-sans text-sm text-accent-cyan" appRevealOnScroll>
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
          @if (project.preview_caption) {
            <p class="mt-2 max-w-3xl font-sans text-xs text-text-muted">{{ project.preview_caption | t: locale.locale() }}</p>
          }
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
            <div class="flex flex-wrap items-center gap-2">
              @if (project.year) {
                <p class="font-sans text-xs text-text-muted">{{ project.year }}</p>
              }
              <span class="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-sans text-xs text-text-secondary">
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  [class.bg-accent-cyan]="project.status === 'production'"
                  [class.bg-accent-amber]="project.status !== 'production'"
                  aria-hidden="true"
                ></span>
                {{ statusKeys[project.status] | t: locale.locale() }}
              </span>
              @if (project.has_cicd) {
                <span
                  class="inline-flex items-center gap-1 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-2.5 py-0.5 font-sans text-xs font-medium text-accent-cyan"
                  [title]="'projects.cicdTooltip' | t: locale.locale()"
                >
                  <span class="material-symbols-outlined text-[13px] leading-none" aria-hidden="true">sync</span>
                  {{ 'projects.cicdBadge' | t: locale.locale() }}
                </span>
              }
            </div>
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

        @if (project.videos?.length) {
          <section appRevealOnScroll class="mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailVideos' | t: locale.locale() }}
            </h2>
            <div class="mt-5 flex flex-wrap justify-center gap-8 sm:justify-start">
              @for (video of project.videos; track video.src) {
                <app-phone-video [video]="video" class="block w-full max-w-[17.5rem]" />
              }
            </div>
          </section>
        }

        @if (project.contribution) {
          <section appRevealOnScroll class="card-surface mt-8 max-w-3xl p-6">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailContribution' | t: locale.locale() }}
            </h2>
            <p class="mt-3 leading-relaxed text-text-secondary">{{ project.contribution | t: locale.locale() }}</p>
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

        @for (group of project.feature_groups; track group.title.es) {
          <section appRevealOnScroll class="prose-portfolio mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">{{ group.title | t: locale.locale() }}</h2>
            <ul class="mt-3 list-disc space-y-2 pl-5 text-left">
              @for (item of group.items; track item.es) {
                <li [innerHTML]="item | t: locale.locale()"></li>
              }
            </ul>
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

        @if (project.metrics?.length) {
          <section appRevealOnScroll class="card-surface mt-8 max-w-3xl overflow-x-auto p-6">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailMetrics' | t: locale.locale() }}
            </h2>
            <table class="mt-4 w-full border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-border font-sans text-xs text-text-muted">
                  <th scope="col" class="py-2 pr-4 font-medium">{{ 'projects.metricName' | t: locale.locale() }}</th>
                  <th scope="col" class="py-2 pr-4 font-medium">{{ 'projects.metricBefore' | t: locale.locale() }}</th>
                  <th scope="col" class="py-2 font-medium">{{ 'projects.metricAfter' | t: locale.locale() }}</th>
                </tr>
              </thead>
              <tbody>
                @for (metric of project.metrics; track metric.label.es) {
                  <tr class="border-b border-border/60 last:border-0">
                    <th scope="row" class="py-2.5 pr-4 font-normal text-text-secondary">{{ metric.label | t: locale.locale() }}</th>
                    <td class="whitespace-nowrap py-2.5 pr-4 text-text-muted">{{ metric.before | t: locale.locale() }}</td>
                    <td class="whitespace-nowrap py-2.5 font-semibold text-text-primary">{{ metric.after | t: locale.locale() }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </section>
        }

        @if (project.gallery?.length) {
          <section appRevealOnScroll class="mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailGallery' | t: locale.locale() }}
            </h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              @for (image of project.gallery; track image.src) {
                <figure>
                  <a [href]="image.src" target="_blank" rel="noopener noreferrer" class="card-surface block overflow-hidden">
                    <img
                      [src]="image.src"
                      [alt]="image.alt | t: locale.locale()"
                      [attr.width]="image.width"
                      [attr.height]="image.height"
                      loading="lazy"
                      decoding="async"
                      class="h-auto w-full"
                    />
                  </a>
                  <figcaption class="mt-2 font-sans text-xs text-text-muted">{{ image.caption | t: locale.locale() }}</figcaption>
                </figure>
              }
            </div>
          </section>
        }

        @if (project.has_cicd && project.cicd) {
          <section appRevealOnScroll class="card-surface mt-8 max-w-3xl overflow-hidden rounded-xl border border-accent-cyan/20 p-6">
            <div class="flex items-center gap-2.5 text-accent-cyan">
              <span class="material-symbols-outlined text-xl" aria-hidden="true">published_with_changes</span>
              <h2 class="font-display text-lg font-semibold text-text-primary">
                {{ 'projects.cicdSectionTitle' | t: locale.locale() }}
              </h2>
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div class="rounded-lg border border-border/80 bg-bg-primary/60 p-4">
                <div class="flex items-center gap-2 font-display text-sm font-semibold text-accent-cyan">
                  <span class="material-symbols-outlined text-base" aria-hidden="true">rule</span>
                  {{ 'projects.ciTitle' | t: locale.locale() }}
                </div>
                <p class="mt-2 text-sm leading-relaxed text-text-secondary">
                  {{ project.cicd.ci | t: locale.locale() }}
                </p>
              </div>

              <div class="rounded-lg border border-border/80 bg-bg-primary/60 p-4">
                <div class="flex items-center gap-2 font-display text-sm font-semibold text-accent-amber">
                  <span class="material-symbols-outlined text-base" aria-hidden="true">rocket_launch</span>
                  {{ 'projects.cdTitle' | t: locale.locale() }}
                </div>
                <p class="mt-2 text-sm leading-relaxed text-text-secondary">
                  {{ project.cicd.cd | t: locale.locale() }}
                </p>
              </div>
            </div>
          </section>
        }

        @if (project.links?.length) {
          <section appRevealOnScroll class="mt-8 max-w-3xl">
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.detailLinks' | t: locale.locale() }}
            </h2>
            <app-link-preview-grid [links]="project.links!" class="mt-3 block" />
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
              {{ (project.requires_login ? 'projects.viewSystem' : 'projects.viewDemo') | t: locale.locale() }}
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
        @if (project.demo_url && project.requires_login) {
          <p class="mt-4 flex max-w-xl items-start gap-2 text-sm text-text-muted" appRevealOnScroll>
            <span class="material-symbols-outlined !text-base" aria-hidden="true">lock</span>
            {{ 'projects.loginNotice' | t: locale.locale() }}
          </p>
        }

        <section
          appRevealOnScroll
          class="card-surface mt-12 flex max-w-3xl flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <h2 class="font-display text-xl font-semibold text-text-primary">
              {{ 'projects.ctaTitle' | t: locale.locale() }}
            </h2>
            <p class="mt-2 text-text-secondary">{{ 'projects.ctaText' | t: locale.locale() }}</p>
          </div>
          <p class="flex shrink-0 flex-wrap gap-3">
            <a routerLink="/contacto" class="btn-primary">{{ 'projects.ctaContact' | t: locale.locale() }}</a>
            <a routerLink="/servicios" class="btn-ghost">{{ 'home.ctaServices' | t: locale.locale() }}</a>
          </p>
        </section>
      </article>
    } @else {
      <app-not-found titleKey="notFound.projectTitle" [showProjectsLink]="true" />
    }
  `,
})
export class ProjectDetailComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projects = inject(ProjectService);
  private readonly pageTitle = inject(Title);
  private readonly pageMeta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly locale = inject(LocaleService);
  readonly statusKeys = PROJECT_STATUS_LABEL_KEYS;

  readonly project$ = this.route.paramMap.pipe(
    switchMap((params) => this.projects.getBySlug(params.get('slug') ?? ''))
  );

  private readonly projectSignal = toSignal(this.project$);

  constructor() {
    // Static routes get their title from TranslatedTitleStrategy; this route's
    // title depends on async-loaded project data, so it's set here instead.
    effect(() => {
      const project = this.projectSignal();
      const locale = this.locale.locale();
      if (project) {
        const title = `${project.title[locale]} - Nikenver Pulgar`;
        this.pageTitle.setTitle(title);
        this.pageMeta.updateTag({ property: 'og:title', content: title });
        this.pageMeta.updateTag({ name: 'twitter:title', content: title });
        const description = project.seo_description[locale];
        this.pageMeta.updateTag({ name: 'description', content: description });
        this.pageMeta.updateTag({ property: 'og:description', content: description });
        this.pageMeta.updateTag({ name: 'twitter:description', content: description });
        const image = project.preview_image_url
          ? `${SITE_ORIGIN}${project.preview_image_url}`
          : `${SITE_ORIGIN}/img/nikenver-pulgar.webp`;
        this.pageMeta.updateTag({ property: 'og:image', content: image });
        this.pageMeta.updateTag({ name: 'twitter:image', content: image });

        this.updateJsonLd(project, locale, description, image);
      } else {
        this.pageTitle.setTitle(UI_STRINGS['notFound.projectTitle'][locale]);
      }
    });
  }

  private updateJsonLd(
    project: Project,
    locale: 'es' | 'en',
    description: string,
    image: string
  ): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': project.schema_type ?? 'SoftwareApplication',
          name: project.title[locale],
          description,
          image,
          url: `${SITE_ORIGIN}/proyectos/${project.slug}`,
          ...(project.schema_type
            ? {}
            : { applicationCategory: 'WebApplication', operatingSystem: 'Web Browser' }),
          keywords: project.stack?.join(', '),
          // `contribution` marks shared work, so the schema doesn't claim sole authorship.
          [project.contribution ? 'contributor' : 'author']: {
            '@type': 'Person',
            '@id': `${SITE_ORIGIN}/#person`,
            name: 'Nikenver Pulgar',
            url: `${SITE_ORIGIN}/`,
          },
          ...(project.year ? { dateCreated: `${project.year}` } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: locale === 'es' ? 'Inicio' : 'Home',
              item: `${SITE_ORIGIN}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: locale === 'es' ? 'Proyectos' : 'Projects',
              item: `${SITE_ORIGIN}/proyectos`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: project.title[locale],
              item: `${SITE_ORIGIN}/proyectos/${project.slug}`,
            },
          ],
        },
      ],
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
    if (isPlatformBrowser(this.platformId)) {
      this.document.getElementById(JSONLD_SCRIPT_ID)?.remove();
      // Reset to the default profile image so a later static route doesn't inherit this project's og:image.
      const defaultImage = `${SITE_ORIGIN}/img/nikenver-pulgar.webp`;
      this.pageMeta.updateTag({ property: 'og:image', content: defaultImage });
      this.pageMeta.updateTag({ name: 'twitter:image', content: defaultImage });
    }
  }
}
