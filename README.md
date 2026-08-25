# Portfolio Nikenver Pulgar

Repositorio del portfolio personal de Nikenver Pulgar, desarrollador Full Stack (Angular + Laravel) en Maracaibo, Venezuela.

## Qué tiene el sitio

- **Inicio**: hero con animación de tipeo en el rol, fondo de íconos de tecnologías (Angular, Laravel, React, Vue, PostgreSQL y más) flotando con deriva lenta en CSS y un efecto de paralaje sutil que sigue el mouse, estadísticas rápidas, experiencia profesional y proyectos destacados.
- **Sobre mí**: biografía completa y línea de tiempo de experiencia laboral.
- **Proyectos**: catálogo filtrable con ficha de detalle por proyecto.
- **Servicios**: qué se puede contratar, con evidencia real de proyectos por cada servicio, el proceso de trabajo en pasos y los motivos para contratar. Sin precios, a propósito.
- **Contacto**: correo y WhatsApp ocultos detrás de un botón de "mostrar" en vez de texto plano, para reducir el scraping automático de spam.
- **Botón flotante de WhatsApp**: visible en todo el sitio, con el número armado solo al interactuar (nunca queda en el HTML estático) y navegación nativa por `<a>` para que ningún bloqueador de pop-ups lo interrumpa.
- **Idioma y tema**: español e inglés, y modo oscuro/claro, ambos con un servicio propio basado en Signals (sin librería externa).
- **Accesibilidad**: `prefers-reduced-motion` respetado en toda animación, foco visible, aria-labels en controles interactivos.

## Estructura del proyecto

- `frontend/`: aplicación Angular (Standalone Components, Signals, SSR + prerenderizado estático). Es la app que se despliega en producción.
- `backend/`: API Laravel de referencia. Hoy no alimenta los datos del frontend (ver nota abajo).
- `DESIGN.md`: sistema de diseño del sitio (colores, tipografía, componentes) para mantener consistencia visual.
- `PRODUCT.md` (dentro de `frontend/`): contexto de producto, con audiencia, posicionamiento y principios de contenido.

## Cómo correr el proyecto

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Abre `http://localhost:4200`.

### Backend (Laravel, opcional)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Detalles técnicos

- **Frontend**: Angular 22 (Standalone Components, Signals, SSR), Tailwind CSS v4 con variables por tema, animate.css para las animaciones de scroll-reveal, coordinadas por una directiva propia (`RevealOnScrollDirective`).
- **Contenido**: los datos de proyectos y experiencia del frontend viven en JSON local (`frontend/src/app/core/data/`) y se sirven vía Angular services. El portfolio no depende de un CMS ni del backend Laravel para su contenido.
- **Backend**: Laravel con migraciones y seeders, expuesto como API de solo lectura; documentado por separado, no es requisito para correr el frontend.
- **i18n**: servicio de locale/tema propio basado en Signals (sin librería externa), español como idioma por defecto.
- **Alias de imports**: `@core/*`, `@shared/*`, `@components/*`, `@features/*`, `@env/*` (ver `frontend/tsconfig.json`).
- **Despliegue**: Vercel, construye únicamente `frontend/` (ver `vercel.json`).

## Notas

- Si vas a tocar la parte visual, revisa primero `DESIGN.md`. Ahí están la paleta, la tipografía y las reglas de estilo ya establecidas, para no romper la consistencia.
- Este repo no versiona `dist/`, `node_modules/` ni `.env` (ver `.gitignore`).
