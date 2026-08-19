---
target: "todo el sistema (5 rutas: home, sobre-mi, proyectos, detalle de proyecto, contacto)"
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
timestamp: 2026-08-19T22-39-39Z
slug: frontend-src-app
---
# Critique — Portfolio completo (5 rutas)

## Puntaje de Salud de Diseño

| # | Heurística | Puntaje | Hallazgo clave |
|---|-----------|-------|-----------|
| 1 | Visibilidad del estado del sistema | 3 | Estados de nav/hover/toggle sólidos, pero una ruta inválida redirige en silencio a Home sin explicación |
| 2 | Correspondencia con el mundo real | 3 | Lenguaje claro en general, pero acrónimos técnicos (RBAC, RLS, OWASP, FEFO/FIFO) quedan en negrita sin explicar, un problema real para la audiencia no técnica que DESIGN.md nombra como co-primaria |
| 3 | Control y libertad del usuario | 3 | Menú móvil e idioma/tema son reversibles, pero un slug de proyecto inválido es un callejón sin salida |
| 4 | Consistencia y estándares | 3 | La "One Accent Rule" se respeta casi en todos lados, excepto el borde cian estático de TikTok en el carrusel social (confirmado por 3 fuentes independientes: lectura de código, detector CLI y overlay de navegador) |
| 5 | Prevención de errores | 3 | Sin formularios que fallar (decisión deliberada), enlaces externos con `rel="noopener noreferrer"` — pero nada amortigua el callejón sin salida del slug roto |
| 6 | Reconocimiento antes que recuerdo | 3 | Nav, breadcrumbs y badges con texto son reconocibles; el toggle de tema es solo-ícono y su estado actual solo se lee al pasar el mouse |
| 7 | Flexibilidad y eficiencia | n/a | Superficie de "explorar y decidir" sin flujo de uso repetido; atajos/acciones masivas no aplican aquí |
| 8 | Diseño estético y minimalista | 3 | Restringido en casi todo, excepto la lista plana de 13 cursos y el timeline de 7 entradas totalmente expandido en About |
| 9 | Recuperación de errores | 1 | Confirmado en código: `project-detail.component.ts` filtra proyectos inexistentes (`filter(p => !!p)`) y el `@if` no renderiza nada — pantalla en blanco. `app.routes.ts` manda cualquier URL rota a Home sin aviso. `translations.ts` no tiene strings de error/404 en ningún idioma |
| 10 | Ayuda y documentación | n/a | No aplica a una superficie de portfolio sin procedimientos que aprender |
| **Total** | | **22/32** | **Aceptable (69%), justo bajo el umbral de "Good"** |

## Veredicto de Especificidad de Diseño

**Específico, no intercambiable con otro producto — con un punto débil.** La evidencia más fuerte es la voz en primera persona de la bio en About (la tangente de consultor de fragancias, "Padre de familia · Vehículo propio · Catador de Perfumes · Fanático del fútbol y madridista", y la revelación explícita y sin cobertura de qué agentes de IA usó y cómo — "la experiencia y el criterio siguen siendo míos"). Los casos de estudio traen afirmaciones técnicas verificables (FEFO/FIFO, Row-Level Security vía Spatie, OWASP Top 10, multi-moneda USD/VES) ligadas a demos reales, no mockups genéricos. Nada de eso podría copiarse a otro portfolio sin cambios.

El sistema visual (canvas casi negro, un solo acento cian, bordes hairline, sin sombras en reposo) es más genérico en aislamiento — "portfolio oscuro de developer" es una estética común — pero se ejecuta con disciplina real (la regla de un solo acento se cumple de verdad, el glow solo aparece en hover, dos familias tipográficas mantenidas consistentemente).

El único punto donde reaparece lo genérico: la lista de "Cursos y diplomados" en About (13 ítems planos, sin jerarquía) se siente como un volcado de CV en una plantilla, en tensión visible con el minimalismo que el propio sistema declara.

