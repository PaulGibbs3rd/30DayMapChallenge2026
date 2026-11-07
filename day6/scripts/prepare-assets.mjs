import {mkdir,cp,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const app=resolve(import.meta.dirname,'app');
const source=resolve(app,'node_modules/@esri/calcite-components/dist/cdn/assets');
const target=resolve(app,'public/calcite/assets');
const icons=['information','extent','plus','minus','zoomToObject','chevronLeft','chevronRight','chevronsLeft','chevronsRight','reset','x','check','ellipsis','exclamationMarkTriangle'];
await mkdir(resolve(target,'icon'),{recursive:true});
for(const file of await readdir(resolve(source,'icon'))){
 if(icons.some(name=>new RegExp('^'+name+'(16|24|32)(F)?\\.json$').test(file)))
  await cp(resolve(source,'icon',file),resolve(target,'icon',file));
}
for(const component of ['action','button','dialog','panel','popover','scrim']){
 const folder=resolve(target,component,'t9n');
 await mkdir(folder,{recursive:true});
 await cp(resolve(source,component,'t9n/messages.en.json'),resolve(folder,'messages.en.json'));
}
console.log('Prepared local English Calcite messages and console icons.');
