import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const [script,...args] of [['day1/scripts/check.mjs'],['day2/scripts/check.mjs'],['day3/scripts/check.mjs'],['day8/scripts/timeline.test.mjs'],['day8/scripts/check.mjs'],['scripts/build-pages.mjs'],['scripts/check-pages.mjs'],['day8/scripts/check.mjs','--site']]){
 const result=spawnSync(process.execPath,[resolve(root,script),...args],{cwd:root,stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}

