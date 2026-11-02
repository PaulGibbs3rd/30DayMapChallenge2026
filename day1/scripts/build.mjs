import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
await mkdir(resolve(root,'dist'),{recursive:true});
for (const file of ['index.html','style.css','collage.css','js','data','assets','research','readme.md']) await cp(resolve(root,file),resolve(root,'dist',file),{recursive:true});
console.log('Built static tour atlas in dist/');

