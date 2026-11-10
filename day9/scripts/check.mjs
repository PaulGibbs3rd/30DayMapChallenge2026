import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { places, contains, findFeature, density, parseCoordinate } from './app/src/data.ts';
const root=resolve(import.meta.dirname,'..');
const json=async name=>JSON.parse(await readFile(resolve(root,'data',name),'utf8'));
const [tracts,growth,land,sources]=await Promise.all(['tracts.geojson','growth.geojson','agriculture.geojson','sources.json'].map(json));
assert.equal(tracts.features.length,494);
assert.equal(new Set(tracts.features.map(f=>f.properties.geoid)).size,494);
assert.equal(tracts.features.reduce((sum,f)=>sum+f.properties.population,0),2269675);
assert.equal(sources.population,2269675);
for(const f of tracts.features){
  const p=f.properties;
  assert.match(p.geoid,/^53033\d{6}$/);
  assert.equal(p.density,density(p.population,p.land_m2));
}
assert.equal(growth.features.length,11);assert.equal(land.features.length,13);
assert.deepEqual(new Set(growth.features.map(f=>f.properties.UGASIDE)),new Set(['u','r']));
assert.equal(new Set(land.features.map(f=>f.properties.NAME)).size,5);
for(const place of places){
  const tract=findFeature(tracts,place.coordinate), area=findFeature(growth,place.coordinate);
  assert.ok(tract,place.name+' tract coverage');assert.ok(area,place.name+' planning coverage');
  console.log(place.name+': '+tract.properties.geoid+', '+Math.round(tract.properties.density)+' people/mi², growth '+area.properties.UGASIDE);
}
assert.equal(findFeature(tracts,places[0].coordinate).properties.geoid,'53033008200');
assert.equal(findFeature(tracts,places[2].coordinate).properties.geoid,'53033032321');
assert.equal(findFeature(growth,places[0].coordinate).properties.UGASIDE,'u');
assert.equal(findFeature(growth,places[2].coordinate).properties.UGASIDE,'r');
assert.equal(findFeature(growth,places[3].coordinate).properties.UGASIDE,'u');
assert.equal(findFeature(land,places[2].coordinate).properties.NAME,'Sammamish River APD');
assert.equal(findFeature(tracts,[-120,45]),undefined);
assert.equal(density(0,2589988.110336),0);assert.equal(density(5,0),null);assert.equal(density(null,10),null);
assert.equal(parseCoordinate('NaN,47'),null);assert.equal(parseCoordinate('999,47'),null);
assert.deepEqual(parseCoordinate('-122.1,47.6'),[-122.1,47.6]);
const polygon={geometry:{type:'Polygon',coordinates:[[[0,0],[10,0],[10,10],[0,10],[0,0]],[[4,4],[6,4],[6,6],[4,6],[4,4]]]}};
assert.equal(contains(polygon,[2,2]),true);assert.equal(contains(polygon,[5,5]),false);assert.equal(contains(polygon,[12,2]),false);
assert.equal(contains({geometry:{type:'MultiPolygon',coordinates:[polygon.geometry.coordinates,[[[20,20],[21,20],[21,21],[20,21],[20,20]]]]}},[20.5,20.5]),true);
const bytes=gzipSync(Buffer.from(JSON.stringify(tracts)+JSON.stringify(growth)+JSON.stringify(land))).length;
assert.ok(bytes<500000,'Compressed thematic data budget');
console.log('Day 9 checks passed: complete joins, density calculations, guide points, geometry holes, URL inputs, and '+bytes+' compressed data bytes.');
