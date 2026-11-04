import { describe, expect, it } from 'vitest';
import { Project } from '@core/models/project.model';
import { clientNames, countMatches, matchesFilter } from './project-filters';

function project(overrides: Partial<Project>): Project {
  return {
    id: '1',
    slug: 'demo',
    title: { es: 'Demo', en: 'Demo' },
    seo_description: { es: 'Demo', en: 'Demo' },
    categories: ['website'],
    status: 'production',
    updated_at: '2026-11-04',
    is_featured: false,
    sort_order: 1,
    ...overrides,
  };
}

describe('matchesFilter', () => {
  it('muestra todo con el filtro "all"', () => {
    expect(matchesFilter(project({}), 'all')).toBe(true);
  });

  it('filtra por categoría sin mirar el slug', () => {
    const redDelColegio = project({ slug: 'gonzaga-mapa-red', categories: ['infrastructure'] });
    expect(matchesFilter(redDelColegio, 'type:erp')).toBe(false);
    expect(matchesFilter(redDelColegio, 'type:infrastructure')).toBe(true);
  });

  it('filtra por tecnología usando el stack', () => {
    const app = project({ stack: ['Next.js', 'Laravel'] });
    expect(matchesFilter(app, 'tech:next')).toBe(true);
    expect(matchesFilter(app, 'tech:laravel')).toBe(true);
    expect(matchesFilter(app, 'tech:angular')).toBe(false);
  });

  it('reconoce CI/CD por la bandera o por el stack', () => {
    expect(matchesFilter(project({ has_cicd: true }), 'tech:cicd')).toBe(true);
    expect(matchesFilter(project({ stack: ['CI/CD'] }), 'tech:cicd')).toBe(true);
    expect(matchesFilter(project({}), 'tech:cicd')).toBe(false);
  });

  it('filtra por cliente', () => {
    const app = project({ company: 'Colegio Gonzaga' });
    expect(matchesFilter(app, 'client:Colegio Gonzaga')).toBe(true);
    expect(matchesFilter(app, 'client:Sublimax')).toBe(false);
    expect(matchesFilter(project({}), 'client:Sublimax')).toBe(false);
  });
});

describe('clientNames', () => {
  it('solo ofrece clientes con dos proyectos o más, del que tiene más al que tiene menos', () => {
    const projects = [
      project({ company: 'Sublimax' }),
      project({ company: 'Sublimax' }),
      project({ company: 'Colegio Gonzaga' }),
      project({ company: 'Colegio Gonzaga' }),
      project({ company: 'Colegio Gonzaga' }),
      project({ company: 'Una sola vez' }),
      project({}),
    ];
    expect(clientNames(projects)).toEqual(['Colegio Gonzaga', 'Sublimax']);
  });
});

describe('countMatches', () => {
  it('cuenta los proyectos de un filtro', () => {
    const projects = [project({ categories: ['erp'] }), project({ categories: ['erp', 'website'] }), project({})];
    expect(countMatches(projects, 'type:erp')).toBe(2);
    expect(countMatches(projects, 'all')).toBe(3);
  });
});
