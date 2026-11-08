import {cp,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const day=resolve(import.meta.dirname,'..');
const dist=resolve(import.meta.dirname,'app/dist');
await mkdir(resolve(day,'assets'),{recursive:true});
await cp(resolve(dist,'assets'),resolve(day,'assets'),{recursive:true});
await writeFile(resolve(day,'index.html'),await readFile(resolve(dist,'index.html'),'utf8'));
console.log('Exported Seven Days of Shaking to day7/.');
