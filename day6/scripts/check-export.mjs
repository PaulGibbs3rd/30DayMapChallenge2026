import assert from 'node:assert/strict';
import {readFile,readdir,lstat,cp} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const site=resolve(root,'_site');
const day=resolve(site,'day6');
const files=[];
async function walk(folder){
 for(const name of await readdir(folder)){
  const path=resolve(folder,name),info=await lstat(path);
  assert(!info.isSymbolicLink(),'No symlinks in the exported application.');
  if(info.isDirectory())await walk(path);else files.push(path);
 }
}
await walk(day);
let references=0;
async function reference(source,value){
 const url=value.replaceAll('&amp;','&').trim();
 if(!url||url.startsWith('#')||url.startsWith('//')||/^[a-z][a-z0-9+.-]*:/i.test(url))return;
 const pathname=decodeURIComponent(url.split(/[?#]/)[0]);
 if(!pathname)return;
 assert(!pathname.startsWith('/'),'Exported URLs must be relative: '+url);
 const target=resolve(dirname(source),pathname);
 assert(target.startsWith(site+sep),'Exported reference escaped the collection: '+url);
 const info=await lstat(target).catch(()=>null);
 assert(info,'Missing export asset: '+source+' -> '+url);
 if(info.isDirectory())assert((await lstat(resolve(target,'index.html'))).isFile());
 references++;
}
for(const file of files){
 const extension=extname(file);
 if(!['.html','.css','.js','.md'].includes(extension))continue;
 const content=await readFile(file,'utf8');
 if(extension==='.html')for(const m of content.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi))await reference(file,m[1]);
 if(extension==='.css')for(const m of content.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi))await reference(file,m[1]??m[2]??m[3]);
 if(extension==='.js'){
  for(const m of content.matchAll(/\b(?:from\s*|import\s*\()\s*["']([^"']+)["']/g))if(m[1].startsWith('.'))await reference(file,m[1]);
  for(const m of content.matchAll(/new URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g))await reference(file,m[1]);
 }
 if(extension==='.md'){
  const prose=content.replace(/```[\s\S]*?```/g,'').replace(/`[^`]*`/g,'');
  for(const m of prose.matchAll(/!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\s*\)/g))await reference(file,m[1]??m[2]);
 }
}
const metadata=JSON.parse(await readFile(resolve(site,'directory/days.json'),'utf8'));
const entry=metadata.days.find(d=>d.day===6);
assert.equal(entry.title,'Neon Japan');
assert.equal(entry.status,'complete');
await reference(resolve(site,'directory/index.html'),entry.image);
const png=await readFile(resolve(day,'data/japan-16bit.png'));
assert.equal(png.readUInt32BE(16),3072);
assert.equal(png.readUInt32BE(20),3072);
const geo=JSON.parse(await readFile(resolve(day,'data/terrain.json'),'utf8'));
assert.equal(geo.extent.spatialReference.wkid,3857);
assert.deepEqual(geo.pixelGrid,[768,768]);
for(const p of ['assets/icon/extent16.json','assets/icon/zoomToObject16.json','assets/button/t9n/messages.en.json','assets/dialog/t9n/messages.en.json'])
 assert((await lstat(resolve(day,'calcite',p))).isFile(),'Required local Calcite resource: '+p);
console.log('PASS: Day 6 export, '+references+' local references, relative hosting paths, 3072px terrain georeference, Calcite resources, and directory metadata.');
