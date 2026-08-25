---
target: frontend/src/app (whole site)
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
timestamp: 2026-08-25T03-12-06Z
slug: frontend-src-app
---
Method: dual-agent (A: Impeccable critique Assessment A: design review · B: Impeccable critique Assessment B: detector evidence)

## Design Health Score

*Nielsen's 10 heuristics — #7 (Flexibility and Efficiency) and #10 (Help and Documentation) scored n/a: this is a Persuade/Experience surface (portfolio, no power-user workflows), and each case study already functions as its own documentation.*

| # | Heuristic | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Visibility of System Status | 3/4 | Nav/theme/locale state is always clear, but every route fades in via a 0.8s `animate__fadeInUp`, leaving above-the-fold content substantially blank for a perceptible beat after each navigation |
| 2 | Match System / Real World | 3/4 | Clear bilingual copy throughout; "Toca para abrir..."/"Tap to open..." shown unconditionally, including on desktop, where the action is a click, not a tap |
| 3 | User Control and Freedom | 3/4 | Good backtracking (breadcrumbs, "Volver al portfolio"); the fixed WhatsApp bubble sits on top of other tappable content/links on mobile |
| 4 | Consistency and Standards | 4/4 | The card/CTA/chip vocabulary and the one-accent (cyan) rule are applied with zero deviation across every page and both themes |
| 5 | Error Prevention | 3/4 | The no-forms philosophy eliminates most error surface by design; the WhatsApp overlap is the one self-inflicted mis-tap risk |
| 6 | Recognition Rather Than Recall | 4/4 | Literal nav labels, stack chips always co-located with each project |
| 8 | Aesthetic and Minimalist Design | 3/4 | Disciplined system (no resting shadows, one accent, generous whitespace) undercut by the uncoordinated floating WhatsApp button and a lopsided 2+1 card grid on Contact |
| 9 | Error Recovery | 3/4 | DESIGN.md documents a well-considered 404/unmatched-slug state; scored conservatively as it wasn't re-verified live this run |
| **Total** | | **26/32** | **Good (81%)** |

## Design Specificity Verdict

**Highly specific — could not pass as a generic template.**

**LLM assessment:** Real production-system screenshots, and even live scrollable iframes of actual client sites (Dekasa, Arcoweld), sit directly in project cards. An explicit, reputation-risking paragraph discloses the AI-assisted workflow by name ("uso agentes de código como Claude Code, Antigravity... la IA acelera la ejecución, no la reemplaza"). A "Perfumería" stack category covers diagnóstico olfativo, layering and matching. Personal details (padre de familia, catador de perfumes, madridista) and case-study copy naming real mechanisms (FEFO/FIFO, RLS, RBAC, OWASP Top 10) tie directly to real, sometimes credential-gated links. No neighboring portfolio could honestly reuse any of this.

**Deterministic scan:** `detect.mjs --json frontend/src/app` returned exit code 2 with **1 finding**: a `side-tab` (thick accent-colored left border) rule hit on `social-carousel.component.ts:30` (`border-l-4`). Verified against source — real, but used semantically (platform color-coding on Instagram/TikTok cards, driven by conditional classes), which is a legitimate mitigating factor, not a false positive on the pattern itself.

The in-browser overlay (injected on 5 pages) additionally logged `ai-color-palette` ("cyan neon text") dozens of times (27 hits alone on `/servicios`) and `dark-glow` a handful of times. Both check out as **false-positive-adjacent**: `DESIGN.md` codifies cyan as the site's single deliberate interactive accent (the "One Accent Rule") and `--shadow-glow` as the one sanctioned hover/focus shadow (the "Glow-on-Response Rule") — this is a documented, consistently-applied design system, not ad-hoc AI-slop coloring. The sheer repetition count is still worth a light look (see Minor Observations), but it isn't the systemic-drift signal the detector rule is built to catch. `image-hover-transform` findings (11 per page) resolved their element selector to a bare `body` on every hit — a detector-side selector-resolution bug, not a trustworthy per-image count; the underlying hover pattern is real (confirmed in 4 components) but the "11" is not.

## Overall Impression

This is a disciplined, evidence-first portfolio that earns its "Dark Precision" positioning — the design system is applied with real consistency, and the site's boldest move (naming the AI-assisted workflow outright, in both languages) is exactly the kind of specific, unhedged claim a generic template could never carry. The gap between this site and "excellent" isn't the visual language; it's a small number of concrete execution bugs — one of which (the floating WhatsApp button) undermines legibility right at the site's most trust-sensitive paragraph.

## What's Working

1. **The AI-workflow disclosure paragraph** (Sobre mí) — stating plainly that judgment/architecture/review stay human while agents accelerate implementation, and that the portfolio itself was built this way, turns a risky admission into a trust signal no competitor page would risk copying.
2. **Evidence made tangible, not just claimed** — the Cobeca case study's "Sistemas en producción" grid uses real screenshots of internal login/portal systems; desktop project cards embed live, scrollable iframes of actual client sites. This operationalizes the "evidencia real sobre relleno" product principle in the interface itself, not just the copy.
3. **The no-friction contact philosophy is carried through consistently** — no forms anywhere, a real WhatsApp number, and Contact-page copy that proactively defuses the "is this a lead-gen trap" anxiety right at the highest-stakes moment on the site.

## Priority Issues

