import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, signal, computed, effect, OnDestroy, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '@core/api/project.service';
import { ProjectCardComponent } from '@components/project-card.component';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { UI_STRINGS } from '@core/i18n/translations';

const SITE_ORIGIN = 'https://nikenver-portafolio.vercel.app';
const ITEMLIST_JSONLD_ID = 'projects-itemlist-jsonld';
const FAQ_JSONLD_ID = 'projects-faq-jsonld';

type ProjectFilter = 'all' | 'cicd' | 'angular' | 'laravel' | 'ecommerce' | 'erp' | 'dotnet' | 'wordpress';

interface FilterOption {
  key: ProjectFilter;
  labelKey: string;
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCardComponent, RevealOnScrollDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="container-page py-16 sm:py-24">
      <header appRevealOnScroll>
        <div class="flex flex-wrap items-center gap-3">
          <p class="font-sans text-sm text-accent-cyan">{{ 'projects.eyebrow' | t: locale.locale() }}</p>
          <span class="rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted">
            {{ allProjects().length }} {{ 'projects.countBadge' | t: locale.locale() }}
          </span>
        </div>
        <h1 class="section-title mt-3">{{ 'projects.title' | t: locale.locale() }}</h1>
        <p class="mt-2 max-w-2xl text-text-secondary">
          {{ 'projects.subtitle' | t: locale.locale() }}
        </p>

        <!-- Filtros reactivos por Stack y Solución -->
        <nav
          aria-label="Filtros de proyectos"
          class="mt-8 flex flex-wrap items-center gap-2"
        >
          @for (f of filterOptions; track f.key) {
            <button
              type="button"
              (click)="setFilter(f.key)"
              [attr.aria-pressed]="activeFilter() === f.key"
              class="min-h-11 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm"
              [class.bg-accent-cyan]="activeFilter() === f.key"
              [class.text-bg-primary]="activeFilter() === f.key"
              [class.font-semibold]="activeFilter() === f.key"
              [class.border]="activeFilter() !== f.key"
              [class.border-border]="activeFilter() !== f.key"
              [class.bg-bg-elevated]="activeFilter() !== f.key"
              [class.text-text-secondary]="activeFilter() !== f.key"
              [class.hover:border-accent-cyan/40]="activeFilter() !== f.key"
              [class.hover:text-text-primary]="activeFilter() !== f.key"
            >
              {{ f.labelKey | t: locale.locale() }}
            </button>
          }
        </nav>
      </header>

      <h2 class="sr-only">{{ 'projects.gridHeading' | t: locale.locale() }}</h2>

      @if (filteredProjects().length > 0) {
        <section class="mt-10 grid items-start gap-6 md:grid-cols-2">
          @for (project of filteredProjects(); track project.id) {
            <app-project-card [project]="project" appRevealOnScroll />
          }
        </section>
      } @else {
        <p class="mt-12 rounded-xl border border-border bg-bg-elevated p-8 text-center text-text-secondary">
          {{ 'projects.emptyFilter' | t: locale.locale() }}
        </p>
      }

      <!-- Sección de Preguntas Frecuentes Técnicas (AIO / SEO Rich Snippets) -->
      <section class="mt-24 border-t border-border/80 pt-16" appRevealOnScroll>
        <header class="mb-8">
          <p class="font-sans text-sm text-accent-cyan">FAQ</p>
          <h2 class="section-title mt-2 text-2xl sm:text-3xl">{{ 'projects.faqTitle' | t: locale.locale() }}</h2>
          <p class="mt-2 max-w-2xl text-text-secondary">
            {{ 'projects.faqSubtitle' | t: locale.locale() }}
          </p>
        </header>

        <div class="grid gap-4">
          <details class="group card-surface overflow-hidden rounded-xl border border-border p-5 transition-all open:border-accent-cyan/40">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-accent-cyan sm:text-lg">
              <span>{{ 'projects.faq1Question' | t: locale.locale() }}</span>
              <span class="material-symbols-outlined shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true">expand_more</span>
            </summary>
            <p class="mt-4 border-t border-border/60 pt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {{ 'projects.faq1Answer' | t: locale.locale() }}
            </p>
          </details>

          <details class="group card-surface overflow-hidden rounded-xl border border-border p-5 transition-all open:border-accent-cyan/40">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-accent-cyan sm:text-lg">
              <span>{{ 'projects.faq2Question' | t: locale.locale() }}</span>
              <span class="material-symbols-outlined shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true">expand_more</span>
            </summary>
            <p class="mt-4 border-t border-border/60 pt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {{ 'projects.faq2Answer' | t: locale.locale() }}
            </p>
          </details>

          <details class="group card-surface overflow-hidden rounded-xl border border-border p-5 transition-all open:border-accent-cyan/40">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-accent-cyan sm:text-lg">
              <span>{{ 'projects.faq3Question' | t: locale.locale() }}</span>
              <span class="material-symbols-outlined shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true">expand_more</span>
            </summary>
            <p class="mt-4 border-t border-border/60 pt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {{ 'projects.faq3Answer' | t: locale.locale() }}
            </p>
          </details>

