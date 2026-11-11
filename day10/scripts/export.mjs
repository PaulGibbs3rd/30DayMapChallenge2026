import { cp, readFile, readdir, unlink, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const day = resolve(import.meta.dirname, '..');
const build = resolve(import.meta.dirname, 'app/dist');
const output = resolve(day, 'assets');
if (dirname(output) !== day) throw new Error('Unexpected Day 10 asset directory');
await mkdir(output, { recursive: true });
const generated = await readdir(resolve(build, 'assets'));
for (const asset of generated) await cp(resolve(build, 'assets', asset), resolve(output, asset));
await writeFile(resolve(day, 'index.html'), await readFile(resolve(build, 'index.html')));
const keep = new Set(generated);
for (const file of await readdir(output, { withFileTypes: true })) {
  if (file.isFile() && !keep.has(file.name) && /-[\w-]{8}\.(?:js|css|woff2?|png|gif|svg|wasm|geojson)$/.test(file.name)) {
    await unlink(resolve(output, file.name));
  }
}
console.log(`Exported Waterfront Flight to day10/ with ${generated.length} generated assets.`);
