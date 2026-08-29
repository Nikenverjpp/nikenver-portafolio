# Descarga de CV en PDF

## Context

El portfolio no ofrece ninguna forma de llevarse la información de `/sobre-mi` fuera del sitio. Reclutadores suelen querer un PDF descargable — para guardarlo, imprimirlo o subirlo a un ATS. El CV en PDF que el usuario ya tiene (mencionado en `PRODUCT.md`) está desactualizado respecto al contenido que hoy vive en el sitio (experiencia, cursos, stack), así que en vez de subir ese archivo estático, el PDF se genera dinámicamente en el navegador a partir de los mismos datos que ya alimentan `/sobre-mi`. Esto evita que el PDF se desincronice del sitio en el futuro.

Consistente con `PRODUCT.md`: sitio 100% estático (sin servidor Node en producción), así que la generación debe ocurrir enteramente en el cliente. El texto del PDF debe ser texto real (seleccionable, parseable por un ATS), no una imagen — la audiencia de reclutadores hace este mapeo directo.

## Scope

1. **Nuevo servicio** `frontend/src/app/core/pdf/cv-pdf.service.ts` (`providedIn: 'root'`):
   - Método `download(locale: Locale): Promise<void>`.
   - Carga `pdfmake` vía `import()` dinámico (código no entra en el bundle inicial del sitio).
   - Arma un `docDefinition` de pdfmake a partir de:
     - Encabezado: nombre, `about.eyebrow`, contacto (email, LinkedIn, WhatsApp — mismos valores ya usados en el sitio, sin la ofuscación anti-bot que existe en la web, porque el visitante generó el PDF de forma explícita).
     - Resumen: `about.paragraph1-3`, convirtiendo las etiquetas `<b>` de las traducciones a runs `{text, bold: true}` de pdfmake en vez de perderlas como texto plano.
     - Experiencia: `ExperienceService.list()` — empresa, rol, rango de años, campo `description` (no `detail`, para no alargar demasiado el documento), stack como línea de texto.
     - Stack técnico: los `skillGroups` ya definidos en `about.component.ts`.
     - Cursos/certificaciones: los `courseGroups` ya definidos en `about.component.ts`.
   - Usa las fuentes estándar incluidas en pdfmake (Helvetica), no las fuentes de marca (Syne/IBM Plex) — evita embeber fuentes en base64 y mantiene la carga liviana.
   - Dispara la descarga con `pdfMake.createPdf(docDefinition).download(filename)`.
   - Nombre de archivo: `nikenver-pulgar-cv-es.pdf` / `nikenver-pulgar-cv-en.pdf` según el locale activo.

2. **Botón en `/sobre-mi`** (`about.component.ts`), ubicado cerca del encabezado/bio, antes de la sección de experiencia. Estado local vía signal (`idle | generating | error`):
   - Idle: texto `about.downloadCv` ("Descargar CV" / "Download CV").
   - Generating: spinner + `disabled`, mientras se resuelve el `import()` y se genera el documento.
   - Error: si el `import()` o `createPdf` fallan, muestra `about.downloadCvError` brevemente y vuelve a idle. No debe romper el resto de la página.

3. **`skillGroups` y `courseGroups`** se mueven de `about.component.ts` a un archivo compartido (p. ej. `core/data/skills.data.ts`) para que tanto el componente como `CvPdfService` los consuman desde un único origen, sin duplicar el contenido.

4. **Traducciones**: nuevas claves `about.downloadCv` y `about.downloadCvError` en `translations.ts` (ES/EN).

## Out of scope

- Reemplazar el CV PDF estático que el usuario ya tiene en otros contextos (LinkedIn, etc.) — este cambio es solo para el sitio.
- Replicar visualmente la marca (tipografía Syne/IBM Plex, colores) dentro del PDF — se usan fuentes estándar por peso de bundle y legibilidad ATS.
- Botón en el header/nav global o en otras páginas — solo vive en `/sobre-mi`.
- Incluir el campo `detail` (versión extendida) de cada experiencia — solo `description`.
- Generación o pre-renderizado del PDF en build time / servidor.

## Data flow

```
[click "Descargar CV"]
        ↓
CvPdfService.download(locale.locale())
        ↓
import('pdfmake/build/pdfmake')  (lazy, solo en este momento)
        ↓
lee: about.* (i18n) + ExperienceService.list() + skillGroups/courseGroups compartidos
        ↓
arma docDefinition (texto real, runs bold para <b>)
        ↓
pdfMake.createPdf(docDefinition).download(`nikenver-pulgar-cv-${locale}.pdf`)
```

## Error handling

- Fallo en `import()` (red, navegador muy viejo) o en `createPdf`: capturado en el servicio, propagado como rechazo de la promesa; el componente lo atrapa y pasa a estado `error` con mensaje breve, sin afectar el resto de `/sobre-mi`.

## Testing

- Unit test de `CvPdfService`: para `locale: 'es'` y `locale: 'en'`, verificar que el `docDefinition` generado contiene las secciones esperadas (nombre, cada experiencia de `ExperienceService`, cada `skillGroup`, cada `courseGroup`) — sin necesidad de renderizar el PDF real.
- Prueba manual en navegador: clic en el botón → descarga → abrir el PDF y confirmar que el texto es seleccionable y el contenido coincide con `/sobre-mi` en ambos idiomas.
