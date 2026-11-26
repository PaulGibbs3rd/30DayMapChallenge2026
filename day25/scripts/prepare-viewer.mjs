import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const day = resolve(import.meta.dirname, '..');
const portal = resolve(day, '../day20/city-download-portal');
const require = createRequire(resolve(portal, 'package.json'));
const { build } = require('esbuild');
const vendor = resolve(day, 'vendor');

await mkdir(vendor, { recursive: true });
await build({
  stdin: {
    contents: `export { BufferAttribute, BufferGeometry, Color, DirectionalLight, GridHelper,
      HemisphereLight, Mesh, MeshStandardMaterial, NeutralToneMapping, OrthographicCamera,
      Scene, Spherical, Vector3, WebGLRenderer } from 'three';
      export { OrbitControls } from 'three/addons/controls/OrbitControls.js';`,
    resolveDir: portal,
  },
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'Day25Three',
  outfile: resolve(vendor, 'three.js'),
});
await writeFile(resolve(vendor, 'three-license.txt'), await readFile(resolve(portal, 'node_modules/three/LICENSE')));

for (const name of ['queen-anne', 'lower-manhattan']) {
  const stl = await readFile(resolve(day, 'assets', name + '.stl'));
  const faceCount = stl.readUInt32LE(80);
  if (!faceCount || stl.length !== 84 + faceCount * 50) throw new Error(`Invalid binary STL: ${name}`);

  const lookup = new Map();
  const positions = [];
  const deltas = new Int32Array(faceCount * 3);
  let previous = 0;
  for (let face = 0; face < faceCount; face++) {
    for (let corner = 0; corner < 3; corner++) {
      const offset = 96 + face * 50 + corner * 12;
      const x = stl.readFloatLE(offset);
      const y = stl.readFloatLE(offset + 4);
      const z = stl.readFloatLE(offset + 8);
      if (![x, y, z].every(Number.isFinite)) throw new Error(`Non-finite vertex in ${name}`);

      const key = `${x}/${y}/${z}`;
      let index = lookup.get(key);
      if (index === undefined) {
        index = positions.length / 3;
        lookup.set(key, index);
        positions.push(x, y, z);
      }
      deltas[face * 3 + corner] = index - previous;
      previous = index;
    }
  }

  // Store the vertex count, float32 positions and signed index deltas, all little-endian.
  const header = Buffer.alloc(4);
  header.writeUInt32LE(positions.length / 3);
  const vertexBytes = Buffer.from(Float32Array.from(positions).buffer);
  const deltaBytes = Buffer.from(deltas.buffer);
  const payload = gzipSync(Buffer.concat([header, vertexBytes, deltaBytes]), { level: 9 });

  // A classic script also loads when index.html is opened directly from disk.
  const script = `document.currentScript.day25Mesh = '${payload.toString('base64')}';\n`;
  await writeFile(resolve(day, 'assets', name + '-mesh.js'), script);
  console.log(`${name}: ${faceCount.toLocaleString('en-US')} faces, ${(Buffer.byteLength(script) / 1e6).toFixed(1)} MB preview`);
}
