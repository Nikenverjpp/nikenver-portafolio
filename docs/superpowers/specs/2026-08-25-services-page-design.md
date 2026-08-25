# Services page ("Servicios")

## Context

The site has no page answering "what do you offer, what can I hire you for" — only case studies (Proyectos), a career timeline (Sobre mí), and bare contact info (Contacto). The user asked for a page covering: what he offers, what can be bought, why hire him.

Per `PRODUCT.md`'s product principles, this page must not invent prices, testimonials, or metrics — content here is either confirmed directly by the user or reused from facts already established elsewhere on the site.

## Scope

1. **New route `/servicios`**, new nav item ("Servicios") between "Proyectos" and "Contacto" in both the desktop and mobile nav lists in `shell.component.ts`.
2. **New data layer**, following the existing `projects.data.json` / `ProjectService` pattern:
   - `frontend/src/app/core/models/service.model.ts`
   - `frontend/src/app/core/data/services.data.json` — 5 entries (confirmed by the user): sistemas administrativos a medida, e-commerce, landing pages/sitios institucionales, mantenimiento y soporte, consultoría técnica. Each entry has a bilingual title/description and an optional `relatedProjectSlugs: string[]` pointing at real, already-published projects as evidence.
   - `frontend/src/app/core/api/service.service.ts` — `list(): Observable<Service[]>`, mirrors `ProjectService`.
3. **New page component** `frontend/src/app/features/services/services.component.ts`, four sections:
   - **Qué ofrezco**: grid of service cards from `ServiceService.list()`. Each card shows title, description, and — when `relatedProjectSlugs` is set — small text links to those projects' case studies (`routerLink="/proyectos/:slug"`) as evidence, no images (keeps the card light; the project cards elsewhere already carry the screenshots). No prices anywhere; each card's description frames cost as "cotización según alcance" (quote based on scope).
   - **Cómo trabajo**: static 4-step list (Contacto inicial → Propuesta y alcance → Desarrollo → Entrega y soporte), translation-key driven, no data file (fixed content, not reused elsewhere).
   - **Por qué contratarme**: 4 static points reusing facts already confirmed on the site (10+ years, real production evidence, business-owner perspective via Sublimax, AI-assisted senior workflow) — translation keys only, no new claims.
   - **CTA**: same visual pattern as the bottom CTA block on `home.component.ts` (card-surface, heading + text + primary button), linking to `/contacto`.
4. **Translations**: new keys under a `services.*` namespace in `translations.ts`, plus `nav.services`, `title.services`, `meta.services`.

## Out of scope

- Pricing, ranges, or cost estimates of any kind.
- Testimonials or client quotes (none confirmed).
- A booking form or lead-capture form (violates the site's no-forms/no-friction commitment — CTA is always a direct link to `/contacto`, same as the rest of the site).
- Per-service detail routes/pages — this is a single list page, not a `/servicios/:slug` set.

## Data shape

```ts
export interface Service {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string; // Material Symbols icon name, matches existing `material-symbols-outlined` usage
  relatedProjectSlugs?: string[];
  sort_order: number;
}
```

## Content (confirmed)

1. **Sistemas administrativos a medida** → evidence: `subladmin-sistema-administrativo`
2. **E-commerce** → evidence: `axsence-perfumeria-premium`, `dekasa-porcelanato-revestimientos`
3. **Landing pages y sitios institucionales** → evidence: `amavida-zulia`, `wilmer-nadin-holistic-center`
4. **Mantenimiento y soporte de sistemas existentes** → evidence: `cobeca-corporate-apps`
5. **Consultoría técnica** → no evidence link (backed by the "por qué contratarme" section, not a single project)
