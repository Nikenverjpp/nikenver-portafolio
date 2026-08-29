# Analytics con Umami Cloud

## Context

El sitio no tiene ninguna forma de saber si la gente lo visita, qué páginas ve, o si usa el botón de CV. Se evaluaron Google Analytics, Plausible y Umami; se eligió Umami Cloud por ser sin cookies (sin banner de consentimiento, consistente con la filosofía "sin fricción" del sitio) y por tener tier gratis (evita meter infraestructura propia, consistente con el principio "estático y simple" de `PRODUCT.md`). El usuario ya tiene cuenta y sitio creado en Umami Cloud, con Website ID `2ff3c3b2-178d-40db-ab98-a506958d768f`.

## Scope

1. **`frontend/src/environments/environment.prod.ts`**: nuevo campo `analyticsWebsiteId: '2ff3c3b2-178d-40db-ab98-a506958d768f'`.
2. **`frontend/src/environments/environment.ts`** (dev): nuevo campo `analyticsWebsiteId: null`, para que el servicio pueda usar la sola presencia del ID como señal, no solo `production`.
3. **Nuevo `frontend/src/app/core/analytics/analytics.service.ts`**, `providedIn: 'root'`. En el constructor, solo si `isPlatformBrowser(platformId)` es `true` (nunca durante el prerenderizado en build time) y `environment.analyticsWebsiteId` no es `null`, crea un elemento `<script defer src="https://cloud.umami.is/script.js" data-website-id="...">` y lo agrega a `document.head`. Mismo patrón de guard que `LocaleService` (`isPlatformBrowser(inject(PLATFORM_ID))`).
4. **`frontend/src/app/app.component.ts`**: inyectar `AnalyticsService` junto a `ThemeService`/`LocaleService`, mismo comentario explicando que se inyecta para que su efecto de bootstrap corra.

## Out of scope

- Banner de consentimiento de cookies (Umami no usa cookies, no aplica).
- Eventos custom (clic en botón de CV, etc.) — solo pageviews automáticos por ahora.
- Dashboard o visualización de datos dentro del propio sitio — se consulta directamente en cloud.umami.is.

## Why this satisfies "solo producción, no `ng serve`"

`environment.ts` (usado por `ng serve` y por dev) tiene `analyticsWebsiteId: null` → el guard nunca pasa. `environment.prod.ts` (usado por el build de producción vía el `fileReplacements` ya existente en `angular.json`) tiene el ID real. El guard `isPlatformBrowser` además asegura que el script nunca se inyecte durante el prerenderizado en build time (que corre en un DOM simulado de Node, no en un navegador real) — solo se inyecta cuando un visitante real carga el sitio ya desplegado.
