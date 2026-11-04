# Portafolio escalable y proyectos de Colegio Gonzaga

Aprobado por el dueño el 2026-11-04. El sitio pasa de 12 a 18 proyectos, y lo que hoy funciona con 12 (filtros por slug, cifras copiadas a mano, CV completo) deja de funcionar con 18.

## Alcance

**Entran seis proyectos nuevos:** Admon, Formulario Gonzaga, Cierre de facturación, Mapa de red, WordPress del colegio y kit de televisores.

**Quedan fuera:** SGP, Agenda, Ficha médica, Inscripciones y Diario. Sus repos solo muestran la importación desde cPanel y no prueban autoría. Se agregan cuando el dueño confirme qué hizo en cada uno.

**Experiencia laboral:** el dueño trabaja en el Colegio Gonzaga, a cargo de todo lo anterior y del soporte técnico (confirmado por el dueño). Se agrega como empleo actual, primero en la trayectoria.

**Se corrigen:** Subladmin, Catálogo Sublimax, Sublimax y Sistema de Donaciones, contra sus repos. Axsence no cambia (confirmado por el dueño).

## Reglas de contenido

- Cada proyecto con autoría compartida declara la parte del dueño en `contribution`. Nunca se presenta como propio el trabajo del otro desarrollador, y tampoco se le nombra.
- Las cifras viven solo en su proyecto. El texto general no repite conteos.
- Los conteos de pruebas salen de contar declaraciones en el código, no de una corrida, y se redondean hacia abajo ("más de 2.500").
- No se publican hosts de QA, repos privados, el plano del colegio, datos de red, rutas internas ni capturas con datos reales.
- El bot de WhatsApp de Donaciones se describe como pendiente de activar (confirmado por el dueño).
- La copia sigue la regla stop-slop de la memoria del proyecto, en ES y EN, con acentos reales.

## Modelo de datos

`Project` agrega:

| Campo | Tipo | Uso |
|---|---|---|
| `categories` | `ProjectCategory[]` | Filtro por tipo: `erp`, `ecommerce`, `website`, `infrastructure`, `game` |
| `status` | `production`, `migrating`, `in_progress`, `pilot` | Etiqueta en tarjeta y caso |
| `contribution` | `LocalizedText` | Sección "Mi parte" |
| `requires_login` | `boolean` | Aviso de credenciales y texto del botón |
| `updated_at` | `YYYY-MM-DD` | `lastmod` del sitemap |

## Filtros

Función pura en `project-filters.ts`. Tres grupos con una sola selección activa:

- **Tipo:** lee `categories`.
- **Tecnología:** lee `stack` y `has_cicd`.
- **Cliente:** lee `company` y solo ofrece clientes con dos proyectos o más.

Cada opción muestra cuántos proyectos tiene.

## Archivos públicos generados

`scripts/generate-public-files.mjs` corre en `prebuild` y escribe `sitemap.xml`, `llms.txt`, `llms-full.txt` y `aeo.json` desde `projects.data.json` y plantillas en `scripts/templates/`. Los archivos generados siguen en git para que `ng serve` los sirva. Una prueba falla si quedan desincronizados.

## Pantallas

- **Lista:** filtros agrupados con conteo. La tarjeta marca el estado solo cuando no es producción, porque 14 de 18 lo son. Un proyecto sin captura muestra el logo del cliente.
- **Caso:** sección "Mi parte" tras el resumen, aviso de credenciales junto al botón y crédito correcto en JSON-LD (`contributor` en lugar de `author` cuando hay `contribution`).
- **CV en PDF:** todos los proyectos siguen. Los destacados conservan el detalle, y los demás van compactos: título, descripción corta y, si aplica, la parte propia.

## Pruebas

Vitest sin Angular, para mantenerlas rápidas: filtros, validación de datos (slugs e ids únicos, ES y EN completos, sin rayas largas, imágenes existentes, servicios que apuntan a slugs reales, categoría y estado válidos, enlaces privados prohibidos) y sincronía de los archivos generados.

## Fuera de alcance

- Filtros combinados y filtros en la URL.
- Testimonios o métricas de negocio.
