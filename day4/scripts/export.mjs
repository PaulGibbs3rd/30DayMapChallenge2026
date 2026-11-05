import { cp, mkdir, readdir, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const day = resolve(import.meta.dirname, '..');
const dist = resolve(day, 'scripts/app/dist');
const assets = resolve(day, 'assets');
if (dirname(assets) !== day) throw new Error('Unexpected asset output directory');
const entries = await readdir(resolve(dist, 'assets'));
await mkdir(assets, { recursive: true });
await cp(resolve(dist, 'index.html'), resolve(day, 'index.html'));
for (const entry of entries) {
  await cp(resolve(dist, 'assets', entry), resolve(assets, entry), { recursive: true });
}
// Retain custom files; remove only obsolete, flat Vite files with content hashes.
const current = new Set(entries);
for (const entry of await readdir(assets, { withFileTypes: true })) {
  if (!entry.isFile() || current.has(entry.name) || !/-[\w-]{8}\.(?:js|css|woff2?|gif|png|svg|wasm)$/.test(entry.name)) continue;
  const path = resolve(assets, entry.name);
  if (dirname(path) !== assets) throw new Error('Asset cleanup escaped output directory');
  await unlink(path);
}
console.log('Exported Day 4 to index.html and assets, ready for the existing Pages build.');
