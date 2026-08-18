---
target: frontend/src/app/features/home/home.component.ts
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-18T14-32-10Z
slug: frontend-src-app-features-home-home-component-ts
---
Method: dual-agent (A: design review sub-agent · B: detector/browser evidence sub-agent)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Mobile `<details>` menu gives no clear "open" affordance change on its own trigger. |
| 2 | Match System / Real World | 3/4 | Project-detail breadcrumb renders the raw URL slug as visible prose. |
| 3 | User Control and Freedom | 2/4 | Mobile menu doesn't close on outside-tap; 12-tag filter has no "clear" besides re-clicking "Todos". |
| 4 | Consistency and Standards | 3/4 | About-page photo's maroon circular backdrop breaks from the cyan/amber/violet accent system used everywhere else. |
| 5 | Error Prevention | 4/4 | No forms to get wrong (deliberate); demo/code buttons render conditionally, avoiding dead links. |
| 6 | Recognition Rather Than Recall | 3/4 | Nav/theme/locale state always visible, but 12 filter tags force scanning to map tags → 3 projects. |
| 7 | Flexibility and Efficiency | n/a | Persuade/Experience surface, not a task tool — no power-user path expected. |
| 8 | Aesthetic and Minimalist Design | 2/4 | 12-tag filter row, 6-item skill list, and a redundant "Ver caso de estudio" link duplicating the card-title link all violate minimalism for a 3-project site. |
| 9 | Error Recovery | 3/4 | No visible error states found — nothing fails loudly — but no evidence of an empty-state message if a filter matches zero projects. |
| 10 | Help and Documentation | n/a | Not applicable to a persuade-mode portfolio. |
| **Total** | | **23/32** | **Good (72%)** |

### Design Specificity Verdict

**LLM assessment:** Mixed. The *content* is genuinely specific — three real, named case studies with technical detail nobody could copy-paste onto another portfolio (FEFO/FIFO + row-level security in Subladmin, an olfactory-diagnosis scoring algorithm in Axsence, a real business he founded in Sublimax). But the *composition* is generic dark-mode-dev-portfolio boilerplate: hero + eyebrow + two CTAs, three stat tiles, a colored-dot timeline, tag-pill project cards. The clearest tell: the `/proyectos` filter bar offers **12 technology tags to filter 3 project cards** — information architecture built for a catalog, mechanically applied to a deliberately curated 3-case-study site.

**Deterministic scan:** The static CLI scan (`detect.mjs --json`) reported itself **DEGRADED** — missing `htmlparser2`/`css-select`/`css-tree`/`domutils`, so it fell back to regex matching and returned `[]`. That is *not* a clean bill of health; contrast, custom properties, and full selector matching were not evaluated by that pass. The browser-injected version of the same detector (a different, non-degraded build) ran successfully on all 5 routes and found real issues the regex pass missed entirely:

- **Low-contrast text — real, WCAG-relevant, on every route.** `#5a5a78` (muted/secondary text — year labels, "Stack principal" captions) on `#0a0a0f`/`#101016` backgrounds measures **2.9–3.0:1**, below the 4.5:1 AA minimum. This is a genuine accessibility finding neither Assessment A nor I had flagged at heuristic level — the detector caught something the design review missed.
- **Skipped heading level on `/proyectos`** — `<h1>` "Proyectos" is followed directly by `<h3>` project-card titles with no intervening `<h2>`, a real semantic/screen-reader issue.
- **`dark-glow` / thin-border-wide-shadow** on the header dropdown and timeline dots (`#00d9ff`) — this is literally your own `.shadow-glow` token, an intentional Dark Precision accent, but it's also a pattern the detector specifically watches for as a common AI-generated-UI tell. Worth a conscious "yes, keep it" rather than an accident.
- **`ai-color-palette` "cyan neon text"** fired ~55 times across all 5 routes — but every single occurrence is the same one deliberate `text-accent-cyan` utility class applied consistently. Read this as one systemic flag on the brand accent color, not 55 separate defects.

