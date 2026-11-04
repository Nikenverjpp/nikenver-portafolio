import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const FRONTEND = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(FRONTEND, path), 'utf8');

describe.each(['vercel.json', '../vercel.json'])('%s', (path) => {
  const config = JSON.parse(read(path));

  it('no reescribe todas las rutas, para que las páginas inexistentes den 404', () => {
    expect(config.rewrites).toBeUndefined();
    expect(config.routes).toBeUndefined();
  });

  it('desactiva el preset de framework, que podría agregar su propio catch-all', () => {
    expect(config.framework).toBeNull();
  });

  it('envía las cabeceras de seguridad en todas las rutas', () => {
    const keys = config.headers[0].headers.map((header) => header.key);
    expect(config.headers[0].source).toBe('/(.*)');
    expect(keys).toEqual(expect.arrayContaining(['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy']));
  });
});

describe('schema del sitio', () => {
  const block = read('src/index.html').match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
  const graph = JSON.parse(block)['@graph'];
  const person = graph.find((node) => node['@type'] === 'Person');
  const sublimax = graph.find((node) => node.name === 'Sublimax');

  it('enlaza Sublimax con su fundador', () => {
    expect(sublimax.founder['@id']).toBe(person['@id']);
  });

  it('deja las cuentas de marca en Sublimax, no en la persona', () => {
    expect(person.sameAs.filter((url) => /sublimax/i.test(url))).toEqual([]);
  });
});
