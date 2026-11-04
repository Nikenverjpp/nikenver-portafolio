// Vercel serves 404.html with a real 404 status for any path outside the build
// output. It boots the client-rendered app, whose router shows the not-found page.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/nikenver-portfolio/browser');

const shell = readFileSync(resolve(OUTPUT_DIR, 'index.csr.html'), 'utf8');
writeFileSync(resolve(OUTPUT_DIR, '404.html'), shell.replace('</head>', '<meta name="robots" content="noindex"></head>'), 'utf8');
console.log('generated dist 404.html');
