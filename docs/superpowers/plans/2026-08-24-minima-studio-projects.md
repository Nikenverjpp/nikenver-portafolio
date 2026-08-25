# Minima Studio Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Dekasa and Arcoweld as portfolio projects with real screenshots, fill the existing screenshot gaps in Sublimax and Cobeca, and make the Experience timeline render link screenshots the same way project detail already does.

**Architecture:** Content-only data changes to two JSON files (`projects.data.json`, `experiences.data.json`) plus one small Angular refactor: extract the existing link-preview-grid markup out of `project-detail.component.ts` into a shared standalone component and reuse it from `timeline-item.component.ts`.

**Tech Stack:** Angular 22 standalone components, Signals, static JSON data files (no backend, no test runner configured in this project — verification is `ng build` for compile correctness plus manual check against the running dev server, per this repo's established practice).

## Global Constraints

- Bilingual copy (`es`/`en`) on every new/edited `LocalizedText` field — never leave one locale empty.
- Spanish text must use real UTF-8 accents/ñ (verify by reading the file back, not by eyeballing the terminal).
- Match the existing case-study voice: plain, evidence-based, `<b>` tags only around genuine tech/product terms — no marketing adjectives that can't be backed by what the site actually shows.
- New/edited project and experience entries follow the exact JSON shape already used by sibling entries in the same file (field names, nesting) — no new optional fields invented.
- Preview images live at `frontend/public/img/previews/<slug>.webp`, WebP format, resized to 960px wide, quality 80 (matches the existing pipeline's file-size range: ~3–55 KB).
- No `thumbnail_url`/logo for Minima Studio, Dekasa, or Arcoweld — same as the existing Cobeca entries.

---

### Task 1: Capture and process the missing screenshots

**Files:**
- Create: `frontend/public/img/previews/dekasa.webp`
- Create: `frontend/public/img/previews/arcoweld.webp`
- Create: `frontend/public/img/previews/sublimax-tiktok.webp`
- Create: `frontend/public/img/previews/cobeca-pfl8.webp`
- Create: `frontend/public/img/previews/farmacia-saas.webp`

**Interfaces:**
- Produces: five WebP files under `frontend/public/img/previews/`, referenced by Task 2 and Task 3's JSON edits.

- [ ] **Step 1: Capture each page as a screenshot**

  Using the claude-in-chrome browser tools, for each URL below: navigate, then call the `computer` tool with `action: "screenshot"` and `save_to_disk: true` to get a local JPEG path.
  - `https://www.dekasa.com.ve/` → for `dekasa.webp`
  - `https://www.arcoweld.com/` → for `arcoweld.webp`
  - `https://www.tiktok.com/@sublimaxss_` → for `sublimax-tiktok.webp`
  - `https://pfl.drogueriascobeca.com/login` → for `cobeca-pfl8.webp` (public login page only — do not type into or submit the login form; the browser may autofill saved credentials on this page, do not interact with them)
  - `https://www.farmaciasaas.com/` → for `farmacia-saas.webp`

- [ ] **Step 2: Convert each JPEG to optimized WebP**

  Run from `frontend/`, once per captured file (confirmed working — `sharp-cli` runs fine via `npx` with no install step):

  ```bash
  npx --yes sharp-cli -i "<saved-jpg-path>" -o public/img/previews -f webp -q 80 resize 960
  ```

  This writes `public/img/previews/<original-basename>.webp`. Rename it to the target filename, e.g.:

  ```bash
  mv "public/img/previews/<original-basename>.webp" "public/img/previews/dekasa.webp"
  ```

  Repeat for all five captures.

- [ ] **Step 3: Verify the files**

  ```bash
  ls -la frontend/public/img/previews/dekasa.webp frontend/public/img/previews/arcoweld.webp frontend/public/img/previews/sublimax-tiktok.webp frontend/public/img/previews/cobeca-pfl8.webp frontend/public/img/previews/farmacia-saas.webp
  ```

  Expected: all five exist, each under ~100 KB (matches the size range of existing previews).

- [ ] **Step 4: Commit**

  ```bash
  git add frontend/public/img/previews/dekasa.webp frontend/public/img/previews/arcoweld.webp frontend/public/img/previews/sublimax-tiktok.webp frontend/public/img/previews/cobeca-pfl8.webp frontend/public/img/previews/farmacia-saas.webp
  git commit -m "Add live-site screenshots for Minima Studio projects and Cobeca/Sublimax gaps"
  ```

---

### Task 2: Add Dekasa and Arcoweld to `projects.data.json`, fix Sublimax/Cobeca gaps

**Files:**
- Modify: `frontend/src/app/core/data/projects.data.json`

**Interfaces:**
- Consumes: `frontend/public/img/previews/dekasa.webp`, `arcoweld.webp`, `sublimax-tiktok.webp` from Task 1.
- Produces: two new `Project` records (`Project` type from `frontend/src/app/core/models/project.model.ts`) that `ProjectService.list()`/`getBySlug()` will serve unchanged — no service code changes needed.

- [ ] **Step 1: Add `preview_image_url` to the Sublimax project's Instagram link, and a new TikTok preview**

  In the `"slug": "sublimax-ecommerce"` entry (id `"3"`), change the `links` array to:

  ```json
  "links": [
    {
      "label": { "es": "Instagram", "en": "Instagram" },
      "url": "https://www.instagram.com/sublimaxss_",
      "preview_image_url": "/img/previews/sublimax-instagram.webp"
    },
    {
      "label": { "es": "TikTok", "en": "TikTok" },
      "url": "https://www.tiktok.com/@sublimaxss_",
      "preview_image_url": "/img/previews/sublimax-tiktok.webp"
    }
  ],
  ```

- [ ] **Step 2: Add a main `preview_image_url` to the Cobeca corporate-apps project**

  In the `"slug": "cobeca-corporate-apps"` entry (id `"4"`), add this field right after `"company": "Grupo Cobeca",`:

  ```json
  "preview_image_url": "/img/previews/cobeca.webp",
  ```

- [ ] **Step 3: Append the Dekasa project entry**

  Add as the last element of the top-level array, right after the `cobeca-sic` entry (id `"6"`), with a leading comma added to the previous entry's closing `}`:

  ```json
  {
    "id": "7",
    "slug": "dekasa-porcelanato-revestimientos",
    "title": {
      "es": "Dekasa - Porcelanato y Revestimientos",
      "en": "Dekasa - Porcelain Tile & Home Fixtures"
    },
    "tagline": {
      "es": "Catálogo de e-commerce para porcelanato, baños y revestimientos",
      "en": "E-commerce catalog for porcelain tile, bathrooms and coatings"
    },
    "description": {
      "es": "Catálogo de e-commerce para Dekasa, tienda de porcelanato y revestimientos, construido en <b>WordPress</b> con <b>Elementor</b> y <b>WooCommerce</b> mientras trabajaba como freelance en Minima Studio.",
      "en": "E-commerce catalog for Dekasa, a porcelain tile and home fixtures store, built on <b>WordPress</b> with <b>Elementor</b> and <b>WooCommerce</b> while freelancing at Minima Studio."
    },
    "challenge": {
      "es": "El cliente necesitaba un catálogo online que organizara cientos de referencias de porcelanato, baños y revestimientos por categoría, con una experiencia de compra clara para un producto que la gente suele elegir en tienda física.",
      "en": "The client needed an online catalog to organize hundreds of porcelain tile, bathroom and coating references by category, with a shopping experience clear enough for a product people are used to picking out in a physical showroom."
    },
    "solution": {
      "es": "Desarrollo frontend sobre <b>WordPress</b>: maquetación con <b>Elementor</b>, integración de <b>WooCommerce</b> para el catálogo y el carrito, y estilos a medida para que categorías como revestimientos y baños se vean como una tienda de decoración, no como un catálogo genérico.",
      "en": "Front-end work on <b>WordPress</b>: page building with <b>Elementor</b>, <b>WooCommerce</b> integration for the catalog and cart, and custom styling so categories like coatings and bathrooms read like a home-decor store, not a generic catalog."
    },
    "results": {
      "es": "En producción, con su catálogo de productos organizado por categoría y checkout funcional en WooCommerce.",
      "en": "In production, with its product catalog organized by category and a working WooCommerce checkout."
    },
    "stack": ["WordPress", "WooCommerce", "Elementor", "PHP", "CSS"],
    "company": "Minima Studio",
    "preview_image_url": "/img/previews/dekasa.webp",
    "demo_url": "https://www.dekasa.com.ve/",
    "is_featured": true,
    "sort_order": 7,
    "year": 2023
  },
  ```

- [ ] **Step 4: Append the Arcoweld project entry**

  Add right after the Dekasa entry, as the new last element of the array:

  ```json
  {
    "id": "8",
    "slug": "arcoweld-soluciones-industriales",
    "title": {
      "es": "Arcoweld - Soluciones Industriales",
      "en": "Arcoweld - Industrial Solutions"
    },
    "tagline": {
      "es": "Catálogo de e-commerce industrial para soldadura, corte y seguridad",
      "en": "Industrial e-commerce catalog for welding, cutting and safety gear"
    },
    "description": {
      "es": "Catálogo de e-commerce industrial para Arcoweld, tienda de equipos y consumibles de soldadura, corte y seguridad, construido sobre <b>WordPress</b> mientras trabajaba como freelance en Minima Studio.",
      "en": "Industrial e-commerce catalog for Arcoweld, a store for welding, cutting and safety equipment, built on <b>WordPress</b> while freelancing at Minima Studio."
    },
    "challenge": {
      "es": "Migrar un catálogo industrial amplio (soldadura, corte, máquinas, gases, herramientas, seguridad) a una tienda online con cuentas de cliente y carrito, manteniendo la identidad de marca de cada fabricante representado.",
      "en": "Moving a wide industrial catalog (welding, cutting, machines, gases, tools, safety gear) into an online store with customer accounts and a cart, while keeping each represented brand's identity intact."
    },
    "solution": {
      "es": "Desarrollo frontend sobre un tema de <b>WordPress</b> a medida con <b>Bootstrap</b>: navegación por categoría de producto, secciones de marca y destacados, y fichas de producto sobre <b>WooCommerce</b>.",
      "en": "Front-end work on a custom <b>WordPress</b> theme with <b>Bootstrap</b>: category-based product navigation, brand and featured-product sections, and product cards built on top of <b>WooCommerce</b>."
    },
    "results": {
      "es": "En producción, con múltiples categorías de producto, cuentas de cliente y carrito de compra activos.",
      "en": "In production, with multiple product categories, customer accounts and a working shopping cart."
    },
    "stack": ["WordPress", "WooCommerce", "Bootstrap", "PHP", "JavaScript"],
    "company": "Minima Studio",
    "preview_image_url": "/img/previews/arcoweld.webp",
    "demo_url": "https://www.arcoweld.com/",
    "is_featured": true,
    "sort_order": 8,
    "year": 2023
  }
  ```

- [ ] **Step 5: Verify the JSON is well-formed**

  ```bash
  node -e "JSON.parse(require('fs').readFileSync('frontend/src/app/core/data/projects.data.json','utf8')); console.log('valid JSON')"
  ```

  Expected: prints `valid JSON` with no error.

- [ ] **Step 6: Verify accents/ñ are real UTF-8**

  ```bash
  node -e "const s=require('fs').readFileSync('frontend/src/app/core/data/projects.data.json','utf8'); console.log(/catálogo|categoría|múltiples/.test(s) ? 'accents ok' : 'MISSING ACCENTS')"
  ```

  Expected: prints `accents ok`.

- [ ] **Step 7: Commit**

  ```bash
  git add frontend/src/app/core/data/projects.data.json
  git commit -m "Add Dekasa and Arcoweld projects, fix Sublimax/Cobeca screenshot gaps"
  ```

---

### Task 3: Extract `LinkPreviewGridComponent` and use it in project detail

**Files:**
- Create: `frontend/src/app/shared/components/link-preview-grid.component.ts`
- Modify: `frontend/src/app/features/projects/project-detail.component.ts:116-153`

**Interfaces:**
- Consumes: `NamedLink[]` (`frontend/src/app/core/i18n/localized-text.model.ts:6-10`), `LocaleService` (`@core/i18n/locale.service`), `TranslatePipe` (`@core/i18n/translate.pipe`).
- Produces: `app-link-preview-grid` selector, `@Input({ required: true }) links!: NamedLink[]` — consumed by Task 4.

- [ ] **Step 1: Create the shared component**

  Write `frontend/src/app/shared/components/link-preview-grid.component.ts`:

  ```typescript
  import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
  import { NamedLink } from '@core/i18n/localized-text.model';
  import { LocaleService } from '@core/i18n/locale.service';
  import { TranslatePipe } from '@core/i18n/translate.pipe';

  @Component({
    selector: 'app-link-preview-grid',
    standalone: true,
    imports: [TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        @for (link of links; track link.url) {
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
    `,
  })
  export class LinkPreviewGridComponent {
    @Input({ required: true }) links!: NamedLink[];
    readonly locale = inject(LocaleService);
  }
  ```

- [ ] **Step 2: Use it from `project-detail.component.ts`**

  In `frontend/src/app/features/projects/project-detail.component.ts`, replace lines 116-153 (the `@if (project.links?.length) { ... }` block) with:

  ```typescript
          @if (project.links?.length) {
            <section appRevealOnScroll class="mt-8 max-w-3xl">
              <h2 class="font-display text-xl font-semibold text-text-primary">
                {{ 'projects.detailLinks' | t: locale.locale() }}
              </h2>
              <app-link-preview-grid [links]="project.links!" class="mt-3 block" />
            </section>
          }
  ```

  Add `LinkPreviewGridComponent` to the `imports` array (after `NotFoundComponent`) and its import statement (after the `NotFoundComponent` import):

  ```typescript
  import { LinkPreviewGridComponent } from '@components/link-preview-grid.component';
  ```

- [ ] **Step 3: Build to verify no compile errors**

  ```bash
  cd frontend && npx ng build
  ```

  Expected: build succeeds with no TypeScript/template errors.

- [ ] **Step 4: Manual check in the dev server**

  ```bash
  cd frontend && npx ng serve
  ```

  Open `/proyectos/cobeca-corporate-apps` (a project with 4 links) in a browser and confirm the links grid still renders identically to before (thumbnail + label, same hover behavior).

- [ ] **Step 5: Commit**

  ```bash
  git add frontend/src/app/shared/components/link-preview-grid.component.ts frontend/src/app/features/projects/project-detail.component.ts
  git commit -m "Extract LinkPreviewGridComponent from project-detail for reuse"
  ```

---

### Task 4: Use `LinkPreviewGridComponent` in the Experience timeline

**Files:**
- Modify: `frontend/src/app/shared/components/timeline-item.component.ts`

**Interfaces:**
- Consumes: `app-link-preview-grid` / `LinkPreviewGridComponent` from Task 3.

- [ ] **Step 1: Replace the plain-text links block**

  In `frontend/src/app/shared/components/timeline-item.component.ts`, replace lines 50-64 (the `@if (experience.links?.length) { ... }` block) with:

  ```typescript
      @if (experience.links?.length) {
        <div class="mt-3 mb-3">
          <app-link-preview-grid [links]="experience.links!" />
        </div>
      }
  ```

- [ ] **Step 2: Wire up the import**

  Add to the top of the file:

  ```typescript
  import { LinkPreviewGridComponent } from './link-preview-grid.component';
  ```

  Add `LinkPreviewGridComponent` to the `imports: [StackBadgesComponent, TranslatePipe]` array.

- [ ] **Step 3: Build to verify no compile errors**

  ```bash
  cd frontend && npx ng build
  ```

  Expected: build succeeds with no TypeScript/template errors.

- [ ] **Step 4: Commit**

  ```bash
  git add frontend/src/app/shared/components/timeline-item.component.ts
  git commit -m "Render experience links as a thumbnail grid instead of plain text"
  ```

---

### Task 5: Add the Minima Studio experience entry, backfill Cobeca link previews, reorder

**Files:**
- Modify: `frontend/src/app/core/data/experiences.data.json`

**Interfaces:**
- Consumes: `frontend/public/img/previews/dekasa.webp`, `arcoweld.webp`, `cobeca-pfl8.webp`, `farmacia-saas.webp` from Task 1, plus the existing `cobeca.webp`, `cobeca-stepweb.webp`, `cobeca-stepweb-junior.webp`, `cobeca-sic.webp`.

- [ ] **Step 1: Add `preview_image_url` to the Grupo Cobeca entry's 6 links**

  In the `"id": "2"` (Grupo Cobeca) entry, change `links` to:

  ```json
  "links": [
    { "label": { "es": "Negociaciones Cobeca", "en": "Negociaciones Cobeca" }, "url": "https://negociacionescobeca.com/home", "preview_image_url": "/img/previews/cobeca.webp" },
    { "label": { "es": "Step Web", "en": "Step Web" }, "url": "https://stepweb.drogueriascobeca.com/login", "preview_image_url": "/img/previews/cobeca-stepweb.webp" },
    { "label": { "es": "Step Web Junior", "en": "Step Web Junior" }, "url": "https://stepwebjunior.drogueriascobeca.com/login", "preview_image_url": "/img/previews/cobeca-stepweb-junior.webp" },
    { "label": { "es": "SIC", "en": "SIC" }, "url": "https://sic.drogueriascobeca.com/autenticacion", "preview_image_url": "/img/previews/cobeca-sic.webp" },
    { "label": { "es": "PFL8", "en": "PFL8" }, "url": "https://pfl.drogueriascobeca.com/login", "preview_image_url": "/img/previews/cobeca-pfl8.webp" },
    { "label": { "es": "Farmacia SaaS", "en": "Farmacia SaaS" }, "url": "https://www.farmaciasaas.com/", "preview_image_url": "/img/previews/farmacia-saas.webp" }
  ],
  ```

- [ ] **Step 2: Bump `sort_order` on Gandalf, Metro IT, Iconos, Panorama and Nivar by 1**

  Change `"sort_order": 3` → `4` on the Gandalf Comunicaciones entry (id `"3"`), `4` → `5` on Metro IT Service (id `"4"`), `5` → `6` on Iconos Consultores (id `"5"`), `6` → `7` on C.A. Diario Panorama (id `"6"`), `7` → `8` on Grupo Nivar (id `"7"`).

- [ ] **Step 3: Insert the Minima Studio entry**

  Add as a new element right after the Grupo Cobeca entry (id `"2"`) and before Gandalf Comunicaciones:

  ```json
  {
    "id": "8",
    "company": "Minima Studio",
    "role": { "es": "Frontend Developer Freelance", "en": "Freelance Frontend Developer" },
    "description": {
      "es": "Desarrollo frontend freelance para clientes de la agencia: catálogos de e-commerce en <b>WordPress</b> y <b>WooCommerce</b> para Dekasa y Arcoweld.",
      "en": "Freelance front-end development for agency clients: <b>WordPress</b>/<b>WooCommerce</b> e-commerce catalogs for Dekasa and Arcoweld."
    },
    "detail": {
      "es": "En 2023 hice desarrollo frontend freelance para clientes de Minima Studio, un estudio que cerró operaciones ese mismo año. Construí el catálogo de e-commerce de Dekasa (porcelanato y revestimientos) sobre <b>WordPress</b> con <b>Elementor</b> y <b>WooCommerce</b>, y el de Arcoweld (equipos industriales de soldadura) sobre un tema de <b>WordPress</b> a medida con <b>Bootstrap</b>, ambos con <b>WooCommerce</b> como motor del catálogo y el carrito.",
      "en": "In 2023 I did freelance front-end development for Minima Studio's clients, an agency that closed that same year. I built Dekasa's e-commerce catalog (porcelain tile and coatings) on <b>WordPress</b> with <b>Elementor</b> and <b>WooCommerce</b>, and Arcoweld's (industrial welding equipment) on a custom <b>WordPress</b> theme with <b>Bootstrap</b>, both powered by <b>WooCommerce</b> for the catalog and cart."
    },
    "stack": ["WordPress", "WooCommerce", "Elementor", "Bootstrap", "PHP", "JavaScript"],
    "links": [
      { "label": { "es": "Dekasa", "en": "Dekasa" }, "url": "https://www.dekasa.com.ve/", "preview_image_url": "/img/previews/dekasa.webp" },
      { "label": { "es": "Arcoweld", "en": "Arcoweld" }, "url": "https://www.arcoweld.com/", "preview_image_url": "/img/previews/arcoweld.webp" }
    ],
    "start_year": 2023,
    "end_year": 2023,
    "sort_order": 3
  },
  ```

- [ ] **Step 4: Verify the JSON is well-formed and accents are intact**

  ```bash
  node -e "JSON.parse(require('fs').readFileSync('frontend/src/app/core/data/experiences.data.json','utf8')); console.log('valid JSON')"
  node -e "const s=require('fs').readFileSync('frontend/src/app/core/data/experiences.data.json','utf8'); console.log(/catálogo|cerró|década/.test(s) || /catálogo|cerró/.test(s) ? 'accents ok' : 'CHECK ACCENTS')"
  ```

  Expected: `valid JSON`, and the accents check passes (adjust the regex to whatever accented words you actually used if it prints `CHECK ACCENTS`).

- [ ] **Step 5: Commit**

  ```bash
  git add frontend/src/app/core/data/experiences.data.json
  git commit -m "Add Minima Studio experience entry, backfill Cobeca link previews"
  ```

---

### Task 6: Full-site verification

**Files:** none (verification only)

- [ ] **Step 1: Production build**

  ```bash
  cd frontend && npx ng build
  ```

  Expected: succeeds with no errors or new warnings.

- [ ] **Step 2: Manual browser walkthrough**

  Run `npx ng serve` and check, in both `es` and `en` locales:
  - `/proyectos` — Dekasa and Arcoweld cards appear with screenshots; Cobeca corporate-apps card now has a screenshot.
  - `/proyectos/dekasa-porcelanato-revestimientos` and `/proyectos/arcoweld-soluciones-industriales` — full case study renders, links section not present (no `links` array on these two).
  - `/proyectos/sublimax-ecommerce` — both Instagram and TikTok link cards show their own screenshot.
  - `/sobre-mi` (About/Experience timeline) — Grupo Cobeca, Iconos Consultores, and the new Minima Studio entries show a thumbnail grid instead of plain text links; entries with no `links` (Gandalf, Metro IT, Panorama, Nivar) are unaffected.
  - Confirm the Experience timeline order still reads newest-to-oldest with Minima Studio between Grupo Cobeca and Gandalf.

- [ ] **Step 3: Report back**

  Summarize what was verified and flag anything that looks off before considering the plan complete.
