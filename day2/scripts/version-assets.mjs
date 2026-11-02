// Stamp browser asset URLs with their content hashes before publishing.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const folder = resolve(import.meta.dirname, '..');
const hash = (text) => createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex').slice(0,12);
const navigation = await readFile(resolve(folder,'navigation.js'),'utf8');
const appPath = resolve(folder,'app.js');
const originalApp = await readFile(appPath,'utf8');
const app = originalApp.replace(/from '\.\/navigation\.js(?:\?v=[a-f0-9]+)?'/, "from './navigation.js?v=" + hash(navigation) + "'");
if (app !== originalApp) await writeFile(appPath,app);
const css = await readFile(resolve(folder,'style.css'),'utf8');
const htmlPath = resolve(folder,'index.html');
const originalHtml = await readFile(htmlPath,'utf8');
const html = originalHtml
  .replace(/href="style\.css(?:\?v=[a-f0-9]+)?"/, 'href="style.css?v=' + hash(css) + '"')
  .replace(/src="app\.js(?:\?v=[a-f0-9]+)?"/, 'src="app.js?v=' + hash(app) + '"');
if (html !== originalHtml) await writeFile(htmlPath,html);
console.log('Versioned Day 2 assets: CSS ' + hash(css) + ', app ' + hash(app) + ', navigation ' + hash(navigation) + '.');

