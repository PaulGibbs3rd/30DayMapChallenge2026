import {cp, mkdir, readFile, writeFile, lstat, rm} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
const day=resolve(import.meta.dirname,'..');
const dist=resolve(import.meta.dirname,'app/dist');
const html=await readFile(resolve(dist,'index.html'),'utf8');
for(const folder of ['assets','calcite']){
 const target=resolve(day,folder);
 if(dirname(target)!==day)throw new Error('Output escaped Day 5.');
 const info=await lstat(target).catch(()=>null);
 if(info?.isSymbolicLink())throw new Error('Refusing to replace a symbolic link.');
 // These directories contain only generated runtime files.
 if(info)await rm(target,{recursive:true,force:true});
 await mkdir(target,{recursive:true});
 await cp(resolve(dist,folder),target,{recursive:true});
}
await writeFile(resolve(day,'index.html'),html);
console.log('Exported Seattle Sightlines to day5/.');