**Likely false positives (flagged by Assessment B, not confirmed):**
- A single `dark-glow` on `#d97757` (Anthropic's own brand orange — not a color that exists anywhere in this site's palette) on the project-detail route's `<body>`. Most likely a Chrome-automation/extension artifact bleeding into the computed-style check, not a real site issue.
- Most `text-occlusion` findings target the header's theme/language chip group, reported as "covered" by hero text. The header is `sticky ... z-50`, so it always renders above in-flow content regardless of bounding-box overlap — this pattern is very likely a geometry false positive, not real visual occlusion.

**Visual overlays:** the injection ran successfully during the assessment, but the live server used for it has since been stopped — there is no overlay currently visible in your browser. The findings above are the recorded console output from that run.

### Overall Impression

The content and copy are the strongest part of this site — real, verifiable, technically specific case studies that actually deliver on "evidence over filler." The structural shell around that content, though, is where a generic portfolio template shape shows through most: a filter UI sized for a project catalog wrapped around exactly 3 cards, a breadcrumb that leaks a routing slug, and a bilingual site whose browser tab title never actually translates. None of it is broken — it's a "Good" (72%) site with a clear, fixable gap between how specific the writing is and how generic the surrounding chrome still is.

### What's Working

1. **No-forms contact philosophy, executed consistently.** Every contact channel goes straight to `mailto:`/`tel:`/LinkedIn with a one-line qualifier ("Ideal para propuestas formales…"), so the visitor self-routes instantly. This is a stated principle in PRODUCT.md and it's visibly true in the code, not just claimed.
2. **Conditional CTA rendering avoids the dead-link trap.** `project-detail.component.ts` only renders "Ver demo"/"Ver código" when the URL actually exists — Subladmin (private ERP) correctly shows only a demo link. Most template portfolios get this wrong.
3. **Technical narrative specificity in the case studies.** Challenge/Solution/Results sections carry real, unhedged technical claims (row-level security, rate limiting, FEFO/FIFO) instead of marketing language — the single strongest specificity signal on the site.

### Priority Issues

**[P1] Route `<title>` never translates — breaks the bilingual promise at the browser-chrome level.**
- **Why it matters:** `app.routes.ts` hardcodes Spanish titles ("Inicio - Nikenver Pulgar", etc.) regardless of the active locale. An English-reading recruiter who switches to EN still gets Spanish tab titles, history entries, and bookmark names — a visible contradiction of the site's own "bilingüe de verdad" principle.
- **Fix:** Add a small `TitleStrategy` that reads `locale.locale()` and pulls from the same `UI_STRINGS` dictionary already used for in-page copy.
- **Suggested command:** `/impeccable clarify`

