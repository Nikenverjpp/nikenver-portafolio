import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadProjects, publicFilePath, renderPublicFiles } from './generate-public-files.mjs';

const projects = loadProjects();
const files = renderPublicFiles(projects);
const normalize = (text) => text.replace(/\r\n/g, '\n');

describe('archivos públicos generados', () => {
  it.each(Object.keys(files))('public/%s está sincronizado con los datos (corre npm run generate:public)', (name) => {
    expect(existsSync(publicFilePath(name))).toBe(true);
    expect(normalize(readFileSync(publicFilePath(name), 'utf8'))).toBe(normalize(files[name]));
  });

  it('el sitemap incluye todos los proyectos', () => {
    for (const { slug } of projects) {
      expect(files['sitemap.xml']).toContain(`/proyectos/${slug}</loc>`);
    }
  });

  it('llms.txt y llms-full.txt mencionan todos los proyectos', () => {
    for (const { title } of projects) {
      expect(files['llms.txt']).toContain(title.es);
      expect(files['llms-full.txt']).toContain(`### ${title.es}`);
    }
  });

  it('no deja etiquetas HTML ni marcadores sin reemplazar', () => {
    for (const name of ['llms.txt', 'llms-full.txt']) {
      expect(files[name]).not.toMatch(/<\/?(b|i|code|a)\b/);
      expect(files[name]).not.toContain('{{');
    }
  });

  it('aeo.json es JSON válido y solo trae proyectos destacados', () => {
    const aeo = JSON.parse(files['aeo.json']);
    expect(aeo.key_projects).toHaveLength(projects.filter((project) => project.is_featured).length);
  });
});
