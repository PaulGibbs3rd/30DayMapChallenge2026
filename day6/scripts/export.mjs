import {cp,mkdir,readFile,writeFile,rm,lstat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const day=resolve(import.meta.dirname,'..');
const dist=resolve(import.meta.dirname,'app/dist');
for(const folder of ['assets','calcite','data','fonts']){
 const target=resolve(day,folder);
 if(dirname(target)!==day)throw new Error('Output escaped Day 6.');
 const info=await lstat(target).catch(()=>null);
 if(info?.isSymbolicLink())throw new Error('Refusing to replace a symbolic link.');
 // Only generated, exported runtime directories are replaced.
 if(info)await rm(target,{recursive:true,force:true});
 await mkdir(target,{recursive:true});
 await cp(resolve(dist,folder),target,{recursive:true});
}
await writeFile(resolve(day,'index.html'),(await readFile(resolve(dist,'index.html'),'utf8')).trimEnd()+'\n');
console.log('Exported Neon Japan runtime to day6/.');
