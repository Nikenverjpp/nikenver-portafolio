# Umami Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load Umami Cloud's cookieless pageview-tracking script, but only for real visitors of the production build — never during `ng serve`, and never during the build-time prerendering pass.

**Architecture:** A small `AnalyticsService` (`providedIn: 'root'`), injected once from `AppComponent`'s constructor (same bootstrap pattern already used for `ThemeService`/`LocaleService`), appends Umami's `<script>` tag to `document.head` — but only when both `isPlatformBrowser` is true and `environment.analyticsWebsiteId` is set.

**Tech Stack:** Angular 22 standalone components/services, existing `environment.ts`/`environment.prod.ts` + `fileReplacements` pattern, `@angular/common`'s `isPlatformBrowser`.

## Global Constraints

- The script must never load during `ng serve` (dev) or during the build-time prerendering pass — only for a real browser loading the production build.
- The Umami Website ID lives in `environment.prod.ts`, not hardcoded in the service (same pattern as `contact`/`apiUrl`/`siteUrl`).
- Website ID: `2ff3c3b2-178d-40db-ab98-a506958d768f`.
- No cookie-consent UI — out of scope, Umami is cookieless.
- No custom event tracking (e.g. CV button clicks) — pageviews only, per spec's Out of Scope section.

---

### Task 1: Add `AnalyticsService` and wire it into bootstrap

**Files:**
- Modify: `frontend/src/environments/environment.ts`
- Modify: `frontend/src/environments/environment.prod.ts`
- Create: `frontend/src/app/core/analytics/analytics.service.ts`
- Modify: `frontend/src/app/app.component.ts`

**Interfaces:**
- Consumes: `environment.analyticsWebsiteId: string | null` (this task defines it in both environment files).
- Produces: `AnalyticsService` (`providedIn: 'root'`, no public methods — all side-effect happens in the constructor), injected by `AppComponent`.

This is a single task: the environment fields, the service, and the bootstrap wiring only make sense together — there's no way to test "loads only in prod" without all three pieces in place at once.

- [ ] **Step 1: Add `analyticsWebsiteId` to both environment files**

  In `frontend/src/environments/environment.ts`, add `analyticsWebsiteId: null,` inside the `environment` object, after `contact: { ... },`:

  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000/api',
    siteUrl: 'http://localhost:4200',
    contact: {
      name: 'Nikenver Pulgar',
      email: 'nikenverp@gmail.com',
      phone: '+584120736425',
      phoneDisplay: '(+58) 412-0736425',
      linkedin: 'https://linkedin.com/in/nikenver',
    },
    analyticsWebsiteId: null as string | null,
  };
  ```

  In `frontend/src/environments/environment.prod.ts`, add the real ID, same shape:

  ```typescript
  export const environment = {
    production: true,
    apiUrl: 'https://api.nikenver.dev/api',
    siteUrl: 'https://nikenver.dev',
    contact: {
      name: 'Nikenver Pulgar',
      email: 'nikenverp@gmail.com',
      phone: '+584120736425',
      phoneDisplay: '(+58) 412-0736425',
      linkedin: 'https://linkedin.com/in/nikenver',
    },
    analyticsWebsiteId: '2ff3c3b2-178d-40db-ab98-a506958d768f' as string | null,
  };
  ```

  The `as string | null` cast on both files keeps the two environment objects structurally identical (same inferred type for `analyticsWebsiteId` in both), which is what lets `AnalyticsService` (Step 2) treat `environment.analyticsWebsiteId` as `string | null` regardless of which file got swapped in by `fileReplacements`.

- [ ] **Step 2: Write `AnalyticsService`**

  Create `frontend/src/app/core/analytics/analytics.service.ts`:

  ```typescript
  import { Injectable, PLATFORM_ID, inject } from '@angular/core';
  import { isPlatformBrowser } from '@angular/common';
  import { environment } from '@env/environment';

  @Injectable({ providedIn: 'root' })
  export class AnalyticsService {
    constructor() {
      const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
      const websiteId = environment.analyticsWebsiteId;
      if (!isBrowser || !websiteId) {
        return;
      }

      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://cloud.umami.is/script.js';
      script.setAttribute('data-website-id', websiteId);
      document.head.appendChild(script);
    }
  }
  ```

- [ ] **Step 3: Inject `AnalyticsService` from `AppComponent`**

  In `frontend/src/app/app.component.ts`, add the import:

  ```typescript
  import { AnalyticsService } from '@core/analytics/analytics.service';
  ```

  In the class body, add alongside the existing `private readonly theme = inject(ThemeService);` line:

  ```typescript
    // Injected so its constructor (appending the Umami script tag, prod-only) runs from app bootstrap.
    private readonly analytics = inject(AnalyticsService);
  ```

- [ ] **Step 4: Build with the production configuration and verify the script is present**

  ```bash
  cd frontend && npx ng build 2>&1 | tail -15
  ```

  Expected: build succeeds (`ng build` defaults to the `production` configuration per `angular.json`, confirmed by `defaultConfiguration": "production"` on the `build` target).

  Then check that a prerendered page's HTML contains the Umami script tag — wait, this build is a static prerender pass, which runs `isPlatformBrowser` as `false` (Node/domino environment), so the tag should NOT appear in the prerendered HTML output. Confirm that:

  ```bash
  grep -c "cloud.umami.is" dist/nikenver-portfolio/browser/index.html
  ```

  Expected: `0` — the script must NOT be baked into the static HTML (it only gets injected client-side by the browser's own JS execution, not by the server-side prerender).

- [ ] **Step 5: Verify the script actually loads in a real browser on the production bundle**

  Serve the production build locally and check in a real browser:

  ```bash
  cd frontend && npx http-server dist/nikenver-portfolio/browser -p 4400
  ```

  Open `http://localhost:4400` in a browser, open devtools → Network tab, reload, and confirm a request to `https://cloud.umami.is/script.js` appears. Also check `document.head.innerHTML` in the console contains a `<script>` tag with `data-website-id="2ff3c3b2-178d-40db-ab98-a506958d768f"`.

  Stop the `http-server` process when done.

- [ ] **Step 6: Verify the script does NOT load under `ng serve` (dev)**

  ```bash
  cd frontend && npx ng serve --port 4300
  ```

  Open `http://localhost:4300`, open devtools → Network tab, reload, and confirm NO request to `cloud.umami.is` appears. Stop the dev server when done.

- [ ] **Step 7: Commit**

  ```bash
  git add frontend/src/environments/environment.ts frontend/src/environments/environment.prod.ts frontend/src/app/core/analytics/analytics.service.ts frontend/src/app/app.component.ts
  git commit -m "Add Umami Cloud analytics, loaded client-side in production only"
  ```

---

### Task 2: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Confirm the rest of the site still works**

  With `ng serve` running (`http://localhost:4300`), click through Home, Sobre mí (including the CV download button), Proyectos, Servicios, and Contacto in both `es` and `en` — confirm nothing broke by this change (it shouldn't, since `AnalyticsService`'s constructor no-ops entirely in dev).

- [ ] **Step 2: Confirm in the Umami Cloud dashboard**

  With the production build served locally (Task 1, Step 5) and a page loaded in the browser, check the Umami Cloud dashboard (cloud.umami.is) for the registered site — a pageview should appear (may take a minute to show up). This is the final proof the Website ID and script are wired correctly end-to-end.

- [ ] **Step 3: Report back**

  Summarize what was verified (prod-only loading, dev exclusion, no tag in static HTML, live pageview in the Umami dashboard) and flag anything that looks off before considering the plan complete.
