# Portfolio Nikenver Pulgar

Repositorio del portfolio personal de Nikenver Pulgar — desarrollador Full Stack (Angular + Laravel) en Maracaibo, Venezuela.

## Estructura del proyecto

- `frontend/`: aplicación Angular (Standalone Components, Signals, SSR + prerenderizado estático). Es la app que se despliega en producción.
- `backend/`: API Laravel de referencia (no es la fuente de datos del frontend hoy — ver nota abajo).
- `DESIGN.md`: sistema de diseño del sitio (colores, tipografía, componentes) para mantener consistencia visual.
- `PRODUCT.md` (dentro de `frontend/`): contexto de producto — audiencia, posicionamiento, principios de contenido.

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

- **Frontend**: Angular 22 (Standalone Components, Signals, SSR), Tailwind CSS v4, animate.css para las animaciones de scroll-reveal.
- **Contenido**: los datos de proyectos y experiencia del frontend viven en JSON local (`frontend/src/app/core/data/`), servidos vía Angular services — no hay CMS ni dependencia del backend Laravel para el contenido del portfolio en sí.
- **Backend**: Laravel con migraciones y seeders, expuesto como API de solo lectura; documentado por separado, no es requisito para correr el frontend.
- **i18n**: servicio de locale/tema propio basado en Signals (sin librería externa), español como idioma por defecto.
- **Alias de imports**: `@core/*`, `@shared/*`, `@components/*`, `@features/*`, `@env/*` (ver `frontend/tsconfig.json`).
- **Despliegue**: Vercel, construye únicamente `frontend/` (ver `vercel.json`).

## Notas

- Si vas a tocar la parte visual, revisa primero `DESIGN.md` — documenta la paleta, tipografía y reglas de estilo ya establecidas para no romper la consistencia.
- Este repo no versiona `dist/`, `node_modules/`, ni `.env` — ver `.gitignore`.
