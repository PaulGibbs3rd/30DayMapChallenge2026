import './style.css';
import '@arcgis/map-components/components/arcgis-map';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-dialog';
import '@esri/calcite-components/components/calcite-label';
import '@esri/calcite-components/components/calcite-switch';
import {setAssetPath} from '@esri/calcite-components';
import Map from '@arcgis/core/Map.js';
import Basemap from '@arcgis/core/Basemap.js';
import MediaLayer from '@arcgis/core/layers/MediaLayer.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import ImageElement from '@arcgis/core/layers/support/ImageElement.js';
import ExtentAndRotationGeoreference from '@arcgis/core/layers/support/ExtentAndRotationGeoreference.js';
import Extent from '@arcgis/core/geometry/Extent.js';
import Point from '@arcgis/core/geometry/Point.js';
import Polyline from '@arcgis/core/geometry/Polyline.js';
import Graphic from '@arcgis/core/Graphic.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
import TextSymbol from '@arcgis/core/symbols/TextSymbol.js';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol.js';
import Color from '@arcgis/core/Color.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import terrainMeta from './terrain.json';
import {LEVELS} from './levels';
import {drawScene} from './pixel-art';

setAssetPath(new URL('./calcite/',document.baseURI).href);
const map=document.querySelector('arcgis-map')!;
const guide=document.querySelector('calcite-dialog')!;
const crt=document.querySelector('calcite-switch')!;
const el=(id:string)=>document.getElementById(id)!;
const btn=(id:string)=>el(id) as HTMLCalciteButtonElement;
const text=(id:string,value:string)=>{el(id).textContent=value;};
const pad=(n:number)=>String(n).padStart(2,'0');
const storeKey='neon-japan-expedition-v1';
const visited=new Set<string>();
let selected=0,ready=false,overview=true,navigationGeneration=0;
try{
 const stored:unknown=JSON.parse(localStorage.getItem(storeKey)||'[]');
 if(Array.isArray(stored))for(const id of stored)if(LEVELS.some(l=>l.id===id))visited.add(id);
}catch{/* Exploration works without browser storage. */}
visited.add(LEVELS[0].id);
el('levels').innerHTML=LEVELS.map((level,i)=>'<calcite-button class="level" data-level="'+i+'" appearance="transparent" aria-label="Level '+(i+1)+': '+level.name+'"><span class="level-no">'+pad(i+1)+'</span><span class="level-name">'+level.name.toUpperCase()+'</span><span class="level-state" aria-hidden="true">◇</span></calcite-button>').join('');

