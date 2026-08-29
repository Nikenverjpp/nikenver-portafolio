# CV PDF Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Descargar CV" button to `/sobre-mi` that generates a locale-aware CV PDF client-side from the same data the page already renders.

**Architecture:** New `CvPdfService` lazy-loads `pdfmake` (dynamic `import()`, so it never enters the initial bundle) and builds a pdfmake `docDefinition` from `ExperienceService`, the shared skills/courses data, and the existing `about.*` / `shared.*` i18n keys. The button on `AboutComponent` triggers it and tracks an idle/generating/error state via a signal.

**Tech Stack:** Angular 22 standalone components, Signals, `pdfmake` 0.3.x (client-side PDF generation, MIT license), the site's own i18n service (`LocaleService` + `UI_STRINGS`). No test runner configured in this project — verification is `ng build` for compile correctness plus a manual check against the running dev server (same pattern as `docs/superpowers/plans/2026-08-25-services-page.md`).

## Global Constraints

- Spanish text must use real UTF-8 accents/ñ (verify by reading the file back, not by eyeballing the terminal).
- No new brand-font embedding — the PDF uses pdfmake's bundled Roboto font, not Syne/IBM Plex.
- `pdfmake` and its font data must be lazy-loaded via dynamic `import()` inside `CvPdfService.download()` — never a static top-level import — so the ~1.8MB (unminified) library never touches the initial bundle or the `500kB`/`1MB` initial-bundle budget in `angular.json`.
- The PDF's language must follow `LocaleService.locale()` at the moment the button is clicked, not a fixed language.
- Reuse `description` (not `detail`) for each experience entry, and reuse `SKILL_GROUPS` / `COURSE_GROUPS` as already defined in `about.component.ts` — no new content invented.
- No backend/server-side generation — this ships as part of the existing 100%-static Angular build.

---

### Task 1: Extract `skillGroups`/`courseGroups` into shared data

**Files:**
- Create: `frontend/src/app/core/data/skills.data.ts`
- Modify: `frontend/src/app/features/about/about.component.ts:120-201`

**Interfaces:**
- Produces: `SkillGroup`, `CourseItem`, `CourseGroup` interfaces and `SKILL_GROUPS: SkillGroup[]`, `COURSE_GROUPS: CourseGroup[]` constants — consumed by `AboutComponent` (this task) and `CvPdfService` (Task 4).

This is a pure refactor: today `about.component.ts` defines `skillGroups`/`courseGroups` as inline class fields. `CvPdfService` needs the exact same data, so it moves to a shared file both can import — no content changes.

- [ ] **Step 1: Create the shared data file**

  Create `frontend/src/app/core/data/skills.data.ts`:

  ```typescript
  import { LocalizedText } from '@core/i18n/localized-text.model';

  export interface SkillGroup {
    titleKey: string;
    items: string[];
  }

  export type CourseItem = LocalizedText;

  export interface CourseGroup {
    titleKey: string;
    items: CourseItem[];
  }

  export const SKILL_GROUPS: SkillGroup[] = [
    {
      titleKey: 'about.skillFrontend',
      items: ['Angular', 'React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap'],
    },
    {
      titleKey: 'about.skillBackend',
      items: ['Laravel', 'PHP', 'REST APIs', 'PostgreSQL', 'MySQL'],
    },
    {
      titleKey: 'about.skillOther',
      items: ['Prompt Engineering', 'WordPress', '.NET (C#)', 'Git', 'Docker (básico)', 'Cloudinary'],
    },
    {
      titleKey: 'about.skillFragrance',
      items: [
        'Diagnóstico olfativo',
        'Layering de fragancias',
        'Matching de perfumes',
        'Familias olfativas',
      ],
    },
  ];

  export const COURSE_GROUPS: CourseGroup[] = [
    {
      titleKey: 'about.skillFrontend',
      items: [
        {
          es: 'Angular desde Cero a Experto: Crear una Aplicación Real',
          en: 'Angular from Scratch to Expert: Build a Real App',
        },
        { es: 'React: de Cero a Experto (Hooks y MERN)', en: 'React: From Scratch to Expert (Hooks & MERN)' },
        { es: 'Curso Profesional de JavaScript', en: 'Professional JavaScript Course' },
      ],
    },
    {
      titleKey: 'about.skillBackend',
      items: [
        {
          es: 'Aprende a Crear una Plataforma de Cursos con Laravel',
          en: 'Learn to Build a Course Platform with Laravel',
        },
        {
          es: 'Desarrollo Web en PHP con Laravel 5.6, VueJS y MariaDB MySQL',
          en: 'Web Development in PHP with Laravel 5.6, VueJS and MariaDB MySQL',
        },
        {
          es: 'Curso de Laravel y Livewire - Crea un Sistema de Parking',
          en: 'Laravel and Livewire Course - Build a Parking System',
        },
        {
          es: 'Construyendo Web APIs RESTful con ASP.NET Core 6',
          en: 'Building RESTful Web APIs with ASP.NET Core 6',
        },
        { es: 'Curso de Refactorización con PHP', en: 'PHP Refactoring Course' },
        { es: 'Curso de Laravel 10 desde Cero', en: 'Laravel 10 From Scratch' },
      ],
    },
    {
      titleKey: 'about.skillOther',
      items: [
        { es: 'Diplomado: Webmaster', en: 'Diploma: Webmaster' },
        { es: 'Diplomado: Diseño de Medios Web', en: 'Diploma: Web Media Design' },
        {
          es: 'Diseño Gráfico, Edición de Video y Programación Web con IA (2026)',
          en: 'Graphic Design, Video Editing and Web Programming with AI (2026)',
        },
        {
          es: 'Diplomado Internacional en Marketing Digital con IA (2026)',
          en: 'International Diploma in Digital Marketing with AI (2026)',
        },
      ],
    },
  ];
  ```