**[P1] Muted/secondary text fails WCAG AA contrast on every page.**
- **Why it matters:** `#5a5a78` on `#0a0a0f`/`#101016` (year labels, "Stack principal" caption, timeline hints) measures 2.9–3.0:1 against a 4.5:1 requirement — a real accessibility failure the detector confirmed on all 5 routes, not a taste call.
- **Fix:** Bump `--color-text-muted` a few steps lighter (or reserve it for large/decorative text only per WCAG's 3:1 large-text exception, and use `--color-text-secondary` wherever the text is body-sized).
- **Suggested command:** `/impeccable audit`

**[P1] Profile photo's maroon backdrop clashes with the Dark Precision identity.**
- **Why it matters:** About is where a recruiter forms a personal impression of the person behind the case studies. A solid maroon/dark-red circular crop — sharing no relationship with the cyan/amber/violet system — is the first personal visual they see, right after a disciplined Home page, and it reads as an unrelated asset rather than a considered choice.
- **Fix:** Recrop/relight, or add a subtle ring/duotone treatment using `--color-accent-cyan` so the photo reinforces the palette instead of fighting it.
- **Suggested command:** `/impeccable polish`

**[P2] 12-tag filter bar on a page with 3 projects.**
- **Why it matters:** This is the clearest place the IA defaults to a generic "filterable catalog" pattern instead of the site's own actual, deliberately curated content. It also fails the cognitive-load checklist twice over (>4 choices at a decision point; multiple simultaneous decisions above the fold) and forces scanning past a wall of pills before reaching the first project — worse on mobile, where the pills wrap 4 rows deep.
- **Fix:** Drop the filter entirely — 3 items don't need filtering — or replace it with a static "Angular / Laravel / PostgreSQL" stack line like the one already on Home.
- **Suggested command:** `/impeccable distill`

**[P2] Project-detail breadcrumb shows the raw URL slug.**
- **Why it matters:** "Proyectos / subladmin-sistema-administrativo" renders the routing slug as visible prose — a developer-facing artifact leaking into otherwise carefully bilingual, recruiter-facing copy.
- **Fix:** Replace the slug segment with the translated project title, or drop it.
- **Suggested command:** `/impeccable clarify`

**[P2] Skipped heading level on `/proyectos` (h1 → h3, no h2).**
- **Why it matters:** Project-card titles are marked up as `<h3>` directly under the page `<h1>`, with no `<h2>` in between — a real screen-reader/semantic-structure issue the detector caught independently.
- **Fix:** Either promote card titles to `<h2>` or wrap the grid under an `<h2>` (even visually hidden) like "Casos de estudio".
- **Suggested command:** `/impeccable audit`

**[P3] Mobile menu doesn't dismiss on outside tap.**
- **Why it matters:** The native `<details>` mobile nav has no backdrop or outside-click handler — a recruiter skimming on mobile who taps elsewhere after opening it finds it stuck open, which reads as unresponsive.
- **Fix:** Add a click-outside listener or a full-screen backdrop that closes the panel on tap.
- **Suggested command:** `/impeccable harden`

### Persona Red Flags

**Riley (stress-tester):** Selecting a filter tag with zero matching projects (plausible with any future data typo) yields a silently empty grid — `filteredProjects()` has no empty-state message. The locale/title mismatch (P1 above) is exactly the kind of "state doesn't match state" bug a careful tester catches first. The About page's skill list is also hardcoded in the component rather than sourced from the same JSON data pattern used for projects/experience — invisible to visitors today, but an inconsistent authoring pattern worth flagging.

**Casey (mobile user):** Stuck-open mobile menu (P3). On `/proyectos`, 12 filter chips wrap across ~4 rows before a single project card appears — a lot of scrolling past controls to reach content on a small screen.

**Sam (accessibility-dependent):** The confirmed WCAG AA contrast failure (P1) and the skipped heading level (P2) both land squarely on this persona — a screen-reader user loses a clean h1→h2→h3 outline on the projects page, and a low-vision user reading zoomed text hits sub-3:1 contrast on year labels and captions site-wide.

### Minor Observations

- 13 total chips on `/proyectos` (12 tags + "Todos") rely on cyan-vs-not-cyan as the *only* selected/unselected cue — consider a stronger weight or fill difference too.
- `.logo-chip` is hardcoded `bg-white` regardless of theme — correct for the three logo assets currently in use, but a rigid assumption if a future logo needs dark-mode-specific contrast.
- Sublimax shows year "2024" while Subladmin (same company) shows "2026" — plausible given the timeline, but worth a quick sanity check that no project year is a placeholder.
- Reveal-on-scroll respects `prefers-reduced-motion` — good, uncalled-for-elsewhere accessibility hygiene.
- On Home, there's no visible "Contact" affordance above the fold — a convinced-fast recruiter scrolls past stats, experience, and projects before reaching the bottom contact card.

### Questions to Consider

1. If the whole positioning is "3 real, verifiable case studies, no filler" — why does the projects page need a filter UI at all? Isn't the filter bar itself evidence the page was designed for a portfolio with far more, less-curated projects than this one actually has?
2. The profile photo is the one visual on this site that genuinely can't be copied onto anyone else's portfolio — so why does its color treatment fight the brand system instead of anchoring it?
3. If a recruiter is convinced halfway through the Subladmin case study, what's the fastest path to "email him" from that exact scroll position today — and is "scroll to top → nav → Contact → email" really the shortest path a "no-friction" site should offer at its highest-conviction moment?
