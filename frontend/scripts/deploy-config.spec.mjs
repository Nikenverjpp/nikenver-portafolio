import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const FRONTEND = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(FRONTEND, path), 'utf8');

describe.each(['vercel.json', '../vercel.json'])('%s', (path) => {
  const config = JSON.parse(read(path));

  it('sirve los archivos que existen y responde 404 con 404.html a todo lo demás', () => {
    expect(config.rewrites).toBeUndefined();
    const [, filesystem, fallback] = config.routes;
    expect(filesystem).toEqual({ handle: 'filesystem' });
    expect(fallback).toEqual({ src: '/(.*)', status: 404, dest: '/404.html' });
  });

  it('desactiva el preset de framework, que podría agregar su propio catch-all', () => {
    expect(config.framework).toBeNull();
  });

  it('envía las cabeceras de seguridad en todas las rutas', () => {
    const [headers] = config.routes;
    expect(headers.src).toBe('/(.*)');
    expect(headers.continue).toBe(true);
    expect(Object.keys(headers.headers)).toEqual(expect.arrayContaining(['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy']));
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
