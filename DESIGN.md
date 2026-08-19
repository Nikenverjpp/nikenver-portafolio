---
name: Nikenver Pulgar Portfolio
description: Dark-by-default developer portfolio proving real production work through evidence, not filler.
colors:
  bg-primary: "#0a0a0f"
  bg-secondary: "#111118"
  bg-elevated: "#1a1a26"
  text-primary: "#f0f0ff"
  text-secondary: "#9b9bb8"
  text-muted: "#8888a8"
  accent-cyan: "#00d9ff"
  accent-amber: "#f59e0b"
  accent-violet: "#818cf8"
  border: "#2a2a3f"
typography:
  display:
    fontFamily: "Syne, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  full: "9999px"
spacing:
  sm: "0.875rem"
  md: "1.25rem"
  lg: "5rem"
components:
  button-primary:
    backgroundColor: "color-mix(in srgb, {colors.accent-cyan} 10%, transparent)"
    textColor: "{colors.accent-cyan}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1.25rem"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, {colors.accent-cyan} 20%, transparent)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1.25rem"
  card-surface:
    backgroundColor: "color-mix(in srgb, {colors.bg-secondary} 80%, transparent)"
    rounded: "{rounded.lg}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
  chip-active:
    backgroundColor: "color-mix(in srgb, {colors.accent-cyan} 10%, transparent)"
    textColor: "{colors.accent-cyan}"
    rounded: "{rounded.full}"
---

# Design System: Nikenver Pulgar Portfolio

## Overview

**Creative North Star: "Dark Precision"**

This is a portfolio that wins trust through evidence, not decoration: every case study links to a real, live production system, and the interface around that content has to read as equally credible. The visual language is precise and sober — a near-black canvas, hairline borders instead of drop shadows, and a single accent color spent deliberately rather than everywhere. It should feel like a well-made engineering tool that happens to also be persuasive, never like a marketing template with a dark mode toggle.

Two audiences read this site side by side — technical recruiters auditing stack depth, and non-technical business owners deciding whether to trust the person behind the code. The design stays legible and calm for both: no jargon-coded visual flourishes (no terminal-cosplay monospace, no neon-everything), just clean hierarchy, real content, and one confident accent color doing the pointing.

**Key Characteristics:**
- Near-black canvas by default; light theme is a deliberate alternate, not the "true" identity.
- Flat surfaces at rest — elevation is borders and translucency, not shadow.
- One accent (cyan) carries all primary interactive meaning; amber and violet are rare, deliberate seconds.
- Two type families only: a distinctive display face for identity moments, a plain-spoken sans for everything read at length.

## Colors

A near-black neutral scale carries the page; color is reserved for meaning, not mood.

### Primary
- **Signal Cyan** (`#00d9ff` dark / `#0e7490` light): the site's only primary interactive color — links, active nav state, the logo's monogram dot, primary buttons, focus rings, filter-chip active state, timeline markers. If something is clickable or "selected," it's cyan; nothing else claims that role.

### Secondary
- **Amber Metric** (`#f59e0b` dark / `#b45309` light): reserved for standout numeric emphasis (the "5+ empresas" stat on Home). Used sparingly enough that its rarity is what makes it land.

### Tertiary
- **Soft Violet** (`#818cf8` dark / `#4f46e5` light): a quiet second accent — the Instagram-post left border in the social carousel, and a faint thread in the body's background wash. Never used for primary actions. The social carousel's other platform card (TikTok) intentionally uses a neutral hairline border instead of a second accent color — platform identity in that component is carried by the label text, not by claiming another accent.

### Neutral
- **Near-Black Canvas** (`#0a0a0f` dark / `#f4f4f9` light): page background — `--color-bg-primary`.
- **Elevated Panel** (`#111118` dark / `#ffffff` light): header background and secondary surfaces — `--color-bg-secondary`.
- **Raised Surface** (`#1a1a26` dark / `#ffffff` light): the most-elevated surface tone (dropdowns) — `--color-bg-elevated`.
- **Off-White Ink** (`#f0f0ff` dark / `#14141f` light): primary text — `--color-text-primary`.
- **Cool Gray** (`#9b9bb8` dark / `#52526b` light): secondary text — body copy, descriptions — `--color-text-secondary`.
- **Muted Gray** (`#8888a8` dark / `#6b6b85` light): tertiary text — labels, captions, year stamps — `--color-text-muted`. Reserve for small/decorative text only; body-sized copy belongs in Cool Gray.
- **Hairline Border** (`#2a2a3f` dark / `#e2e2ea` light): the surface-definition device this system uses instead of shadow — card edges, dividers, chip outlines — `--color-border`.

