# Servicios Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `/servicios` page listing what Nikenver offers, backed by real project evidence, with no invented prices or claims.

**Architecture:** New static-data content type (`Service`) following the existing `Project`/`Experience` JSON-+-service pattern, rendered by one new standalone page component, wired into the router and the shell's nav.

**Tech Stack:** Angular 22 standalone components, Signals/RxJS, static JSON data, the site's own i18n service (`LocaleService` + `TranslatePipe` + `UI_STRINGS` dictionary). No test runner configured in this project — verification is `ng build` for compile correctness plus a manual check against the running dev server.

## Global Constraints

- Bilingual copy (`es`/`en`) on every new `LocalizedText` field — never leave one locale empty.
- Spanish text must use real UTF-8 accents/ñ (verify by reading the file back, not by eyeballing the terminal).
- No prices, ranges, testimonials, or invented metrics anywhere on this page — every service description ends with "cotización según alcance" (ES) / "quote based on scope" (EN) instead of a number.
- No contact form — the only CTA is a link to `/contacto`.
- Evidence links (`relatedProjectSlugs`) must point at slugs that already exist in `frontend/src/app/core/data/projects.data.json` (verify, don't assume).
- Follow the existing card-surface / `appRevealOnScroll` / `section-title` visual vocabulary already used across `home.component.ts`, `projects-list.component.ts`, and `about.component.ts` — no new component patterns invented for this page.

---

### Task 1: Add `services.*`, `nav.services`, `title.services`, `meta.services` translation keys

**Files:**
- Modify: `frontend/src/app/core/i18n/translations.ts`

**Interfaces:**
- Produces: string keys consumed by Task 3's template via `| t: locale.locale()`.

- [ ] **Step 1: Add nav/title/meta keys**

  In `frontend/src/app/core/i18n/translations.ts`, add `'title.services'` right after `'title.projects'`:

  ```typescript
  'title.services': { es: 'Servicios - Nikenver Pulgar', en: 'Services - Nikenver Pulgar' },
  ```

  Add `'meta.services'` right after `'meta.projects'`:

  ```typescript
  'meta.services': {
    es: 'Servicios de desarrollo web de Nikenver Pulgar: sistemas administrativos a medida, e-commerce, landing pages, mantenimiento y consultoría técnica.',
    en: 'Web development services by Nikenver Pulgar: custom administrative systems, e-commerce, landing pages, maintenance and technical consulting.',
  },
  ```

  Add `'nav.services'` right after `'nav.projects'`:

  ```typescript
  'nav.services': { es: 'Servicios', en: 'Services' },
  ```

- [ ] **Step 2: Add the `services.*` content keys**

  Add this block at the end of the `UI_STRINGS` object, right before the closing `};`:

  ```typescript
  'services.eyebrow': { es: 'Servicios', en: 'Services' },
  'services.title': { es: 'Qué ofrezco', en: 'What I offer' },
  'services.subtitle': {
    es: 'Sistemas reales para negocios reales — sin plantillas genéricas ni relleno.',
    en: 'Real systems for real businesses — no generic templates, no filler.',
  },
  'services.gridHeading': { es: 'Servicios disponibles', en: 'Available services' },
  'services.evidenceLabel': { es: 'Ejemplo real:', en: 'Real example:' },

  'services.processTitle': { es: 'Cómo trabajo', en: 'How I work' },
  'services.processSubtitle': { es: 'Un proceso claro, de principio a fin.', en: 'A clear process, start to finish.' },
  'services.processStep1Title': { es: 'Contacto inicial', en: 'Initial contact' },
  'services.processStep1Desc': {
    es: 'Me escribes por WhatsApp o correo y me cuentas qué necesitas.',
    en: 'You message me on WhatsApp or email and tell me what you need.',
  },
  'services.processStep2Title': { es: 'Propuesta y alcance', en: 'Proposal and scope' },
  'services.processStep2Desc': {
    es: 'Te devuelvo un alcance claro: qué incluye, qué no, y tiempo estimado, antes de empezar.',
    en: 'I send back a clear scope: what is included, what is not, and an estimated timeline, before starting.',
  },
  'services.processStep3Title': { es: 'Desarrollo', en: 'Development' },
  'services.processStep3Desc': {
    es: 'Construyo el sistema con avances que puedes revisar en el camino.',
    en: 'I build the system, with progress you can review along the way.',
  },
  'services.processStep4Title': { es: 'Entrega y soporte', en: 'Delivery and support' },
  'services.processStep4Desc': {
    es: 'Despliegue a producción y acompañamiento después de la entrega.',
    en: 'Production deployment and support after delivery.',
  },

  'services.whyTitle': { es: 'Por qué contratarme', en: 'Why hire me' },
  'services.why1Title': { es: 'Evidencia real, no relleno', en: 'Real evidence, not filler' },
  'services.why1Desc': {
    es: 'Cada sistema que ves en mis proyectos está en producción, no son mockups.',
    en: 'Every system you see in my projects is in production, not a mockup.',
  },
  'services.why2Title': { es: 'Perspectiva de dueño de negocio', en: 'A business-owner perspective' },
  'services.why2Desc': {
    es: 'Dirijo Sublimax, mi propio e-commerce, así que entiendo el lado de negocio, no solo el código.',
    en: 'I run Sublimax, my own e-commerce business, so I understand the business side, not just the code.',
  },
  'services.why3Title': { es: '10+ años full stack', en: '10+ years full stack' },
  'services.why3Desc': {
    es: 'Angular, Laravel, React, .NET — elijo el stack correcto para el proyecto, no el único que sé.',
    en: 'Angular, Laravel, React, .NET — I choose the right stack for the project, not just the one I know.',
  },
  'services.why4Title': { es: 'Desarrollo senior apoyado en IA', en: 'Senior development, AI-assisted' },
  'services.why4Desc': {
    es: 'Dirijo la arquitectura y reviso cada línea; la IA acelera la ejecución, no reemplaza el criterio.',
    en: "I drive the architecture and review every line; AI speeds up execution, it doesn't replace judgment.",
  },

  'services.ctaTitle': { es: '¿Tienes un proyecto en mente?', en: 'Have a project in mind?' },
  'services.ctaText': {
    es: 'Cuéntame qué necesitas y te respondo con una propuesta clara.',
    en: 'Tell me what you need and I will get back to you with a clear proposal.',
  },
  'services.ctaButton': { es: 'Hablemos', en: "Let's talk" },
  ```

- [ ] **Step 3: Verify the file is valid TypeScript and accents are real UTF-8**

  ```bash
  cd frontend && npx tsc --noEmit -p tsconfig.app.json 2>&1 | head -30
  node -e "const s=require('fs').readFileSync('src/app/core/i18n/translations.ts','utf8'); console.log(/cotización|dueño|así que/.test(s) ? 'accents ok' : 'CHECK ACCENTS')"
  ```

  Expected: no TypeScript errors referencing `translations.ts`, and `accents ok`.

- [ ] **Step 4: Commit**

  ```bash
  git add frontend/src/app/core/i18n/translations.ts
  git commit -m "Add translation keys for the Servicios page"
  ```

---

### Task 2: Add the `Service` model, data file, and `ServiceService`

**Files:**
- Create: `frontend/src/app/core/models/service.model.ts`
- Create: `frontend/src/app/core/data/services.data.json`
- Create: `frontend/src/app/core/api/service.service.ts`

**Interfaces:**
- Consumes: `LocalizedText` from `@core/i18n/localized-text.model`.
- Produces: `Service` interface and `ServiceService.list(): Observable<Service[]>` — consumed by Task 3.

- [ ] **Step 1: Write the model**

  Create `frontend/src/app/core/models/service.model.ts`:

  ```typescript
  import { LocalizedText } from '@core/i18n/localized-text.model';

  export interface Service {
    id: string;
    slug: string;
    title: LocalizedText;
    description: LocalizedText;
    icon: string;
    relatedProjectSlugs?: string[];
    sort_order: number;
  }
  ```

- [ ] **Step 2: Write the data file**

  Create `frontend/src/app/core/data/services.data.json`:

  ```json
  [
    {
      "id": "1",
      "slug": "sistemas-administrativos",
      "title": { "es": "Sistemas administrativos a medida", "en": "Custom administrative systems" },
      "description": {
        "es": "ERPs y paneles internos para inventario, ventas, crédito y cobranza. Cotización según alcance.",
        "en": "In-house ERPs and admin panels for inventory, sales, credit and collections. Quote based on scope."
      },
      "icon": "dashboard",
      "relatedProjectSlugs": ["subladmin-sistema-administrativo"],
      "sort_order": 1
    },
    {
      "id": "2",
      "slug": "ecommerce",
      "title": { "es": "E-commerce", "en": "E-commerce" },
      "description": {
        "es": "Tiendas online con catálogo, checkout y pagos en varias monedas, a medida o sobre WordPress/WooCommerce. Cotización según alcance.",
        "en": "Online stores with catalog, checkout and multi-currency payments, custom-built or on WordPress/WooCommerce. Quote based on scope."
      },
      "icon": "shopping_cart",
      "relatedProjectSlugs": ["axsence-perfumeria-premium", "dekasa-porcelanato-revestimientos"],
      "sort_order": 2
    },
    {
      "id": "3",
      "slug": "landing-pages",
      "title": { "es": "Landing pages y sitios institucionales", "en": "Landing pages and institutional sites" },
      "description": {
        "es": "Sitios de marca, presentación o campaña, listos para publicar. Cotización según alcance.",
        "en": "Brand, presentation or campaign sites, ready to publish. Quote based on scope."
      },
      "icon": "language",
      "relatedProjectSlugs": ["amavida-zulia", "wilmer-nadin-holistic-center"],
      "sort_order": 3
    },
    {
      "id": "4",
      "slug": "mantenimiento-soporte",
      "title": { "es": "Mantenimiento y soporte de sistemas existentes", "en": "Maintenance and support for existing systems" },
      "description": {
        "es": "Corrección de errores, nuevas funcionalidades y actualizaciones sobre un sistema que ya tienes en producción. Cotización según alcance.",
        "en": "Bug fixes, new features and updates on a system you already have in production. Quote based on scope."
      },
      "icon": "build",
      "relatedProjectSlugs": ["cobeca-corporate-apps"],
      "sort_order": 4
    },
    {
      "id": "5",
      "slug": "consultoria-tecnica",
      "title": { "es": "Consultoría técnica", "en": "Technical consulting" },
      "description": {
        "es": "Revisión de arquitectura, decisiones de stack o segunda opinión técnica antes de invertir en un desarrollo grande. Cotización según alcance.",
        "en": "Architecture review, stack decisions, or a second technical opinion before investing in a large build. Quote based on scope."
      },
      "icon": "insights",
      "sort_order": 5
    }
  ]
  ```

- [ ] **Step 3: Verify every `relatedProjectSlugs` entry exists in `projects.data.json`**

  ```bash
  cd frontend && node -e "
  const services = require('./src/app/core/data/services.data.json');
  const projects = require('./src/app/core/data/projects.data.json');
  const slugs = new Set(projects.map(p => p.slug));
  const missing = services.flatMap(s => s.relatedProjectSlugs ?? []).filter(s => !slugs.has(s));
  console.log(missing.length === 0 ? 'all evidence slugs valid' : 'MISSING SLUGS: ' + missing.join(', '));
  "
  ```

  Expected: `all evidence slugs valid`.

- [ ] **Step 4: Write the service layer**

  Create `frontend/src/app/core/api/service.service.ts`:

  ```typescript
  import { Injectable } from '@angular/core';
  import { Observable, of } from 'rxjs';
  import { Service } from '@core/models/service.model';
  import servicesData from '@core/data/services.data.json';

  const services = servicesData as Service[];

  @Injectable({ providedIn: 'root' })
  export class ServiceService {
    list(): Observable<Service[]> {
      return of([...services].sort((a, b) => a.sort_order - b.sort_order));
    }
  }
  ```

- [ ] **Step 5: Verify the JSON is valid and accents are real UTF-8**

  ```bash
  cd frontend && node -e "JSON.parse(require('fs').readFileSync('src/app/core/data/services.data.json','utf8')); console.log('valid JSON')"
  node -e "const s=require('fs').readFileSync('src/app/core/data/services.data.json','utf8'); console.log(/cotización|Consultoría|corrección/.test(s) ? 'accents ok' : 'CHECK ACCENTS')"
  ```

  Expected: `valid JSON` and `accents ok`.

- [ ] **Step 6: Commit**

  ```bash
  git add frontend/src/app/core/models/service.model.ts frontend/src/app/core/data/services.data.json frontend/src/app/core/api/service.service.ts
  git commit -m "Add Service model, data, and ServiceService"
  ```

---

### Task 3: Build the `ServicesComponent` page

**Files:**
- Create: `frontend/src/app/features/services/services.component.ts`

**Interfaces:**
- Consumes: `ServiceService.list()` (Task 2), `ProjectService.list()` (`@core/api/project.service`, existing), `LocaleService`, `TranslatePipe`, `RevealOnScrollDirective` (all existing, same as `home.component.ts`).
- Produces: `ServicesComponent`, wired into the router by Task 4.

- [ ] **Step 1: Write the component**

  Create `frontend/src/app/features/services/services.component.ts`:

  ```typescript
  import { AsyncPipe } from '@angular/common';
  import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
  import { RouterLink } from '@angular/router';
  import { combineLatest, map } from 'rxjs';
  import { Project } from '@core/models/project.model';
  import { ProjectService } from '@core/api/project.service';
  import { ServiceService } from '@core/api/service.service';
  import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
  import { LocaleService } from '@core/i18n/locale.service';
  import { TranslatePipe } from '@core/i18n/translate.pipe';

  @Component({
    selector: 'app-services',
    standalone: true,
    imports: [AsyncPipe, RouterLink, RevealOnScrollDirective, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
      <section class="container-page py-16 sm:py-24">
        <header appRevealOnScroll>
          <p class="font-sans text-sm text-accent-cyan">{{ 'services.eyebrow' | t: locale.locale() }}</p>
          <h1 class="section-title mt-3">{{ 'services.title' | t: locale.locale() }}</h1>
          <p class="mt-2 max-w-2xl text-text-secondary">{{ 'services.subtitle' | t: locale.locale() }}</p>
        </header>

        <h2 class="sr-only">{{ 'services.gridHeading' | t: locale.locale() }}</h2>
        <section class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @if (services$ | async; as services) {
            @for (service of services; track service.slug) {
              <article appRevealOnScroll class="card-surface p-6">
                <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">{{
                  service.icon
                }}</span>
                <h3 class="mt-3 font-display text-xl font-semibold text-text-primary">
                  {{ service.title | t: locale.locale() }}
                </h3>
                <p class="mt-2 text-sm text-text-secondary">{{ service.description | t: locale.locale() }}</p>
                @if (service.relatedProjects.length) {
                  <p class="mt-4 text-xs text-text-muted">
                    {{ 'services.evidenceLabel' | t: locale.locale() }}
                    @for (project of service.relatedProjects; track project.slug; let last = $last) {
                      <a [routerLink]="['/proyectos', project.slug]" class="text-accent-cyan hover:underline">{{
                        project.title | t: locale.locale()
                      }}</a
                      >{{ last ? '' : ', ' }}
                    }
                  </p>
                }
              </article>
            }
          }
        </section>
      </section>

      <section class="container-page pb-24">
        <header appRevealOnScroll class="mb-10">
          <h2 class="section-title">{{ 'services.processTitle' | t: locale.locale() }}</h2>
          <p class="mt-2 text-text-secondary">{{ 'services.processSubtitle' | t: locale.locale() }}</p>
        </header>
        <ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li appRevealOnScroll class="card-surface p-6">
            <span class="font-display text-3xl font-bold text-accent-cyan">1</span>
            <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
              {{ 'services.processStep1Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep1Desc' | t: locale.locale() }}</p>
          </li>
          <li appRevealOnScroll class="card-surface p-6">
            <span class="font-display text-3xl font-bold text-accent-cyan">2</span>
            <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
              {{ 'services.processStep2Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep2Desc' | t: locale.locale() }}</p>
          </li>
          <li appRevealOnScroll class="card-surface p-6">
            <span class="font-display text-3xl font-bold text-accent-cyan">3</span>
            <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
              {{ 'services.processStep3Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep3Desc' | t: locale.locale() }}</p>
          </li>
          <li appRevealOnScroll class="card-surface p-6">
            <span class="font-display text-3xl font-bold text-accent-cyan">4</span>
            <h3 class="mt-2 font-display text-lg font-semibold text-text-primary">
              {{ 'services.processStep4Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.processStep4Desc' | t: locale.locale() }}</p>
          </li>
        </ol>
      </section>

      <section class="container-page pb-24">
        <header appRevealOnScroll class="mb-10">
          <h2 class="section-title">{{ 'services.whyTitle' | t: locale.locale() }}</h2>
        </header>
        <div class="grid gap-6 sm:grid-cols-2">
          <article appRevealOnScroll class="card-surface p-6">
            <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">verified</span>
            <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
              {{ 'services.why1Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.why1Desc' | t: locale.locale() }}</p>
          </article>
          <article appRevealOnScroll class="card-surface p-6">
            <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">storefront</span>
            <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
              {{ 'services.why2Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.why2Desc' | t: locale.locale() }}</p>
          </article>
          <article appRevealOnScroll class="card-surface p-6">
            <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">layers</span>
            <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
              {{ 'services.why3Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.why3Desc' | t: locale.locale() }}</p>
          </article>
          <article appRevealOnScroll class="card-surface p-6">
            <span class="material-symbols-outlined text-2xl text-accent-cyan" aria-hidden="true">auto_awesome</span>
            <h3 class="mt-3 font-display text-lg font-semibold text-text-primary">
              {{ 'services.why4Title' | t: locale.locale() }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ 'services.why4Desc' | t: locale.locale() }}</p>
          </article>
        </div>
      </section>

      <section class="container-page pb-24">
        <article
          appRevealOnScroll
          class="card-surface flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <section>
            <h2 class="section-title text-2xl sm:text-3xl">{{ 'services.ctaTitle' | t: locale.locale() }}</h2>
            <p class="mt-2 text-text-secondary">{{ 'services.ctaText' | t: locale.locale() }}</p>
          </section>
          <a routerLink="/contacto" class="btn-primary shrink-0">{{ 'services.ctaButton' | t: locale.locale() }}</a>
        </article>
      </section>
    `,
  })
  export class ServicesComponent {
    private readonly serviceApi = inject(ServiceService);
    private readonly projectApi = inject(ProjectService);
    readonly locale = inject(LocaleService);

    readonly services$ = combineLatest([this.serviceApi.list(), this.projectApi.list()]).pipe(
      map(([services, projects]) =>
        services.map((service) => ({
          ...service,
          relatedProjects: (service.relatedProjectSlugs ?? [])
            .map((slug) => projects.find((p) => p.slug === slug))
            .filter((p): p is Project => !!p),
        }))
      )
    );
  }
  ```

- [ ] **Step 2: Build to verify no compile errors**

  ```bash
  cd frontend && npx ng build 2>&1 | tail -20
  ```

  Expected: build succeeds (the route isn't wired up yet, so no new prerendered page — this step only confirms the component itself compiles once Task 4 imports it; if the build errors on an unused-file basis, that's fine, re-run this check after Task 4 instead).

- [ ] **Step 3: Commit**

  ```bash
  git add frontend/src/app/features/services/services.component.ts
  git commit -m "Add ServicesComponent"
  ```

---

### Task 4: Wire up the route and nav link

**Files:**
- Modify: `frontend/src/app/app.routes.ts`
- Modify: `frontend/src/app/layout/shell.component.ts:203-208`

**Interfaces:**
- Consumes: `ServicesComponent` (Task 3), `'nav.services'`/`'title.services'`/`'meta.services'` (Task 1).

- [ ] **Step 1: Add the route**

  In `frontend/src/app/app.routes.ts`, insert a new route between `proyectos/:slug` and `contacto`:

  ```typescript
    {
      path: 'servicios',
      loadComponent: () =>
        import('@features/services/services.component').then((m) => m.ServicesComponent),
      title: 'title.services',
      data: { description: 'meta.services' },
    },
  ```

- [ ] **Step 2: Add the nav link**

  In `frontend/src/app/layout/shell.component.ts`, change the `navLinks` array to insert Services between Projects and Contact:

  ```typescript
    readonly navLinks = [
      { path: '/', labelKey: 'nav.home', exact: true },
      { path: '/sobre-mi', labelKey: 'nav.about', exact: false },
      { path: '/proyectos', labelKey: 'nav.projects', exact: false },
      { path: '/servicios', labelKey: 'nav.services', exact: false },
      { path: '/contacto', labelKey: 'nav.contact', exact: false },
    ];
  ```

- [ ] **Step 3: Build to verify no compile errors and the route prerenders**

  ```bash
  cd frontend && npx ng build 2>&1 | tail -25
  ```

  Expected: build succeeds; the "Prerendered N static routes" count increases by 2 (one per locale-independent static route — compare against the count from before this task).

- [ ] **Step 4: Commit**

  ```bash
  git add frontend/src/app/app.routes.ts frontend/src/app/layout/shell.component.ts
  git commit -m "Wire up /servicios route and nav link"
  ```

---

### Task 5: Full-site verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server and check the page in the browser**

  ```bash
  cd frontend && npx ng serve --port 4300
  ```

  Open `http://localhost:4300/servicios` in both `es` and `en` locales and confirm:
  - Nav shows "Servicios" between "Proyectos" and "Contacto", and highlights active on this route.
  - All 5 service cards render with icon, title, description ending in "cotización según alcance" / "quote based on scope" — no prices anywhere.
  - Evidence links under each card (where present) point to the correct project and use that project's real title.
  - "Cómo trabajo" shows all 4 numbered steps.
  - "Por qué contratarme" shows all 4 points.
  - The bottom CTA button goes to `/contacto`.
  - Switching theme (light/dark) and locale (es/en) doesn't break the layout.

- [ ] **Step 2: Report back**

  Summarize what was verified and flag anything that looks off before considering the plan complete.