**Escaneo determinístico:** El CLI corrió en modo degradado (faltan `htmlparser2`/`css-select`/`css-tree`/`domutils`, cayó a regex) y encontró 1 hallazgo real: `side-tab` (`border-l-4`) en `social-carousel.component.ts:28` — confirmado al leer el código, no es falso positivo. El overlay de navegador (modo no degradado, evaluando el DOM renderizado) encontró volúmenes mucho mayores por página (Home 57, About 81, Proyectos 13, Detalle de proyecto 16, Contacto 8 "anti-patrones"), dominados por `ai-color-palette` (cian neón sobre fondo oscuro) y `justified-text`. Cruzando esto con DESIGN.md: `ai-color-palette` dispara exactamente sobre la identidad de marca documentada (cian como único acento), y `justified-text` es una decisión reciente y deliberada (commit `7d13f40`, "justified bio text", y DESIGN.md lo documenta explícitamente) — ambos son falsos-positivos-adyacentes para un sistema de diseño a medida, no "slop" genérico de IA. Lo que sí es señal real y coincide entre los tres métodos (lectura de código de Assessment A, CLI, y overlay de navegador) es el borde cian estático de TikTok — la convergencia de tres fuentes independientes le da alta confianza. `line-length` (líneas de ~152 caracteres en los mismos párrafos justificados) es una queja de legibilidad real e independiente del debate sobre justificado. `image-hover-transform`, reportado contra el selector `body` en vez de un `<img>` concreto, parece un artefacto del detector (posiblemente relacionado con la misma dependencia de parser HTML faltante) — descontarlo.

**Overlays visuales:** durante la sesión se confirmó que el overlay renderiza cajas amarillas etiquetadas directamente sobre los elementos detectados, más un ticker en la parte superior del viewport — evidencia real de que la inyección funcionó, no solo logs de consola. Sin embargo, el servidor de overlay se detuvo al finalizar el paso B (como exige el protocolo), así que ahora mismo no hay overlay en vivo para ver en el navegador; la evidencia sobrevive como conteos y capturas tomadas durante la sesión.

## Impresión General

El sitio cumple su promesa central — "evidencia real sobre relleno" — con más disciplina que la mayoría de portfolios oscuros: un solo acento de color realmente respetado, tipografía consolidada a dos familias, y casos de estudio con afirmaciones técnicas verificables. El mayor problema no es visual sino estructural: cualquier enlace de proyecto roto (muy plausible desde un CV viejo o un post de LinkedIn desactualizado) deja al visitante en una pantalla en blanco sin explicación, justo en el momento en que el sitio más necesita causar una buena primera impresión. La segunda oportunidad más grande es el tramo final de About (Cursos + timeline), que rompe el propio estándar de minimalismo del sistema justo después de su mejor contenido.

## Qué Funciona

1. **La especificidad de la bio es el activo más fuerte del sitio** — no podría copiarse a otro portfolio sin cambios; el detalle de consultor de fragancias, el fanatismo por el fútbol y la revelación sin filtros del uso de IA se leen como una persona real, no un personaje.
2. **La "One Accent Rule" se aplica de verdad, no solo se declara** — cian es el único color usado para interactivo/seleccionado, ámbar aparece exactamente una vez (el stat "5+"), violeta se limita a un solo borde de carrusel. Esa disciplina es rara en portfolios oscuros.
3. **Los casos de estudio están estructurados como evidencia real, no copy de marketing** — Desafío/Solución/Resultados con especificaciones técnicas verificables y demo en vivo, convirtiendo "confía en mí" en algo comprobable.

## Problemas Prioritarios

