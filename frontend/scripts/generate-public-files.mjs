// Builds the public SEO and AI-search files from projects.data.json, so a project
// only has to be edited in one place. Runs before every build (see package.json).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(SCRIPT_DIR, 'templates');
const PUBLIC_DIR = resolve(SCRIPT_DIR, '../public');
const DATA_FILE = resolve(SCRIPT_DIR, '../src/app/core/data/projects.data.json');
const SITE_ORIGIN = 'https://nikenver-portafolio.vercel.app';

const CATEGORY_LABELS = {
  erp: 'Sistema de gestión',
  ecommerce: 'E-commerce',
  website: 'Sitio web',
  infrastructure: 'Infraestructura',
  game: 'Videojuego educativo',
};

const STATUS_LABELS = {
  production: 'En producción',
  migrating: 'En producción, con una migración en curso',
  in_progress: 'En desarrollo, sin desplegar',
  pilot: 'Piloto',
};

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/sobre-mi', changefreq: 'monthly', priority: '0.8' },
  { path: '/proyectos', changefreq: 'weekly', priority: '0.9' },
  { path: '/servicios', changefreq: 'monthly', priority: '0.8' },
  { path: '/contacto', changefreq: 'monthly', priority: '0.7' },
];

const plain = (html) => html?.replace(/<\/?[^>]+>/g, '');
const projectUrl = (project) => `${SITE_ORIGIN}/proyectos/${project.slug}`;
const byOrder = (projects) => [...projects].sort((a, b) => a.sort_order - b.sort_order);
const categoryLabels = (project) => project.categories.map((category) => CATEGORY_LABELS[category]).join(', ');
const liveLink = (project) =>
  project.demo_url && `${project.demo_url}${project.requires_login ? ' (pide credenciales)' : ''}`;

function renderSitemap(projects) {
  const newest = projects.map((project) => project.updated_at).sort().at(-1);
  const entry = ({ loc, lastmod, changefreq, priority }) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const entries = [
    ...STATIC_ROUTES.map((route) => entry({ ...route, loc: `${SITE_ORIGIN}${route.path}`, lastmod: newest })),
    ...byOrder(projects).map((project) =>
      entry({
        loc: projectUrl(project),
        lastmod: project.updated_at,
        changefreq: 'monthly',
        priority: project.is_featured ? '0.8' : '0.6',
      }),
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

function renderProjectList(projects) {
  return byOrder(projects)
    .map((project) => {
      const parts = [
        plain(project.tagline.es),
        `Estado: ${STATUS_LABELS[project.status]}`,
        `Stack: ${project.stack.join(', ')}`,
        liveLink(project) && `Enlace: ${liveLink(project)}`,
      ].filter(Boolean);
      return `- [${project.title.es}](${projectUrl(project)}): ${parts.join('. ')}.`;
    })
    .join('\n');
}

function renderProjectSheets(projects) {
  return byOrder(projects)
    .map((project) => {
      const fields = [
        ['Tipo', categoryLabels(project)],
        ['Estado', STATUS_LABELS[project.status]],
        ['Organización', project.company],
        ['Año', project.year],
        ['Resumen', plain(project.description?.es)],
        ['Desafío', plain(project.challenge?.es)],
        ['Solución', plain(project.solution?.es)],
        ['Resultados', plain(project.results?.es)],
        ['Aporte propio de Nikenver', plain(project.contribution?.es)],
        ['Stack', project.stack.join(', ')],
        ['Integración continua', plain(project.cicd?.ci.es)],
        ['Despliegue continuo', plain(project.cicd?.cd.es)],
        ['Enlace', liveLink(project)],
        ['Código', project.repo_url],
      ];
      const lines = fields.filter(([, value]) => value).map(([label, value]) => `- **${label}**: ${value}`);
      return `### ${project.title.es}\n${lines.join('\n')}`;
    })
    .join('\n\n');
}

function renderAeo(projects, template) {
  const aeo = JSON.parse(template);
  aeo.key_projects = byOrder(projects)
    .filter((project) => project.is_featured)
    .map((project) => ({
      name: project.title.es,
      type: categoryLabels(project),
      status: STATUS_LABELS[project.status],
      stack: project.stack,
      url: project.demo_url ?? projectUrl(project),
      highlights: plain(project.tagline.es),
    }));
  return `${JSON.stringify(aeo, null, 2)}\n`;
}

/** @returns {Record<string, string>} generated file contents, keyed by file name inside public/. */
export function renderPublicFiles(projects, readTemplate = (name) => readFileSync(resolve(TEMPLATES_DIR, name), 'utf8')) {
  return {
    'sitemap.xml': renderSitemap(projects),
    'llms.txt': readTemplate('llms.template.txt').replace('{{PROJECTS}}', () => renderProjectList(projects)),
    'llms-full.txt': readTemplate('llms-full.template.txt').replace('{{PROJECT_SHEETS}}', () =>
      renderProjectSheets(projects),
    ),
    'aeo.json': renderAeo(projects, readTemplate('aeo.template.json')),
  };
}

export function loadProjects() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}

export const publicFilePath = (name) => resolve(PUBLIC_DIR, name);

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  for (const [name, content] of Object.entries(renderPublicFiles(loadProjects()))) {
    writeFileSync(publicFilePath(name), content, 'utf8');
    console.log(`generated public/${name}`);
  }
}
