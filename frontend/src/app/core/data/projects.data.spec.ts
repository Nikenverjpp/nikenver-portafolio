import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Project } from '@core/models/project.model';
import projectsData from './projects.data.json';
import servicesData from './services.data.json';

const projects = projectsData as Project[];
const PUBLIC_DIR = resolve(__dirname, '../../../../public');

const CATEGORIES = ['erp', 'ecommerce', 'website', 'infrastructure', 'game'];
const STATUSES = ['production', 'migrating', 'in_progress', 'pilot'];
const TEXT_FIELDS = ['title', 'tagline', 'seo_description', 'description', 'challenge', 'solution', 'results', 'contribution'] as const;

function localizedValues(project: Project): string[] {
  const texts = TEXT_FIELDS.flatMap((field) => {
    const value = project[field];
    return value ? [value.es, value.en] : [];
  });
  const cicd = project.cicd ? [project.cicd.ci.es, project.cicd.ci.en, project.cicd.cd.es, project.cicd.cd.en] : [];
  return [...texts, ...cicd];
}

describe('projects.data.json', () => {
  it('usa ids y slugs únicos', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });

  it.each(projects.map((p) => [p.slug, p] as const))('%s tiene datos válidos', (_slug, project) => {
    expect(project.categories.length).toBeGreaterThan(0);
    project.categories.forEach((category) => expect(CATEGORIES).toContain(category));
    expect(STATUSES).toContain(project.status);
    expect(project.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    if (project.has_cicd) {
      expect(project.cicd).toBeDefined();
    }
  });

  it.each(projects.map((p) => [p.slug, p] as const))('%s tiene ES y EN en cada texto', (_slug, project) => {
    for (const field of TEXT_FIELDS) {
      const value = project[field];
      if (value) {
        expect(value.es.trim(), `${field}.es`).not.toBe('');
        expect(value.en.trim(), `${field}.en`).not.toBe('');
      }
    }
  });

  it.each(projects.map((p) => [p.slug, p] as const))('%s apunta a imágenes que existen', (_slug, project) => {
    const images = [
      project.thumbnail_url,
      project.preview_image_url,
      ...(project.links ?? []).map((link) => link.preview_image_url),
    ].filter((url): url is string => !!url);
    for (const image of images) {
      expect(existsSync(`${PUBLIC_DIR}${image}`), image).toBe(true);
    }
  });

  it.each(projects.map((p) => [p.slug, p] as const))('%s tiene una descripción de 120 a 155 caracteres', (_slug, project) => {
    for (const lang of ['es', 'en'] as const) {
      const length = project.seo_description[lang].length;
      expect(length, lang).toBeGreaterThanOrEqual(120);
      expect(length, lang).toBeLessThanOrEqual(155);
    }
  });

  it('no contiene rayas largas en la copia', () => {
    const offenders = projects.filter((p) => localizedValues(p).some((text) => text.includes('—')));
    expect(offenders.map((p) => p.slug)).toEqual([]);
  });

  it('no usa etiquetas en los textos de CI/CD, que se muestran como texto plano', () => {
    const offenders = projects.filter((p) => p.cicd && /<\/?[a-z]/i.test(JSON.stringify(p.cicd)));
    expect(offenders.map((p) => p.slug)).toEqual([]);
  });

  it('no publica entornos internos ni repos privados', () => {
    const urls = projects.flatMap((p) => [p.demo_url, p.repo_url, ...(p.links ?? []).map((link) => link.url)]);
    const allText = JSON.stringify(projects);
    expect(urls.filter((url) => url && /(^|[/.-])(qa|staging)[.-]/i.test(url))).toEqual([]);
    expect(allText).not.toMatch(/github\.com\/(gonzaga-inteligencia-digital|inteligenciadigitalcgonzaga)/i);
  });

  it('declara la parte propia cuando el proyecto es del Colegio Gonzaga y se comparte', () => {
    const shared = ['gonzaga-admon-tesoreria', 'gonzaga-formulario-registro', 'gonzaga-mapa-red'];
    for (const slug of shared) {
      expect(projects.find((p) => p.slug === slug)?.contribution, slug).toBeDefined();
    }
  });
});

describe('services.data.json', () => {
  it('solo enlaza proyectos que existen', () => {
    const slugs = new Set(projects.map((p) => p.slug));
    const related = servicesData.flatMap((service) => service.relatedProjectSlugs ?? []);
    expect(related.filter((slug) => !slugs.has(slug))).toEqual([]);
  });
});
