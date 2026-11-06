import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
const day=resolve(import.meta.dirname,'..'), root=resolve(day,'..');
let checks=0;
async function verify(source,value){
 if(!value||value.startsWith('#')||/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value))return;
 const target=resolve(dirname(source),decodeURIComponent(value.split(/[?#]/)[0]));
 assert(target.startsWith(root+sep),'Reference outside collection: '+value);
 const info=await stat(target).catch(()=>null);assert(info,'Missing asset: '+value+' in '+source);
 if(info.isDirectory())assert((await stat(resolve(target,'index.html'))).isFile());checks++;
}
async function walk(dir){for(const name of await readdir(dir)){if(name==='scripts')continue;const file=resolve(dir,name),info=await stat(file);if(info.isDirectory()){await walk(file);continue;}const ext=extname(file);if(!['.html','.css','.js'].includes(ext))continue;const content=await readFile(file,'utf8');if(ext==='.html')for(const m of content.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi))await verify(file,m[1]);if(ext==='.css')for(const m of content.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi))await verify(file,m[1]??m[2]??m[3]);if(ext==='.js')for(const m of content.matchAll(/\b(?:from\s*|import\s*\()\s*["']([^"']+)["']/g))if(m[1].startsWith('.'))await verify(file,m[1]);}}
await walk(day);
const manifest=JSON.parse(await readFile(resolve(root,'directory/days.json'),'utf8'));
assert.equal(manifest.days.find(d=>d.day===5).title,'Seattle Sightlines');
console.log('PASS: Day 5 metadata and '+checks+' exported HTML, CSS, and module references.');