- [ ] **Step 2: Point `about.component.ts` at the shared data**

  In `frontend/src/app/features/about/about.component.ts`, add the import near the top (after the `TranslatePipe` import):

  ```typescript
  import { SKILL_GROUPS, COURSE_GROUPS } from '@core/data/skills.data';
  ```

  Replace the entire `readonly skillGroups = [...]` block (lines 126-148 in the current file) with:

  ```typescript
    readonly skillGroups = SKILL_GROUPS;
  ```

  Replace the entire `readonly courseGroups = [...]` block (lines 150-200 in the current file) with:

  ```typescript
    readonly courseGroups = COURSE_GROUPS;
  ```

- [ ] **Step 3: Build to verify no compile errors**

  ```bash
  cd frontend && npx ng build 2>&1 | tail -25
  ```

  Expected: build succeeds, no TypeScript errors.

- [ ] **Step 4: Manual check — `/sobre-mi` still renders skills/courses identically**

  ```bash
  cd frontend && npx ng serve --port 4300
  ```

  Open `http://localhost:4300/sobre-mi`, confirm the "Stack tecnológico" and "Cursos y diplomados" sections render exactly as before (same groups, same items, same order) in both `es` and `en`.

- [ ] **Step 5: Commit**

  ```bash
  git add frontend/src/app/core/data/skills.data.ts frontend/src/app/features/about/about.component.ts
  git commit -m "Extract skill/course groups into shared data for reuse in CV export"
  ```

---

