import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {TRACKS,LOOKS} from '../world.js';
const day=resolve(import.meta.dirname,'..');
const sheet=JSON.parse(await readFile(resolve(day,'audio-cues.json'),'utf8'));
assert.equal(TRACKS.length,19);assert.deepEqual(TRACKS.map(track=>track.number),Array.from({length:19},(_,i)=>i+1));
assert.equal(sheet.chapters.length,7);assert.equal(LOOKS.length,7);
let duration=0,bytes=0,cues=0;
for(const [index,chapter] of sheet.chapters.entries()){
  assert.equal(TRACKS[LOOKS[index].point].number,chapter.trackNumber);
  assert(chapter.sourceIn>=0&&chapter.sourceOut>chapter.sourceIn&&chapter.sourceOut<=chapter.sourceDuration);
  const length=chapter.sourceOut-chapter.sourceIn;duration+=length;
  assert(chapter.cues.every((cue,i)=>Number.isFinite(cue.at)&&cue.at>=0&&cue.at<length&&(!i||cue.at>=chapter.cues[i-1].at)));
  cues+=chapter.cues.length;
  const file=resolve(day,chapter.audio);assert.equal(dirname(file),resolve(day,'audio'));
  const data=await readFile(file);assert.equal(data.toString('ascii',0,3),'ID3');assert(data.length<3_000_000);bytes+=data.length;
  const url=new URL(chapter.audio,'https://example.com/30DayMapChallenge2026/day8/');
  assert(url.pathname.startsWith('/30DayMapChallenge2026/day8/audio/'));
}
const html=await readFile(resolve(day,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(new Set(ids).size,ids.length);
for(const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)){
  const path=match[1];if(!/^(?:\.\/|\.\.\/)/.test(path))continue;
  assert((await stat(resolve(day,path.split(/[?#]/)[0]))).isFile(),`Missing HTML asset: ${path}`);
}
const app=await readFile(resolve(day,'app.js'),'utf8');
for(const match of app.matchAll(/\$\('([^']+)'\)/g))assert(ids.includes(match[1]),`Missing UI element: ${match[1]}`);
assert(!app.includes('/__audio/status'),'Bundled app must not require the private development API.');
if(process.argv.includes('--site')){
  const output=resolve(day,'../_site/day8');
  const expected=['index.html','style.css','app.js','audio-output.js','scene.js','timeline.js','world.js','audio-cues.json','waveforms.json',...sheet.chapters.map(chapter=>chapter.audio)];
  for(const name of expected){const a=await readFile(resolve(day,name)),b=await readFile(resolve(output,name));assert.equal(createHash('sha256').update(a).digest('hex'),createHash('sha256').update(b).digest('hex'),`Packaged file mismatch: ${name}`);}
  const walk=async path=>{for(const item of await readdir(path,{withFileTypes:true})){assert.notEqual(item.name,'scripts');assert(!/\.(?:flac|wav|exe|whl)$/i.test(item.name),`Private working file in export: ${item.name}`);if(item.isDirectory())await walk(resolve(path,item.name));}};
  await walk(output);
}
console.log(`PASS: 19 track locations; 7 bundled MP3s; ${cues} ordered cues; ${duration.toFixed(1)} seconds; ${(bytes/1e6).toFixed(2)} MB; valid UI IDs, assets, and project-subpath audio URLs${process.argv.includes('--site')?'; export matches and excludes private masters/tools':''}.`);
