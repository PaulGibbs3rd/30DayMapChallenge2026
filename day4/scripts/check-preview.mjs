import assert from 'node:assert/strict';
const url='http://127.0.0.1:4194/30DayMapChallenge2026/day4/';
const response=await fetch(url);
assert.equal(response.status,200);
const html=await response.text();
assert(html.includes('Warehouse / Country'));
const refs=[...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(m=>new URL(m[1],url));
assert(refs.length>0);
for(const asset of refs) {
 const r=await fetch(asset);
 assert.equal(r.status,200,asset.href);
}
console.log('PASS: exported production page and '+refs.length+' linked JS/CSS assets return HTTP 200.');
