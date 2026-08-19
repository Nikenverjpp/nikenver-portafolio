# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos audiencias, con el mismo peso:

- **Reclutadores y líderes técnicos** evaluando si contratar a Nikenver Pulgar como desarrollador Full Stack (Angular/Laravel), revisando trabajo real en producción y profundidad de stack.
- **Dueños de negocio no técnicos** evaluando si encargarle un sistema a medida (la misma relación que tiene con Sublimax/Subladmin), que necesitan confiar en el resultado sin entender términos como "SSR" o "RLS".

El copy y los casos de estudio deben funcionar para ambos: suficientemente técnico para probar profundidad, suficientemente claro para probar valor de negocio.

## Product Purpose

Portfolio personal de Nikenver Pulgar, desarrollador Full Stack (Angular + Laravel) en Maracaibo, Venezuela, con 10+ años de experiencia. Existe para conseguir empleo full-time y/o clientes freelance/consultoría mostrando sistemas reales y verificables en producción, no relleno de portfolio genérico. Éxito = una decisión de contacto informada, sin fricción.

## Positioning

Cada caso de estudio enlaza a un sistema real en producción (no un mockup ni una captura muerta) — Subladmin (ERP con lógica FEFO/FIFO y RLS), Axsence (e-commerce con SSR y diagnóstico olfativo por algoritmo), Sublimax (el negocio real que fundó), y plataformas internas de Grupo Cobeca — incluyendo sistemas que requieren credenciales que el visitante no tiene, usados como prueba de existencia más que como demo. El sitio también revela, en lenguaje simple, que Nikenver trabaja como desarrollador senior apoyado en IA (dirige la arquitectura y las decisiones, la IA acelera la implementación, él revisa cada línea) en vez de ocultar ese flujo de trabajo. Un portfolio vecino no podría copiar honestamente ninguna de las dos afirmaciones.

## Operating Context

- Bilingüe ES/EN vía un servicio de i18n propio basado en Signals (español es el locale por defecto).
- Tema oscuro por defecto; el tema claro es una alternativa explícita.
- Angular SSR + prerenderizado estático en build time; el sitio se despliega como archivos 100% estáticos (sin servidor Node corriendo) en Vercel, afinado tanto para SEO tradicional como para buscadores de IA (ChatGPT, Gemini) vía `llms.txt`.
- WhatsApp (link `wa.me`, botón flotante) es el canal de contacto principal, junto a correo y LinkedIn — deliberadamente sin formularios ni captura de datos.

## Capabilities and Constraints

- Angular 22 (standalone components, Signals, SSR) + Tailwind CSS v4.
- Datos de proyectos y experiencia en JSON estático (`frontend/src/app/core/data/*.data.json`), servidos por Angular services que devuelven `of(...)` — no hay CMS ni API backend para el contenido propio del portfolio.
- Internacionalización ES/EN propia (servicio de Signals + diccionario), sin librería externa. Tema claro/oscuro/sistema vía variables CSS, sin librería externa.
- Varios links de prueba apuntan a sistemas internos reales en producción (Step Web, SIC, PFL8, etc.) que requieren credenciales que el visitante no tiene; es intencional y no debe reemplazarse por capturas estáticas.
- Hay un backend Laravel en `backend/` dentro de este mismo repo, actualmente desconectado del sitio — decisión deliberada por ahora, no descartada para el futuro.

## Brand Commitments

Identidad "Dark Precision": oscuro por defecto, acentos cian/ámbar/violeta, tipografía Syne (display) + IBM Plex Sans (cuerpo) — ya establecida, no debe tratarse como indecisa. Marca "NP." en el header.

Durable, confirmado explícitamente por el usuario — debe sobrevivir cualquier rediseño futuro:
- Links de producción reales como prueba (nunca reemplazados por capturas estáticas ni eliminados).
- Revelación explícita del flujo de trabajo apoyado en IA (nunca suavizada ni cortada).
- Español como idioma por defecto.
- Sin formularios de contacto — filosofía explícita de "sin fricciones".

Más allá de eso, el usuario no puso más restricciones: contenido, estructura y mundo visual están abiertos a trabajo futuro.

## Evidence on Hand

- Links en vivo/producción: demo de Subladmin, Negociaciones Cobeca, Step Web, Step Web Junior, SIC, PFL8, Farmacia SaaS, Axsence (sitio + Instagram + TikTok), Sublimax (Instagram + TikTok), Isla de los Dinosaurios (demo + repo en GitHub).
- Una recomendación real de LinkedIn (Evert Pulgar, supervisor anterior).
- CVs detallados con logros cuantificados (p. ej., 260+ clientes reales de servicio de internet construidos en solitario en Gandalf Comunicaciones) usados para enriquecer el detalle de experiencia en `/sobre-mi`.
- Lista de cursos/certificaciones (Udemy, diplomados) mostrada en `/sobre-mi`.
- No hay testimonios de clientes, precios ni métricas de negocio ficticias — no inventar ninguna; solo hechos confirmados por los CVs, LinkedIn o el usuario directamente.

## Product Principles

1. **Evidencia real sobre relleno** — cada afirmación necesita un artefacto real y verificable detrás (link en vivo, login de producción, repo); nunca proyectos de práctica ni métricas inventadas.
2. **Español primero, bilingüe por defecto** — el mercado primario es Venezuela/LatAm; inglés es la audiencia secundaria, no la asumida.
3. **Revelar el flujo de trabajo apoyado en IA abiertamente** en vez de ocultarlo; el juicio y la revisión siguen siendo humanos, la IA acelera la ejecución.
4. **Escribir para ambas audiencias en el mismo copy** — profundidad técnica junto con resultados de negocio en lenguaje simple, no muros de jerga que solo funcionan para un lector.
5. **Sin fricción para el visitante** — sin formularios ni pasos innecesarios; contacto directo siempre a un clic.
6. **Detalles personales y humanos son decisiones de identidad deliberadas, no relleno** (familia, hobbies, expertise paralelo como asesoría olfativa) — humanizan a la persona detrás del stack y deben mantenerse fieles a cómo el usuario realmente se describe.
7. **Estático y simple hasta que haga falta lo contrario** — sin backend propio ni dependencias nuevas salvo que resuelvan un problema real.