const terrain=new MediaLayer({
 title:'Japan · 16-bit open elevation terrain',
 copyright:'Natural Earth · Mapzen / Tilezen · USGS · NOAA',
 source:[new ImageElement({image:new URL('./data/japan-16bit.png',document.baseURI).href,georeference:new ExtentAndRotationGeoreference({extent:new Extent(terrainMeta.extent)})})]
});
const grid=new GraphicsLayer({title:'Scanner graticule',listMode:'hide'});
const route=new GraphicsLayer({title:'Schematic expedition connections',listMode:'hide'});
const beacons=new GraphicsLayer({title:'Eight expedition locations',listMode:'hide'});
const regionLabels=new GraphicsLayer({title:'Regional labels',listMode:'hide'});
map.map=new Map({basemap:new Basemap({baseLayers:[terrain],title:'Neon Japan pixel terrain'}),layers:[grid,regionLabels,route,beacons]});
map.center=[137,36];
map.zoom=5;
const fullExtent=new Extent({xmin:125.4,ymin:25.3,xmax:146.1,ymax:45.8,spatialReference:{wkid:4326}});
const point=(lon:number,lat:number)=>new Point({longitude:lon,latitude:lat});
const line=(coords:number[][],color:string,width:number,style:'dash'|'solid'='dash')=>new Graphic({geometry:new Polyline({paths:[coords],spatialReference:{wkid:4326}}),symbol:new SimpleLineSymbol({color,width,style})});
for(let lon=120;lon<=150;lon+=5)grid.add(line([[lon,22],[lon,49]],'#244350',.5));
for(let lat=25;lat<=45;lat+=5)grid.add(line([[118,lat],[152,lat]],'#244350',.5));
for(const label of [{name:'SEA OF JAPAN',lon:133,lat:40},{name:'NORTH PACIFIC OCEAN',lon:144,lat:31},{name:'HOKKAIDO',lon:144,lat:44.5},{name:'HONSHU',lon:137,lat:37.7},{name:'KYUSHU',lon:129.4,lat:33.2}]){
 regionLabels.add(new Graphic({geometry:point(label.lon,label.lat),symbol:new TextSymbol({text:label.name,color:label.name.includes(' ')?'#6a7f91':'#a0c3b1',haloColor:'#090e1f',haloSize:1,font:{family:'monospace',size:8,weight:'normal'}})}));
}
function renderMap(){
 beacons.removeAll();route.removeAll();
 LEVELS.forEach((level,i)=>{
  const active=i===selected,seen=visited.has(level.id),color=active?'#f7c780':seen?'#6af0ce':'#f081b5';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" shape-rendering="crispEdges"><path d="M4 12V4H12M28 4H36V12M36 28V36H28M12 36H4V28" fill="none" stroke="'+color+'" stroke-width="2"/><rect x="10" y="10" width="20" height="20" fill="#0b1427" stroke="'+color+'" stroke-width="2"/><text x="20" y="25" fill="'+color+'" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="14">'+pad(i+1)+'</text></svg>';
  beacons.add(new Graphic({geometry:point(level.lon,level.lat),attributes:{level:i},symbol:new PictureMarkerSymbol({url:'data:image/svg+xml,'+encodeURIComponent(svg),width:active?31:24,height:active?31:24})}));
  const left=level.id==='fuji'||level.id==='kyoto';
  beacons.add(new Graphic({geometry:point(level.lon,level.lat),attributes:{level:i},symbol:new TextSymbol({text:level.name.toUpperCase(),color,haloColor:'#090e1f',haloSize:1.8,xoffset:left?-22:22,yoffset:level.id==='fuji'?-9:6,horizontalAlignment:left?'right':'left',font:{family:'monospace',size:active?10:8,weight:'bold'}})}));
  if(i>0){const prev=LEVELS[i-1];route.add(line([[prev.lon,prev.lat],[level.lon,level.lat]],visited.has(prev.id)&&seen?'#57bba9':'#845674',1));}
 });
}
function render(){
 const l=LEVELS[selected];
 text('level-number',pad(selected+1));text('biome',l.biome.toUpperCase());
 text('region',l.region.toUpperCase());text('mission-title',l.name.toUpperCase());
 text('japanese-name',l.japanese);text('scene-caption',l.signal.toUpperCase());
 text('mission-subtitle',l.heading);text('mission-description',l.description);
 text('field-note',l.note);text('latitude',l.lat.toFixed(4)+'° N');text('longitude',l.lon.toFixed(4)+'° E');
 (el('place-source') as HTMLAnchorElement).href=l.source;
 text('progress-caption',pad(visited.size)+' / 08 LOCATIONS EXPLORED');
 btn('previous').disabled=selected===0;
 btn('next').textContent=selected===LEVELS.length-1?'REPLAY EXPEDITION':'NEXT LEVEL';
 btn('next').iconEnd=selected===LEVELS.length-1?'reset':'chevron-right';
 text('next-destination',selected===LEVELS.length-1?'SOUTHERN HORIZON REACHED':'UP NEXT: '+LEVELS[selected+1].name.toUpperCase());
 el('complete').hidden=visited.size!==LEVELS.length;
 document.querySelectorAll<HTMLCalciteButtonElement>('.level').forEach((node,i)=>{
  node.setAttribute('aria-current',i===selected?'step':'false');
  const seen=visited.has(LEVELS[i].id);
  node.classList.toggle('visited',seen);
  node.querySelector('.level-state')!.textContent=i===selected?'▶':seen?'◆':'◇';
  node.setAttribute('aria-label','Level '+(i+1)+': '+LEVELS[i].name+(i===selected?', current':seen?', explored':''));
  node.label='Level '+(i+1)+': '+LEVELS[i].name+(i===selected?', current':seen?', explored':'');
 });
 drawScene(el('scene') as HTMLCanvasElement,l,selected);
 renderMap();
 try{localStorage.setItem(storeKey,JSON.stringify([...visited]));}catch{/* Optional persistence. */}
 document.title=l.name+' / Neon Japan — Day 6: Vintage';
}
async function navigate(full:boolean){
 if(!ready)return;
 overview=full;
 const generation=++navigationGeneration;
 const l=LEVELS[selected];
 text('map-mode',full?'JAPAN / OVERWORLD':pad(selected+1)+' / '+l.region.toUpperCase());
 text('map-status','ACQUIRING SECTOR…');
 try{
  await map.goTo(full?fullExtent:{center:[l.lon,l.lat],zoom:l.zoom},{duration:850,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
  if(generation===navigationGeneration)text('map-status',full?'08 BEACONS / STORY LINKS':l.lat.toFixed(2)+' N / '+l.lon.toFixed(2)+' E');
 }catch(error){if((error as Error).name!=='AbortError')text('map-status','SCANNER READY / DRAG TO EXPLORE');}
}
function select(index:number){
 if(index<0||index>=LEVELS.length)return;
 selected=index;visited.add(LEVELS[index].id);render();void navigate(false);
}
btn('next').addEventListener('click',()=>select(selected===7?0:selected+1));
btn('previous').addEventListener('click',()=>select(selected-1));
el('levels').addEventListener('click',event=>{
 const node=(event.target as Element).closest<HTMLCalciteButtonElement>('[data-level]');
 if(node)select(Number(node.dataset.level));
});
btn('overview').addEventListener('click',()=>void navigate(true));
btn('focus').addEventListener('click',()=>void navigate(false));
btn('zoom-in').addEventListener('click',()=>{if(ready)void map.goTo({zoom:Math.min(8,map.zoom+0.7)},{animate:false});});
btn('zoom-out').addEventListener('click',()=>{if(ready)void map.goTo({zoom:Math.max(4,map.zoom-0.7)},{animate:false});});
btn('about').addEventListener('click',()=>{guide.open=true;});
el('credits').addEventListener('click',event=>{event.preventDefault();guide.open=true;});
btn('close-guide').addEventListener('click',()=>{guide.open=false;});
crt.addEventListener('calciteSwitchChange',()=>document.body.classList.toggle('crt-off',!crt.checked));
btn('retry').addEventListener('click',()=>location.reload());
render();

async function init(){
 try{
  await map.viewOnReady();
  map.view.constraints={minZoom:4,maxZoom:8,snapToZoom:false,rotationEnabled:false};
  map.view.background={color:new Color('#090e1f')};
  await terrain.load();
  await map.view.whenLayerView(terrain);
  await reactiveUtils.whenOnce(()=>!map.view.updating);
  ready=true;
  for(const id of ['overview','focus','zoom-in','zoom-out'])btn(id).disabled=false;
  await navigate(overview);
  map.addEventListener('arcgisViewClick',async event=>{
   const hit=await map.hitTest(event.detail,{include:[beacons]});
   const graphic=hit.results.find(result=>result.type==='graphic');
   if(graphic?.type==='graphic')select(Number(graphic.graphic.attributes.level));
  });
  map.addEventListener('arcgisViewPointerMove',async event=>{
   const hit=await map.hitTest(event.detail,{include:[beacons]});
   map.style.cursor=hit.results.length?'pointer':'';
  });
 }catch(error){
  console.error('Neon Japan map initialization failed',error);
  el('map-failure').hidden=false;text('map-status','SCANNER OFFLINE / LEVELS AVAILABLE');
 }
}
void init();
