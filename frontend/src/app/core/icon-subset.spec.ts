import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import servicesData from './data/services.data.json';

const SRC_DIR = resolve(__dirname, '../..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path);
    }
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts') ? [path] : [];
  });
}

function iconsUsedInTemplates(): string[] {
  const icons = new Set<string>();
  for (const file of sourceFiles(join(SRC_DIR, 'app'))) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/material-symbols-outlined[^>]*>([^<]*)</g)) {
      const content = match[1].trim();
      const names = content.includes('{{') ? [...content.matchAll(/[?:]\s*'([a-z_]+)'/g)].map((m) => m[1]) : [content];
      names.filter(Boolean).forEach((name) => icons.add(name));
    }
  }
  return [...icons];
}

describe('subconjunto de Material Symbols', () => {
  const html = readFileSync(join(SRC_DIR, 'index.html'), 'utf8');
  const subset = html.match(/icon_names=([a-z_,]+)/)?.[1].split(',') ?? [];
  const themeIcons = [
    ...readFileSync(join(SRC_DIR, 'app/core/theme/theme.service.ts'), 'utf8').matchAll(/(?:system|light|dark): '([a-z_]+)'/g),
  ].map((match) => match[1]);

  it('incluye todos los iconos que usa el sitio', () => {
    const used = [...iconsUsedInTemplates(), ...servicesData.map((service) => service.icon), ...themeIcons];
    expect(used.filter((icon) => !subset.includes(icon))).toEqual([]);
  });

  it('mantiene el orden alfabético que exige Google Fonts', () => {
    expect(subset).toEqual([...subset].sort());
  });
});
