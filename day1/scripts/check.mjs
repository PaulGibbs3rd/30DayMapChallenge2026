import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getTrackVideo,getSpotifyTrack} from '../js/player.js';
const root=resolve(import.meta.dirname,'..');
const json=async p=>JSON.parse(await readFile(resolve(root,p),'utf8'));
const tour=await json('data/tour.geojson'),setlists=await json('data/setlists.json');
assert.equal(tour.features.length,23);
assert.equal(setlists.shows.length,23);
const ids=new Set(),dates=new Set(),songs=new Set();
for(const [index,f] of tour.features.entries()){
 assert.equal(f.type,'Feature');assert.equal(f.geometry.type,'Point');
 assert.equal(f.properties.stop,index+1);assert(!ids.has(f.properties.id));ids.add(f.properties.id);
 assert(!dates.has(f.properties.date));dates.add(f.properties.date);
 const [lng,lat]=f.geometry.coordinates;assert(lng>=-130&&lng<=-65&&lat>=24&&lat<=50);
 const show=setlists.shows.find(s=>s.date===f.properties.date);assert(show);
 assert(show.songs.length>0);assert.equal(show.songs.length,show.songCount);
 assert(new URL(show.sourceUrl).hostname==='www.setlist.fm');
 if(show.encoreStartsAt!==null)assert(show.encoreStartsAt>=1&&show.encoreStartsAt<=show.songs.length);
 show.songs.forEach(s=>songs.add(s));
}
const playable=[...songs].filter(s=>getTrackVideo(s));
assert(playable.length>=60);
const spotify=[...songs].filter(s=>getSpotifyTrack(s));
assert(spotify.length===66);
for(const song of spotify) assert(/^[A-Za-z0-9]{22}$/.test(getSpotifyTrack(song).trackId));
for(const p of ['data/countries.geojson','data/states.geojson']){
 const data=await json(p);assert.equal(data.type,'FeatureCollection');assert(data.features.length>0);
}
console.log('PASS: 23 unique chronological venue points, 23 sourced setlists, '+songs.size+' distinct titles, '+spotify.length+' Spotify and '+playable.length+' YouTube mappings, local background GeoJSON.');