### Named Rules
**The One Accent Rule.** Cyan is the only color that means "interactive" or "selected." Amber and violet never gain that responsibility, however tempting a second CTA color looks.

**The AA Floor Rule.** Any text at body size or smaller must clear 4.5:1 contrast against its background. Muted Gray is for large/decorative text only (WCAG's 3:1 large-text exception) — never body copy.

## Typography

**Display Font:** Syne (with system-ui, sans-serif fallback)
**Body Font:** IBM Plex Sans (with system-ui, sans-serif fallback)

**Character:** Syne is geometric and slightly unusual — it's spent only on identity moments (the "NP." monogram, H1/H2s) so it reads as a considered choice, not a default. IBM Plex Sans carries every other line of text, including labels and captions that an earlier iteration set in a third monospace face; consolidating to two families removed a visual seam between "body text" and "technical text" that never needed to exist.

### Hierarchy
- **Display** (700–800, `text-3xl`–`text-4xl`/`clamp` on Home H1, tight tracking): section titles, the hero name, the logo monogram. Appears at the top of every page and nowhere else.
- **Body** (400, `text-base`, 1.6 line-height, justified in prose blocks): bio paragraphs, case-study copy. Comfortable long-form reading measure.
- **Label** (400–500, `text-xs`–`text-sm`, `text-secondary`/`text-muted`): eyebrows, stat captions, year stamps, nav links, chip text. Carries the weight labels used to get from the retired mono face — no letter-spacing or case tricks required to read as "metadata."

### Named Rules
**The Two-Voice Rule.** Every piece of text is either Display (identity, rare) or Sans (everything else, including what used to be a third "technical" voice). A third family is a regression, not a refinement.

## Layout

`container-page` (`max-w-6xl`, responsive `px-4`/`sm:px-6`/`lg:px-8`) is the one horizontal rhythm the whole site shares. Sections stack vertically with generous breathing room (`py-16` to `py-28` depending on section weight) rather than a dense dashboard grid — this is a Persuade/Experience surface, not a tool, so pacing matters more than density. The header is `sticky top-16` with a translucent, blurred background so it stays legible over scrolling content without fully occluding it. Card grids (`stack`, `projects`) use `grid gap-3 sm:gap-4` with 2–3 columns depending on breakpoint; nothing goes past `lg:grid-cols-3`, keeping cards readable rather than catalog-dense.

## Elevation & Depth

Flat by default. This system does not use drop shadows for resting-state depth — surfaces are separated by a 1px hairline border and, on cards, a translucent background with `backdrop-blur-sm`. The one shadow token, `--shadow-glow` (a soft, zero-offset cyan halo via `color-mix`), exists purely as a *response* to interaction — it appears on primary-button hover and the skip-link's focus state, never at rest. Depth here means "this now has your attention," not "this is physically higher."

### Shadow Vocabulary
- **Glow-on-response** (`--shadow-glow`: `0 0 40px color-mix(in srgb, var(--color-accent-cyan) 15%, transparent)`): the only shadow in the system. Hover/focus only.

### Named Rules
**The Glow-on-Response Rule.** Shadow only ever appears as a reaction to hover or focus, and it is always the cyan glow — never a generic drop shadow, never decorative, never present at rest.

## Shapes

Corners scale with a surface's weight: buttons and inputs use `rounded-lg` (0.5rem, the smallest step that still reads as "soft"), cards use `rounded-2xl` (1rem), and anything pill-shaped (filter chips, stack badges) is `rounded-full`. The `logo-chip` treatment (a white rounded-xl tile behind a partner logo) is the one deliberate exception to the dark palette — third-party marks get a neutral light stage so their own colors stay true. No sharp corners anywhere; no heavy or offset borders — every border in the system is a plain 1px hairline.

## Components

Every interactive surface stays quiet at rest and answers clearly on hover/focus — contained and confident, never bouncy or decorative.

### Buttons
- **Shape:** `rounded-lg` (0.5rem), `min-h-11` for a real tap target.
- **Primary:** cyan-tinted fill (`bg-accent-cyan/10`) over a cyan-tinted border (`border-accent-cyan/40`) — reads as "cyan" without being a solid block of it.
- **Hover/Focus:** fill deepens (`bg-accent-cyan/20`), border solidifies to full cyan, a 2px lift (`-translate-y-0.5`), and the glow shadow appears. One consistent "wakes up" gesture across every primary action.
- **Ghost:** plain hairline border, secondary text color; hover only shifts the border toward cyan/40 and lightens the text — a deliberately quieter second action.

### Chips (filter / stack badges)
- **Style:** `rounded-full`, hairline border, secondary text, transparent background at rest — `min-h-11` when used as a tappable filter, tighter padding when used as a static stack badge.
- **Active/selected state:** border and text switch to cyan, background gains a 10% cyan tint (`filter-chip-active`) — the same "cyan means selected" language as everywhere else, never a second selection color.

### Cards
- **Corner:** `rounded-2xl`.
- **Background:** `bg-bg-secondary/80` with `backdrop-blur-sm` — enough translucency to feel layered over the page's faint radial-gradient wash without competing with it.
- **Border:** 1px hairline, no shadow at rest.
- **Elevation on interaction:** where a card is a link (project cards), the border/text respond on hover the same way ghost buttons do — never a shadow pop.

### Navigation
- Text-only links (`nav-link`), no pill or underline background. Default is secondary text; hover shifts to primary text; the active route is cyan (`nav-link-active`) — same accent grammar as everything else. Mobile collapses into a native `<details>` menu rather than a custom off-canvas panel, keeping the interaction native and accessible by default.

### Empty / Not-Found State
Reuses the page-header rhythm (eyebrow → `section-title` → supporting paragraph → CTA row) rather than a dedicated "error page" template. A bare "404" sits in the eyebrow slot (Label voice, cyan); the heading and message stay in plain bilingual language, never technical jargon. Primary CTA is always "back home"; a secondary ghost CTA ("all projects") appears only where it's contextually useful (an unknown project slug). Used for both the sitewide 404 and an unmatched project slug — same component, different title key.

### Timeline Markers (signature component)
Small solid cyan dots mark each entry in the experience timeline, connected by a hairline vertical rule. It's the one place the primary accent appears as a pure filled shape rather than text/border color — a deliberate, singular use of "cyan as a mark," not a pattern to repeat elsewhere.

### Logo Monogram + Header Tagline (signature component)
The "NP." wordmark overlaps the N and P into a tight monogram, closed with a solid cyan dot — the only place letterforms physically overlap in the system. Beside it, a typewriter-style tagline (name, role, stack keywords) types and deletes on an infinite loop with a blinking cyan caret bar, giving the otherwise-static header one small, contained moment of motion. Both respect `prefers-reduced-motion` by freezing to a static state.

## Do's and Don'ts

### Do:
- **Do** keep cyan as the singular primary/interactive accent; let amber and violet stay rare.
- **Do** use a 1px hairline border (`--color-border`) as the default way to separate surfaces.
- **Do** reserve `--shadow-glow` for hover/focus response only, never a resting decoration.
- **Do** set body-length copy in IBM Plex Sans at 4.5:1+ contrast against its background.
- **Do** respect `prefers-reduced-motion` on every animated or auto-playing element (timeline reveal, header typewriter, scroll reveals).

### Don't:
- **Don't** introduce a third type family. Display (Syne) for identity moments, Sans (IBM Plex Sans) for everything else — a retired monospace label voice already proved a third family reads as inconsistency, not craft.
- **Don't** add static/decorative box-shadows. If something needs to feel elevated at rest, give it a border and translucency instead.
- **Don't** promote amber or violet into a primary-action or "selected" role — that's cyan's job alone.
- **Don't** let muted/tertiary gray (`--color-text-muted`) carry body-sized text; it's for small labels and captions only, per the AA Floor Rule.
