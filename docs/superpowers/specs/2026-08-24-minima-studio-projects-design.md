# Minima Studio projects, missing screenshots, and Experience thumbnails

## Context

The portfolio's Projects view (`/proyectos` list + `/proyectos/:slug` detail) is missing two completed
freelance projects (Dekasa, Arcoweld) and has a few gaps in page screenshots. The Experience timeline
(About page) never renders screenshots at all, even where the data already carries `preview_image_url`
for its links (Amavida, Wilmer Nadín under Iconos Consultores).

## Scope

1. **New Experience entry**: Minima Studio, Frontend Developer Freelance, 2023–2023 (agency closed),
   linking to Dekasa and Arcoweld — same shape as the existing Iconos Consultores entry.
2. **Two new Project entries** (`company: "Minima Studio"`, `is_featured: true`, `year: 2023`):
   - **Dekasa** (`dekasa.com.ve`) — porcelain tile / bathroom fixtures e-commerce catalog. WordPress +
     Blocksy theme + Elementor + WooCommerce.
   - **Arcoweld** (`arcoweld.com`) — industrial welding-equipment e-commerce (multi-category catalog,
     accounts, cart). WordPress with a custom theme (`wp-content/themes/arcoweld`) + Bootstrap.
   Neither gets a `thumbnail_url` (no logo asset), matching the existing Cobeca entries' pattern.
3. **Fill existing screenshot gaps**:
   - Sublimax project (`sublimax-ecommerce`): TikTok link gets its own `preview_image_url`; Instagram
     link gets its own capture instead of reusing the project's main `preview_image_url`.
   - Cobeca corporate-apps project (`cobeca-corporate-apps`): add a main `preview_image_url`.
4. **Render link screenshots in Experience**: extract the thumbnail-grid link pattern already used in
   `project-detail.component.ts` (`card-surface` + `h-20` image + label row) into a small shared
   component, and use it from both `project-detail.component.ts` and `timeline-item.component.ts`.
   This activates existing unused previews (Amavida, Wilmer Nadín) and needs two new captures for the
   Grupo Cobeca experience entry's PFL8 and Farmacia SaaS links (its other 4 links reuse images that
   already exist under `frontend/public/img/previews/`).

## Out of scope

- Logos/`thumbnail_url` for Minima Studio, Dekasa, or Arcoweld.
- Any change to Experience entries that have no `links` at all (Gandalf, Metro IT, Diario Panorama,
  Grupo Nivar).
- The Laravel/Angular scaffolding under `backend/` and the standalone `frontend` experiment under
  `preview/` (unused legacy directories, not part of the live site).

## Data/UI changes

- `frontend/src/app/core/data/projects.data.json`: two new entries; screenshot fixes on two existing
  entries.
- `frontend/src/app/core/data/experiences.data.json`: one new entry (Minima Studio); two new
  `preview_image_url` values on the existing Grupo Cobeca entry's links.
- `frontend/public/img/previews/`: new WebP captures — `dekasa.webp`, `arcoweld.webp`,
  `sublimax-tiktok.webp`, `cobeca-corporate.webp` (or reuse `cobeca.webp`), `cobeca-pfl8.webp`,
  `farmacia-saas.webp`.
- New shared component (e.g. `frontend/src/app/shared/components/link-preview-grid.component.ts`)
  used by both `project-detail.component.ts` and `timeline-item.component.ts`.

## Copy

Bilingual (ES/EN) `tagline`/`description`/`challenge`/`solution`/`results` for Dekasa and Arcoweld,
matching the existing case-study voice (plain, evidence-based, `<b>` tags on key tech terms), written
from direct inspection of both live sites. Framed as freelance frontend work for an agency, not
full-stack ownership (unlike Subladmin/Axsence).
