# Portafolio escalable y proyectos Gonzaga: plan de implementación

**Objetivo:** dejar el sitio listo para crecer e integrar seis proyectos nuevos, con los casos existentes corregidos.

**Arquitectura:** `projects.data.json` es la única fuente. Los filtros, el sitemap, `llms*.txt`, `aeo.json` y el CV se derivan de ese archivo.

**Stack:** Angular 22, Tailwind 4, Vitest, Node 22.

**Especificación:** `docs/superpowers/specs/2026-11-04-proyectos-escalables-gonzaga-design.md`

## Restricciones globales

- UI con claves en `UI_STRINGS`, en ES y EN.
- Sin rayas largas en copia nueva y con acentos reales.
- Sin formularios nuevos ni librerías de runtime nuevas.

## Tareas

### 1. Modelo, filtros y pruebas

- Modificar `frontend/src/app/core/models/project.model.ts`: tipos y campos de la especificación.
- Crear `frontend/src/app/features/projects/project-filters.ts` con `matchesFilter(project, filter)`, `TYPE_FILTERS`, `TECH_FILTERS` y `clientNames(projects)`.
- Crear `frontend/vitest.config.ts` y el script `test`.
- Crear `project-filters.spec.ts`, primero en rojo.

Verificar con `npm test` en `frontend/`.

### 2. Datos

- Agregar los campos nuevos a los 12 proyectos, corregir los cuatro desactualizados y agregar los seis nuevos.
- Crear `frontend/src/app/core/data/projects.data.spec.ts` con la validación.
- Ajustar `services.data.json` y las FAQ de `translations.ts`, que hoy repiten cifras.

Verificar con `npm test`.

### 3. Archivos públicos generados

- Crear `frontend/scripts/generate-public-files.mjs` y `frontend/scripts/templates/`.
- Agregar `prebuild` a `package.json`.
- Agregar una prueba de sincronía.

Verificar con `npm test`, y revisar `git diff` de `frontend/public`.

### 4. Pantallas

- `projects-list.component.ts`: filtros agrupados con conteo.
- `project-card.component.ts`: estado y logo de respaldo.
- `project-detail.component.ts`: "Mi parte", aviso de credenciales, crédito JSON-LD.
- `translations.ts`: claves nuevas.

Verificar en navegador, en ES y EN, móvil y escritorio, tema claro y oscuro.

### 5. CV y capturas

- `cv-pdf.service.ts`: formato compacto para no destacados.
- Capturar con Chrome headless las páginas públicas o de login de Admon, Formulario, Cierre y WordPress, y convertirlas a webp de 960×474. Revisar cada imagen antes de publicarla.

### 6. Verificación final

- `npm test` y `npm run build`.
- Revisar los HTML prerenderizados de los seis proyectos nuevos.
- Buscar palabras sin acento y rayas largas en la copia nueva.
- Medir con Lighthouse la lista de proyectos.
- Actualizar `PRODUCT.md`: "cada caso enlaza" deja de ser exacto.