**[P1] Las URLs de proyecto rotas y las rutas inválidas fallan en silencio, sin recuperación**
- **Por qué importa:** en `project-detail.component.ts`, `project$` filtra con `filter(project => !!project)`, así que un slug desconocido nunca emite nada y el bloque `@if` no renderiza contenido — un área en blanco, solo header/footer. Cualquier otra URL inválida pasa por `{ path: '**', redirectTo: '' }` en `app.routes.ts`, rebotando a Home sin aviso. `translations.ts` no tiene ningún string de error/404 en ninguno de los dos idiomas. Es exactamente el fallo que un reclutador encontraría si un link de proyecto se renombra, se escribe mal desde un CV, o se comparte desactualizado — justo en el momento en que el sitio intenta causar una primera impresión.
- **Arreglo:** dar a `ProjectDetailComponent` una rama explícita de "no encontrado" (mensaje bilingüe + link de vuelta a `/proyectos`) en vez de dejar que el filtro se trague el fallo; considerar una página real de no-encontrado en vez de un `redirectTo` silencioso.
- **Comando sugerido:** `/impeccable harden`

**[P2] Cian reutilizado como color de marca estático para TikTok, rompiendo la "One Accent Rule"**
- **Por qué importa:** convergencia de tres fuentes independientes (revisión de código, escaneo CLI del detector, y overlay de navegador) todas señalando el mismo `border-l-4` en `social-carousel.component.ts:28-30`, coloreado cian en reposo cuando `post.platform === 'tiktok'`. DESIGN.md documenta explícitamente la excepción de violeta para Instagram, pero ninguna excepción equivalente para cian/TikTok — el trabajo documentado de cian en todo el sitio es "interactivo o seleccionado," nunca decorativo estático.
- **Arreglo:** dar a TikTok un borde neutro (gris muted) para que el significado de cian se mantenga exclusivo en todo el sitio.
- **Comando sugerido:** `/impeccable harden`

**[P2] La lista de "Cursos y diplomados" rompe el propio minimalismo del sistema**
- **Por qué importa:** 13 ítems planos sin agrupar ni jerarquía, justo debajo de un timeline de 7 entradas ya denso — el tramo más visible que contradice el estándar "cada elemento gana su pixel" de DESIGN.md, y falla la regla de chunking (≤4 por grupo) del checklist de carga cognitiva. Un reclutador escaneando no puede distinguir un curso relevante de Angular/Laravel de un diplomado genérico de "Diseño Gráfico" de 2026.
- **Arreglo:** agrupar en 2-3 clusters con etiqueta (ej. Frontend/Backend/Otros), o aplicar el mismo patrón de "ver más" que ya existe para los párrafos de la bio justo arriba.
- **Comando sugerido:** `/impeccable distill`

**[P2] Contacto es delgado y se autoduplica en el momento de mayor decisión**
- **Por qué importa:** según la regla peak-end, este es el remate final y la razón de ser del sitio ("Éxito = una decisión de contacto informada"), pero no ofrece expectativa de tiempo de respuesta, y el botón flotante de WhatsApp duplica casi exactamente la tarjeta de "Teléfono / WhatsApp" de la propia página, justo donde el diseño debería reforzar la decisión, no repetirla.
- **Arreglo:** agregar una línea de expectativa (tiempo de respuesta típico, si es cierto); suprimir o reposicionar el botón flotante de WhatsApp específicamente en `/contacto`, donde su trabajo ya está hecho por la tarjeta de la página.
- **Comando sugerido:** `/impeccable clarify`

**[P3] Longitud de línea excesiva en los bloques de texto justificado**
- **Por qué importa:** el overlay del detector midió líneas de ~152 caracteres en los mismos párrafos de bio/descripción que usan `text-align: justify` sin hyphenation — un problema de legibilidad medible, independiente del debate sobre si justificar el texto fue la decisión correcta (que sí lo fue, documentada en DESIGN.md).
- **Arreglo:** acotar el ancho de medida de esos bloques de prosa (`max-width`/`ch` units) o activar `hyphens: auto`.
- **Comando sugerido:** `/impeccable typeset`

## Alertas por Persona