**[P1] Floating WhatsApp button overlaps content and links, both at rest and while scrolling, on mobile (~390px)**
- **Why it matters:** Confirmed live on three pages — it covers "PostgreSQL" in Home's stat card, sits directly on the footer's LinkedIn link (Home and Servicios), and covers running body text in the expanded About bio, including the AI-disclosure sentence — the single most reputation-sensitive paragraph on the site, obscured at exactly the moment a skeptical reader is scrutinizing it. This session already shipped a scroll-triggered opacity fade for the "text passing under it while scrolling" case, but Assessment A's screenshots show the button also overlaps static, at-rest content (stat cards, footer links) when a page's natural content simply ends where the button sits — a case the scroll-fade fix doesn't touch.
- **Fix:** Give the button collision-aware positioning — reserve real bottom-right clearance in page/section padding so footer links and last-card content never render under its footprint, in addition to the existing scroll-fade behavior.
- **Suggested command:** `/impeccable adapt`

**[P2] Route-level content reads as blank for a perceptible beat after every navigation**
- **Why it matters:** Every page tested (Home, Proyectos, Sobre mí, Servicios, Cobeca detail) showed substantially faded/blank above-the-fold content even 1-2s after navigating, because the 0.8s `fadeInUp` reveal is applied to first-paint hero content, not reserved for genuinely below-the-fold scroll reveals. A recruiter or hiring manager quickly scanning across pages is the persona most likely to read this as a slow or broken page rather than a polish flourish.
- **Fix:** Exempt hero/above-the-fold content on each route from the reveal animation (or cut its delay/duration to ~150-200ms), keeping the fade-up effect for content that's actually below the fold on first paint.
- **Suggested command:** `/impeccable optimize` or `/impeccable adapt`

**[P2] The confirmed-available LinkedIn recommendation isn't shown anywhere on the live site**
- **Why it matters:** `PRODUCT.md`'s own "Evidence on Hand" lists a real LinkedIn recommendation (Evert Pulgar, former supervisor) as available, but a full-page text search on `/sobre-mi` found no "Evert" or "recomend" string anywhere on the live site. This is exactly the third-party social proof that most de-risks the hiring decision for the non-technical-business-owner persona, who can't personally judge code quality and currently has nothing but Nikenver's own self-reported copy to lean on.
- **Fix:** Surface it as an attributed quote block near the bio or the Contact CTA.
- **Suggested command:** `/impeccable clarify` or `/impeccable layout`

**[P3] "Toca para abrir..."/"Tap to open..." microcopy shows unconditionally, including on desktop**
- **Why it matters:** The Contact page's phone/WhatsApp card always says "tap," even though the action is a click on desktop — a small Match-Between-System-and-Real-World miss for the sizeable share of visitors (hiring managers, recruiters) evaluating this site from a laptop.
- **Fix:** Use device-neutral phrasing ("Toca o haz clic" / device-agnostic wording), or detect pointer type.
- **Suggested command:** `/impeccable clarify`

**[P3] Contact page's desktop card grid is lopsided**
- **Why it matters:** Email and phone fill row one; LinkedIn sits alone in row two with a large empty gap beside it — on the one page whose entire job is converting trust into contact, the layout reads unfinished at the exact moment it should feel most considered.
- **Fix:** Span the LinkedIn card full-width, or move to a 3-across grid at this breakpoint.
- **Suggested command:** `/impeccable layout`

## Persona Red Flags

**First-time visitor building trust (mobile):** Taps "Leer más" specifically to read the trust-building AI-disclosure paragraph — and the floating WhatsApp button sits directly over several of its words. The exact copy engineered to earn trust is what the UI chrome damages.

**Recruiter scanning quickly across pages:** Rapid Home→Sobre mí→Proyectos→Servicios navigation repeatedly hits the near-blank load-in moment described in P2; a fast scanner is the persona most likely to misread this as a slow or broken page.

**Non-technical business owner evaluating a custom-system hire:** Has almost nothing but Nikenver's own copy to lean on for reassurance — despite a real third-party recommendation being confirmed available and not shown anywhere on the site.

## Minor Observations

- Every Servicios card description ends with the identical "Cotización según alcance" — a slightly templated beat inside otherwise human, varied copy.
- Desktop header carries 7 simultaneous interactive elements (5 nav links + theme + locale toggle) — a lot for a stated minimalist brand, though it collapses cleanly into one hamburger on mobile.
- The detector's 27-hit `ai-color-palette` count on `/servicios` alone, while a false positive on "is this AI slop," is still a real repetition count worth a glance: confirm the cyan accent on every evidence link and icon in that page's service-card grid isn't tipping past "the one thing that's clickable" into "the one color that's everywhere."
- Light theme is a fully realized, convincing alternate, not an unstyled fallback — matches `DESIGN.md`'s stated intent.
- Keyboard focus states are clearly visible (cyan ring) — solid accessibility baseline.

## Questions to Consider

1. What would it take for the WhatsApp button to become collision-aware — hiding or shrinking whenever it would overlap the viewport's last card or paragraph — turning a recurring bug into the kind of precision detail that matches the site's own engineering-credibility promise?
2. What if the real LinkedIn recommendation were surfaced as an attributed quote directly on the Contact page, positioned as the last thing a non-technical visitor sees before reaching out?
3. What if the load-reveal animation were reserved strictly for scroll-triggered, below-the-fold content, with every route's hero rendering instantly — would that measurably sharpen the "well-made engineering tool" feel DESIGN.md's own north star is chasing?
