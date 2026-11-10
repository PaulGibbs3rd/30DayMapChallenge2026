import { cp, mkdir, readdir, unlink, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const day = resolve(import.meta.dirname, '..');
const dist = resolve(day, 'scripts/app/dist');
const assets = resolve(day, 'assets');
if (dirname(assets) !== day) throw new Error('Unexpected asset output');
await mkdir(assets, { recursive: true });
const entries = await readdir(resolve(dist, 'assets'));
await writeFile(resolve(day, 'index.html'), (await readFile(resolve(dist, 'index.html'),'utf8')).replace(/\r\n?/g,'\n'));
for (const entry of entries) await cp(resolve(dist, 'assets', entry), resolve(assets, entry), { recursive: true });
const current = new Set(entries);
for (const entry of await readdir(assets, { withFileTypes: true })) {
  if (!entry.isFile() || current.has(entry.name) || !/-[\w-]{8}\.(?:js|css|woff2?|gif|png|svg|wasm|geojson)$/.test(entry.name)) continue;
  const target = resolve(assets, entry.name);
  if (dirname(target) !== assets) throw new Error('Cleanup escaped assets');
  await unlink(target);
}
console.log('Exported Somewhere Between to day9/index.html and assets/.');