**Jordan (Primera vez, confundido — coincide con la audiencia "dueño de negocio no técnico" que DESIGN.md nombra explícitamente):**
- Jerga en negrita sin explicar en los casos de estudio ("Row-Level Security," "RBAC vía Spatie," "OWASP Top 10," "FEFO/FIFO") — Jordan no tiene tooltip ni glosa inline y debe confiar en la afirmación de credibilidad sin verificarla.
- El toggle de tema es un solo ícono cuyo estado actual (sistema/claro/oscuro) solo se lee al pasar el mouse — Jordan lo hace clic, ve la página recolorear, pero no tiene confirmación persistente y visible de en cuál de los tres estados quedó.
- Llegar por un link de proyecto viejo o mal escrito (muy plausible desde un CV o post de LinkedIn) deja a Jordan en Home redirigido en silencio, sin explicación de que algo falló.

**Riley (Probador metódico de estrés):**
- Navegar directo a un `/proyectos/<slug>` desconocido produce un área de contenido genuinamente en blanco — confirmado en código, no hipotético.
- La ruta wildcard enmascara cualquier otra URL rota de la misma forma — no hay señal distinguible entre "esto es Home a propósito" y "tu link estaba mal."
- El estado de `locale`/`theme` vive en `localStorage` con clave global (`portfolio-locale`, `portfolio-theme`) sin listener de sincronización entre pestañas — Riley probando en dos pestañas vería el idioma/tema de una filtrarse a la otra solo tras un refresh, lo que parece deriva de estado no determinística en vez de comportamiento diseñado.

**Casey (Usuario móvil distraído):**
- El timeline profesional de 7 entradas en About está totalmente expandido en móvil sin truncar, justo debajo de párrafos de bio que SÍ tienen accordion de "leer más" — Casey recibe alivio en una sección y un muro de scroll largo en la siguiente, aplicación inconsistente de un patrón que el código ya tiene.
- Skills (4 tarjetas) y Cursos (13 ítems) colapsan a una sola columna móvil sin links de salto dentro de la página, así que About se vuelve un scroll ininterrumpido desde el hero hasta el footer.
- El botón flotante de WhatsApp ocupa espacio fijo en la zona del pulgar en cada página, incluyendo justo sobre/junto a la propia tarjeta de WhatsApp de Contacto — tap targets redundantes compitiendo en la misma zona alcanzable.

## Observaciones Menores

- El header muestra siempre 7 controles interactivos simultáneos (4 links de nav + toggle de tema + ES + EN) — hoy está bien, vigilar si el nav crece más allá de 4 links.
- `translations.ts` no tiene vocabulario de error/404 en ningún idioma — debería agregarse junto con el arreglo P1.
- El negrita inline (`[innerHTML]`) se usa para los mismos términos técnicos que más necesitan contexto en lenguaje simple para la audiencia no técnica — negritar llama más la atención hacia acrónimos sin resolverlos.
- `image-hover-transform` reportado contra el selector `body` en dos páginas es probablemente un artefacto del detector, no un hallazgo real — descontar sin acción.
- Limitación de método: el redimensionado de ventana a 390×844 no tuvo efecto real en esta sesión de navegador (el viewport medido siguió en ~1920×945 en todas las verificaciones); los hallazgos específicos de móvil en este reporte vienen de leer las clases de breakpoint de Tailwind en el código fuente, no de una captura móvil en vivo.

## Preguntas a Considerar

- Si las dos audiencias nombradas (reclutadores técnicos vs. dueños de negocio no técnicos) leen la misma prosa de los casos de estudio, ¿debería haber dos densidades de explicación, o alcanza con un glosario/tooltip corto para términos como RBAC y RLS?
- La bio ya ganó su restricción con un accordion de "leer más" — ¿cómo se vería aplicar esa misma disciplina a la lista de Cursos y al timeline de About, los dos lugares que hoy piden atención ininterrumpida?
- Dado que Contacto es explícitamente la métrica de éxito del sitio, ¿cuál es el agregado más pequeño (una línea de tiempo de respuesta, un "esto pasa después") que haría que esa página se sienta tan cuidada como los casos de estudio que la preceden?