          <details class="group card-surface overflow-hidden rounded-xl border border-border p-5 transition-all open:border-accent-cyan/40">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-accent-cyan sm:text-lg">
              <span>{{ 'projects.faq4Question' | t: locale.locale() }}</span>
              <span class="material-symbols-outlined shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true">expand_more</span>
            </summary>
            <p class="mt-4 border-t border-border/60 pt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {{ 'projects.faq4Answer' | t: locale.locale() }}
            </p>
          </details>

          <details class="group card-surface overflow-hidden rounded-xl border border-border p-5 transition-all open:border-accent-cyan/40">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-accent-cyan sm:text-lg">
              <span>{{ 'projects.faq5Question' | t: locale.locale() }}</span>
              <span class="material-symbols-outlined shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true">expand_more</span>
            </summary>
            <p class="mt-4 border-t border-border/60 pt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {{ 'projects.faq5Answer' | t: locale.locale() }}
            </p>
          </details>
        </div>
      </section>
    </section>
  `,
})
export class ProjectsListComponent implements OnDestroy {
  private readonly projectService = inject(ProjectService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly locale = inject(LocaleService);

  readonly allProjects = toSignal(this.projectService.list(), { requireSync: true });
  readonly activeFilter = signal<ProjectFilter>('all');

  readonly filterOptions: FilterOption[] = [
    { key: 'all', labelKey: 'projects.filterAll' },
    { key: 'cicd', labelKey: 'projects.filterCicd' },
    { key: 'angular', labelKey: 'projects.filterAngular' },
    { key: 'laravel', labelKey: 'projects.filterLaravel' },
    { key: 'erp', labelKey: 'projects.filterErp' },
    { key: 'ecommerce', labelKey: 'projects.filterEcommerce' },
    { key: 'dotnet', labelKey: 'projects.filterDotNet' },
    { key: 'wordpress', labelKey: 'projects.filterWordpress' },
  ];

  readonly filteredProjects = computed(() => {
    const list = this.allProjects();
    const filter = this.activeFilter();

    if (filter === 'all') {
      return list;
    }

    return list.filter((project) => {
      const stack = project.stack ?? [];
      const slug = project.slug.toLowerCase();

      switch (filter) {
        case 'cicd':
          return !!project.has_cicd || stack.includes('CI/CD');
        case 'angular':
          return stack.includes('Angular');
        case 'laravel':
          return stack.includes('Laravel');
        case 'erp':
          return slug.includes('subladmin') || slug.includes('cobeca');
        case 'ecommerce':
          return (
            slug.includes('ecommerce') ||
            slug.includes('catalogo') ||
            slug.includes('axsence') ||
            stack.includes('WooCommerce') ||
            stack.includes('PrestaShop')
          );
        case 'dotnet':
          return stack.includes('.NET');
        case 'wordpress':
          return stack.includes('WordPress');
        default:
          return true;
      }
    });
  });

  constructor() {
    // Sincrónico para garantizar que el prerenderizado SSG contenga los scripts en el HTML
    this.updateItemListJsonLd(this.allProjects(), this.locale.locale());
    this.updateFaqJsonLd(this.locale.locale());

    effect(() => {
      const projects = this.allProjects();
      const loc = this.locale.locale();
      this.updateItemListJsonLd(projects, loc);
      this.updateFaqJsonLd(loc);
    });
  }

  setFilter(filter: ProjectFilter): void {
    this.activeFilter.set(filter);
  }

  private updateItemListJsonLd(projects: typeof this.allProjects extends () => infer T ? T : never, loc: 'es' | 'en'): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: loc === 'es' ? 'Proyectos de Software y Casos de Estudio de Nikenver Pulgar' : 'Software Projects and Case Studies by Nikenver Pulgar',
      description:
        loc === 'es'
          ? 'Casos de estudio reales en producción con Angular, Laravel, PostgreSQL y .NET.'
          : 'Real production case studies built with Angular, Laravel, PostgreSQL and .NET.',
      url: `${SITE_ORIGIN}/proyectos`,
      numberOfItems: projects.length,
      itemListElement: projects.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_ORIGIN}/proyectos/${p.slug}`,
        name: p.title[loc],
        description: (p.tagline?.[loc] ?? p.description?.[loc])?.replace(/<\/?[^>]+>/g, ''),
      })),
    };

    let script = this.document.getElementById(ITEMLIST_JSONLD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = ITEMLIST_JSONLD_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }

  private updateFaqJsonLd(loc: 'es' | 'en'): void {
    const faqData = [
      {
        question: UI_STRINGS['projects.faq1Question'][loc],
        answer: UI_STRINGS['projects.faq1Answer'][loc],
      },
      {
        question: UI_STRINGS['projects.faq2Question'][loc],
        answer: UI_STRINGS['projects.faq2Answer'][loc],
      },
      {
        question: UI_STRINGS['projects.faq3Question'][loc],
        answer: UI_STRINGS['projects.faq3Answer'][loc],
      },
      {
        question: UI_STRINGS['projects.faq4Question'][loc],
        answer: UI_STRINGS['projects.faq4Answer'][loc],
      },
      {
        question: UI_STRINGS['projects.faq5Question'][loc],
        answer: UI_STRINGS['projects.faq5Answer'][loc],
      },
    ];

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    let script = this.document.getElementById(FAQ_JSONLD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = FAQ_JSONLD_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.getElementById(ITEMLIST_JSONLD_ID)?.remove();
      this.document.getElementById(FAQ_JSONLD_ID)?.remove();
    }
  }
}