### Task 2: Install `pdfmake` and add ambient type declarations

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/types/pdfmake.d.ts`

**Interfaces:**
- Produces: ambient module declarations for `pdfmake/build/pdfmake` (default export `PdfMakeStatic`) and `pdfmake/build/fonts/Roboto` (default export `{ vfs, fonts }`) — consumed by `CvPdfService` (Task 4).

`pdfmake` ships no `.d.ts` files, and `@types/pdfmake` on npm only covers up to `0.3.3` (stale against the `addVirtualFileSystem`/`addFonts` API used here), so this plan uses local ambient declarations scoped to only what's actually called, instead of an inaccurate third-party types package.

- [ ] **Step 1: Install the dependency**

  ```bash
  cd frontend && npm install pdfmake@^0.3.11
  ```

  Expected: `pdfmake` (and its own dependencies `pdfkit`, `linebreak`, `xmldoc`) added to `frontend/package.json` dependencies and `frontend/package-lock.json`.

- [ ] **Step 2: Add the ambient type declarations**

  Create `frontend/src/types/pdfmake.d.ts`:

  ```typescript
  declare module 'pdfmake/build/pdfmake' {
    export interface PdfMakeDocument {
      download(filename?: string): Promise<void>;
    }

    export interface PdfMakeStatic {
      addVirtualFileSystem(vfs: Record<string, string>): void;
      addFonts(fonts: Record<string, Record<string, string>>): void;
      createPdf(docDefinition: Record<string, unknown>): PdfMakeDocument;
    }

    const pdfMake: PdfMakeStatic;
    export default pdfMake;
  }

  declare module 'pdfmake/build/fonts/Roboto' {
    interface RobotoFontContainer {
      vfs: Record<string, string>;
      fonts: Record<string, Record<string, string>>;
    }

    const fontContainer: RobotoFontContainer;
    export default fontContainer;
  }
  ```

- [ ] **Step 3: Verify TypeScript resolves both modules**

  Create a throwaway file to smoke-test the types, run the check, then delete it:

  ```bash
  cd frontend
  cat > src/app/_pdfmake-smoke-test.ts << 'EOF'
  async function smoke() {
    const [{ default: pdfMake }, { default: fonts }] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/fonts/Roboto'),
    ]);
    pdfMake.addVirtualFileSystem(fonts.vfs);
    pdfMake.addFonts(fonts.fonts);
    await pdfMake.createPdf({ content: ['hi'] }).download('x.pdf');
  }
  void smoke;
  EOF
  npx tsc --noEmit -p tsconfig.app.json 2>&1 | tail -30
  rm src/app/_pdfmake-smoke-test.ts
  ```

  Expected: no errors referencing `_pdfmake-smoke-test.ts` or `pdfmake`.

- [ ] **Step 4: Commit**

  ```bash
  git add frontend/package.json frontend/package-lock.json frontend/src/types/pdfmake.d.ts
  git commit -m "Add pdfmake dependency and ambient type declarations"
  ```

---

### Task 3: Add CV button translation keys

**Files:**
- Modify: `frontend/src/app/core/i18n/translations.ts`

**Interfaces:**
- Produces: `'about.downloadCv'`, `'about.downloadCvGenerating'`, `'about.downloadCvError'` string keys — consumed by `AboutComponent`'s template (Task 5).

- [ ] **Step 1: Add the keys**

  In `frontend/src/app/core/i18n/translations.ts`, add these right after `'about.coursesTitle'` (currently the last `about.*` key, at line 119):

  ```typescript
    'about.downloadCv': { es: 'Descargar CV', en: 'Download CV' },
    'about.downloadCvGenerating': { es: 'Generando PDF…', en: 'Generating PDF…' },
    'about.downloadCvError': {
      es: 'No se pudo generar el PDF, intenta de nuevo',
      en: 'Could not generate the PDF, try again',
    },
  ```

- [ ] **Step 2: Verify the file is valid TypeScript and accents are real UTF-8**

  ```bash
  cd frontend && npx tsc --noEmit -p tsconfig.app.json 2>&1 | head -30
  node -e "const s=require('fs').readFileSync('src/app/core/i18n/translations.ts','utf8'); console.log(/Generando PDF/.test(s) ? 'accents ok' : 'CHECK ACCENTS')"
  ```

  Expected: no TypeScript errors referencing `translations.ts`, and `accents ok`.

- [ ] **Step 3: Commit**

  ```bash
  git add frontend/src/app/core/i18n/translations.ts
  git commit -m "Add translation keys for the CV download button"
  ```

---

### Task 4: Build `CvPdfService`

**Files:**
- Create: `frontend/src/app/core/pdf/cv-pdf.service.ts`

**Interfaces:**
- Consumes: `ExperienceService.list()` (`@core/api/experience.service`, existing), `SKILL_GROUPS`/`COURSE_GROUPS` (Task 1), `UI_STRINGS` (`@core/i18n/translations`, existing), `Locale` (`@core/i18n/locale.service`, existing), `environment.contact` (`@env/environment`, existing), `pdfmake/build/pdfmake` + `pdfmake/build/fonts/Roboto` (Task 2).
- Produces: `CvPdfService` with `download(locale: Locale): Promise<void>` — consumed by `AboutComponent` (Task 5).

- [ ] **Step 1: Write the service**

  Create `frontend/src/app/core/pdf/cv-pdf.service.ts`:

  ```typescript
  import { Injectable, inject } from '@angular/core';
  import { firstValueFrom } from 'rxjs';
  import { environment } from '@env/environment';
  import { ExperienceService } from '@core/api/experience.service';
  import { Experience } from '@core/models/experience.model';
  import { SKILL_GROUPS, COURSE_GROUPS } from '@core/data/skills.data';
  import { Locale } from '@core/i18n/locale.service';
  import { UI_STRINGS } from '@core/i18n/translations';

  function t(key: string, locale: Locale): string {
    const entry = UI_STRINGS[key];
    return entry ? (entry[locale] ?? entry.es) : key;
  }

  interface TextRun {
    text: string;
    bold?: boolean;
  }

  function boldRuns(html: string): TextRun[] {
    const runs: TextRun[] = [];
    const regex = /<b>(.*?)<\/b>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        runs.push({ text: html.slice(lastIndex, match.index) });
      }
      runs.push({ text: match[1], bold: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < html.length) {
      runs.push({ text: html.slice(lastIndex) });
    }
    return runs;
  }

  function yearRange(exp: Experience, locale: Locale): string {
    const present = locale === 'es' ? 'Presente' : 'Present';
    const end = exp.end_year == null ? present : String(exp.end_year);
    return exp.start_year ? `${exp.start_year} - ${end}` : end;
  }

  @Injectable({ providedIn: 'root' })
  export class CvPdfService {
    private readonly experienceApi = inject(ExperienceService);

    async download(locale: Locale): Promise<void> {
      const experiences = await firstValueFrom(this.experienceApi.list());

      const [{ default: pdfMake }, { default: fontContainer }] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/fonts/Roboto'),
      ]);
      pdfMake.addVirtualFileSystem(fontContainer.vfs);
      pdfMake.addFonts(fontContainer.fonts);

      const docDefinition = this.buildDocDefinition(locale, experiences);
      await pdfMake.createPdf(docDefinition).download(`nikenver-pulgar-cv-${locale}.pdf`);
    }

    private buildDocDefinition(locale: Locale, experiences: Experience[]): Record<string, unknown> {
      const contact = environment.contact;
      const contactLine = [
        contact.email,
        contact.phoneDisplay,
        contact.linkedin.replace(/^https?:\/\//, ''),
      ].join('  ·  ');

      const summary = (['about.paragraph1', 'about.paragraph2', 'about.paragraph3'] as const).map((key) => ({
        text: boldRuns(t(key, locale)),
        fontSize: 9.5,
        margin: [0, 0, 0, 6] as [number, number, number, number],
      }));

      const experienceBlocks = experiences.map((exp) => ({
        margin: [0, 0, 0, 10] as [number, number, number, number],
        stack: [
          {
            columns: [
              { text: exp.role[locale] ?? exp.role.es, bold: true, fontSize: 11 },
              { text: yearRange(exp, locale), alignment: 'right', color: '#666666', fontSize: 9 },
            ],
          },
          { text: exp.company, italics: true, fontSize: 10, color: '#666666' },
          ...(exp.description
            ? [
                {
                  text: boldRuns(exp.description[locale] ?? exp.description.es),
                  fontSize: 9.5,
                  margin: [0, 2, 0, 0] as [number, number, number, number],
                },
              ]
            : []),
          ...(exp.stack?.length
            ? [
                {
                  text: exp.stack.join('  ·  '),
                  fontSize: 8.5,
                  color: '#0e7fbf',
                  margin: [0, 3, 0, 0] as [number, number, number, number],
                },
              ]
            : []),
        ],
      }));

      const skillLines = SKILL_GROUPS.map((group) => ({
        text: `${t(group.titleKey, locale)}: ${group.items.join(', ')}`,
        fontSize: 9.5,
        margin: [0, 2, 0, 0] as [number, number, number, number],
      }));

      const courseBlocks = COURSE_GROUPS.flatMap((group) => [
        { text: t(group.titleKey, locale), bold: true, fontSize: 10, margin: [0, 6, 0, 2] as [number, number, number, number] },
        { ul: group.items.map((item) => item[locale] ?? item.es), fontSize: 9 },
      ]);

      return {
        pageMargins: [40, 40, 40, 40] as [number, number, number, number],
        defaultStyle: { font: 'Roboto', fontSize: 10 },
        styles: {
          name: { fontSize: 20, bold: true },
          eyebrow: { fontSize: 11, color: '#0e7fbf', margin: [0, 2, 0, 0] },
          sectionTitle: { fontSize: 13, bold: true, margin: [0, 14, 0, 6] },
        },
        content: [
          { text: contact.name, style: 'name' },
          { text: t('about.eyebrow', locale), style: 'eyebrow' },
          { text: contactLine, fontSize: 9.5, color: '#444444', margin: [0, 4, 0, 12] },
          ...summary,
          { text: t('shared.experienceTitle', locale), style: 'sectionTitle' },
          ...experienceBlocks,
          { text: t('about.stackTitle', locale), style: 'sectionTitle' },
          ...skillLines,
          { text: t('about.coursesTitle', locale), style: 'sectionTitle' },
          ...courseBlocks,
        ],
      };
    }
  }
  ```

- [ ] **Step 2: Build to verify no compile errors**

  ```bash
  cd frontend && npx ng build 2>&1 | tail -25
  ```

  Expected: build succeeds. `CvPdfService` isn't imported anywhere yet, so this only confirms the file itself type-checks; the dynamic `import()` calls aren't resolved into a chunk until something references the service (Task 5).

- [ ] **Step 3: Commit**

  ```bash
  git add frontend/src/app/core/pdf/cv-pdf.service.ts
  git commit -m "Add CvPdfService for client-side CV PDF generation"
  ```

---

### Task 5: Wire the download button into `AboutComponent`

**Files:**
- Modify: `frontend/src/app/features/about/about.component.ts`

**Interfaces:**
- Consumes: `CvPdfService.download(locale: Locale): Promise<void>` (Task 4), `'about.downloadCv'`/`'about.downloadCvGenerating'`/`'about.downloadCvError'` (Task 3).

- [ ] **Step 1: Add the import and inject the service**

  In `frontend/src/app/features/about/about.component.ts`, add to the imports at the top:

  ```typescript
  import { CvPdfService } from '@core/pdf/cv-pdf.service';
  ```

  In the `AboutComponent` class body, add alongside the existing `private readonly experiences = inject(ExperienceService);`:

  ```typescript
    private readonly cvPdf = inject(CvPdfService);
    readonly cvState = signal<'idle' | 'generating' | 'error'>('idle');
  ```

  Add this method to the class:

  ```typescript
    async downloadCv(): Promise<void> {
      if (this.cvState() === 'generating') {
        return;
      }
      this.cvState.set('generating');
      try {
        await this.cvPdf.download(this.locale.locale());
        this.cvState.set('idle');
      } catch {
        this.cvState.set('error');
        setTimeout(() => this.cvState.set('idle'), 4000);
      }
    }
  ```

- [ ] **Step 2: Add the button to the template**

  In the same file's template, replace the blank line between the bio block's closing `</div>` (line 63) and the experience `<section class="mt-16">` (line 65) with this block, so it reads:

  ```typescript
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
  ```

- [ ] **Step 3: Build to verify no compile errors**

  ```bash
  cd frontend && npx ng build 2>&1 | tail -30
  ```

  Expected: build succeeds. Check the build output for a new lazy chunk (listed separately from the initial `main-*.js`/`chunk-*.js` files, roughly 1-2MB) — this is the `pdfmake` + Roboto font chunk; confirm the "Initial total" size reported by the build is unaffected (still comfortably under the 1MB error budget in `angular.json`).

- [ ] **Step 4: Commit**

  ```bash
  git add frontend/src/app/features/about/about.component.ts
  git commit -m "Add CV PDF download button to /sobre-mi"
  ```

---

### Task 6: Full manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

  ```bash
  cd frontend && npx ng serve --port 4300
  ```

- [ ] **Step 2: Verify in Spanish**

  Open `http://localhost:4300/sobre-mi` with the site locale set to `es`. Click "Descargar CV":
  - Button shows a spinner + "Generando PDF…" briefly, then returns to "Descargar CV".
  - A file named `nikenver-pulgar-cv-es.pdf` downloads.
  - Open the PDF: name, "Sobre mí" eyebrow, contact line (email/phone/linkedin), all 3 summary paragraphs (with bold terms preserved, no literal `<b>` text), every experience entry from the page (company, role, years, description, stack), the same skill groups, and the same course groups all appear.
  - Select some text in the PDF viewer to confirm it's real, copyable text — not an image.

- [ ] **Step 3: Verify in English**

  Toggle the site to `en`, repeat step 2 on `/about` (or the English-locale route), confirm the file is named `nikenver-pulgar-cv-en.pdf` and all content is in English.

- [ ] **Step 4: Verify error handling doesn't break the page**

  In devtools, throttle the network to "Offline", click "Descargar CV" (this should fail the dynamic `import()`), confirm the button shows the error state and returns to idle after a few seconds, and the rest of `/sobre-mi` remains fully usable. Restore the network afterward.

- [ ] **Step 5: Report back**

  Summarize what was verified (both locales, text-selectability, error handling, bundle budget) and flag anything that looks off before considering the plan complete.
