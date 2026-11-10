import './style.css';
import '@arcgis/map-components/components/arcgis-map';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-dialog';
import Map from '@arcgis/core/Map.js';
import Basemap from '@arcgis/core/Basemap.js';
import TileLayer from '@arcgis/core/layers/TileLayer.js';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import Point from '@arcgis/core/geometry/Point.js';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import TextSymbol from '@arcgis/core/symbols/TextSymbol.js';
import ClassBreaksRenderer from '@arcgis/core/renderers/ClassBreaksRenderer.js';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import { places, findFeature, getPlace, parseCoordinate, formatDensity } from './data';
import type { Place, Position, Mode, FeatureCollection } from './data';

type Side = 'a' | 'b';
type Layers = { people: GeoJSONLayer; growth: GeoJSONLayer; boundary: GeoJSONLayer; land: GeoJSONLayer };
interface Panel {
  side: Side; place: Place; element: HTMLArcgisMapElement; ready: boolean; color: string;
  graphics: GraphicsLayer; layers?: Layers; failed?: boolean;
}
const el=(id:string)=>document.getElementById(id)!;
const text=(id:string,value:string)=>{el(id).textContent=value;};
const fmt=new Intl.NumberFormat('en-US');
const params=new URLSearchParams(location.hash.slice(1));
const colors=['#d8d6c7','#c1bb96','#b39560','#b66e39','#793b22'];
const presets:Record<string,[string,string]>={city:['seattle','sammamish'],edge:['ridge','carnation'],towns:['redmond','duvall']};
const parsedScale=Number(params.get('scale'));
let sharedScale=params.has('scale')&&Number.isFinite(parsedScale)&&parsedScale>=4000&&parsedScale<=1000000?parsedScale:40000;
let mode:Mode=['people','growth','land'].includes(params.get('mode')??'')?params.get('mode') as Mode:'people';
let syncing=false, dataReady=false;
let scaleLeader:Panel|null=null;
let tracts:FeatureCollection, growth:FeatureCollection, agriculture:FeatureCollection;
let persistTimer:ReturnType<typeof setTimeout>, toastTimer:ReturnType<typeof setTimeout>;
const handles:{remove:()=>void}[]=[];
const objectUrls:string[]=[];
function customPlace(coordinate:Position):Place {
  return {id:'custom',name:'Map location',coordinate,label:'A point you selected',zoom:13,heading:'Your selected place',
    description:'This point samples the surrounding 2020 Census tract and the county’s mapped planning designations. The figures describe the full tract, including land beyond the map window.'};
}
const panels:Panel[]=(['a','b'] as const).map((side,index)=>{
  const point=parseCoordinate(params.get(side+'point'));
  return {side,place:point?customPlace(point):getPlace(params.get(side),places[index===0?0:2]),
    element:el('map-'+side) as HTMLArcgisMapElement,ready:false,color:side==='a'?'#b74628':'#326aa2',
    graphics:new GraphicsLayer({title:'Selected place and surrounding tract',listMode:'hide'})};
});
const dialog=document.querySelector('calcite-dialog')!;
const compact=matchMedia('(max-width:600px)');
function headerLabels(){
  text('sources-button',compact.matches?'Sources':'Sources & story');
  text('share-button',compact.matches?'':'Share comparison');
  el('share-button').setAttribute('label','Share comparison');
}
headerLabels();compact.addEventListener('change',headerLabels);
function notify(message:string){
  text('toast',message);el('toast').hidden=false;clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{el('toast').hidden=true;},4500);
}
function saveState(){
  const state=new URLSearchParams({mode,a:panels[0].place.id,b:panels[1].place.id,scale:String(Math.round(sharedScale))});
  for(const panel of panels){
    if(panel.place.id==='custom')state.set(panel.side+'point',panel.place.coordinate.map(v=>v.toFixed(6)).join(','));
    if(panel.ready){
      const center=panel.element.view.center;
      state.set(panel.side+'center',[center.longitude!,center.latitude!].map(v=>v.toFixed(6)).join(','));
    }
  }
  history.replaceState(null,'','#'+state.toString());
}
function scheduleSave(){clearTimeout(persistTimer);persistTimer=setTimeout(saveState,180);}
function fillSelect(panel:Panel){
  const select=el('select-'+panel.side) as HTMLSelectElement;
  select.replaceChildren();
  for(const place of places)select.add(new Option(place.name,place.id));
  if(panel.place.id==='custom')select.add(new Option('Map location','custom'));
  select.value=panel.place.id;
}
function renderScale(){
  for(const panel of panels)if(panel.ready){
    const scale=panel.element.view.scale;
    text('scale-'+panel.side,'1 : '+fmt.format(Math.round(scale)));
    el('scale-'+panel.side).dataset.scale=String(scale);
  }
}
function setScale(value:number){
  scaleLeader=null;
  sharedScale=Math.max(4000,Math.min(1000000,value));
  syncing=true;
  for(const panel of panels)if(panel.ready)panel.element.view.scale=sharedScale;
  syncing=false;renderScale();scheduleSave();
}
function renderPanel(panel:Panel){
  const {side,place}=panel;
  fillSelect(panel);text('title-'+side,'Place '+side.toUpperCase()+': '+place.name);
  text('map-name-'+side,place.name.toUpperCase());
  panel.element.setAttribute('aria-label','Place '+side.toUpperCase()+': '+place.name+' interactive map');
  text('description-'+side,place.description);
  if(!dataReady)return;
  const tract=findFeature(tracts,place.coordinate);
  const value=typeof tract?.properties.density==='number'?tract.properties.density:null;
  text('density-'+side,formatDensity(value));el('density-'+side).dataset.value=value===null?'':String(value);
  text('tract-'+side,tract?String(tract.properties.name)+' · '+fmt.format(Number(tract.properties.population))+' residents · '+new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number(tract.properties.land_m2)/2589988.110336)+' mi² of land':'Outside prepared tract coverage');
  const area=findFeature(growth,place.coordinate), district=findFeature(agriculture,place.coordinate);
  text('growth-'+side,area?.properties.UGASIDE==='u'?'Urban growth area':area?.properties.UGASIDE==='r'?'Outside urban growth area':'Outside planning coverage');
  text('land-'+side,district?String(district.properties.NAME):area?'No district at this point':'Outside prepared coverage');
  panel.graphics.removeAll();
  if(tract){
    const rings=tract.geometry.type==='Polygon'?tract.geometry.coordinates as number[][][]:(tract.geometry.coordinates as number[][][][]).flat();
    const geometry={type:'polygon' as const,rings,spatialReference:{wkid:4326}};
    panel.graphics.add(new Graphic({geometry,symbol:new SimpleFillSymbol({style:'none',outline:{color:'#fffdf0',width:3.5}})}));
    panel.graphics.add(new Graphic({geometry,symbol:new SimpleFillSymbol({style:'none',outline:{color:panel.color,width:1.6}})}));
  }
  const geometry=new Point({longitude:place.coordinate[0],latitude:place.coordinate[1]});
  panel.graphics.add(new Graphic({geometry,symbol:new SimpleMarkerSymbol({size:28,color:panel.color,outline:{color:'#fffaf0',width:2}})}));
  panel.graphics.add(new Graphic({geometry,symbol:new TextSymbol({text:side.toUpperCase(),color:'#ffffff',font:{size:11,weight:'bold',family:'Arial'},yoffset:-4})}));
}
function renderComparison(){
  if(!dataReady)return;
  const a=findFeature(tracts,panels[0].place.coordinate),b=findFeature(tracts,panels[1].place.coordinate);
  const da=typeof a?.properties.density==='number'?a.properties.density:null;
  const db=typeof b?.properties.density==='number'?b.properties.density:null;
  el('ratio').classList.remove('text-ratio');
  if(a&&b&&a.properties.geoid===b.properties.geoid){
    text('ratio','Same tract');el('ratio').classList.add('text-ratio');
    text('compare-summary','Both points are in the same Census tract. Their population figures describe the same statistical area, even when the surroundings look different.');
  } else if(da!==null&&db!==null&&da>0&&db>0){
    const ratio=Math.max(da,db)/Math.min(da,db);
    text('ratio',new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(ratio)+'×');
    text('compare-summary',(da>=db?panels[0].place.name:panels[1].place.name)+'’s surrounding tract is '+new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(ratio)+' times as densely populated. Both maps use the same scale; each figure describes its full Census tract.');
  } else{
    text('ratio','—');
    text('compare-summary','A density ratio is unavailable when a point has no tract coverage or a tract has zero population. Missing values are distinct from zero.');
  }
  document.querySelectorAll<HTMLButtonElement>('[data-pair]').forEach(button=>{
    const pair=presets[button.dataset.pair!];
    const active=panels[0].place.id===pair[0]&&panels[1].place.id===pair[1];
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
  scheduleSave();
}
function renderMode(){
  document.querySelectorAll<HTMLButtonElement>('.mode-button').forEach(button=>{
    const active=button.dataset.mode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
  if(mode==='people'){
    text('legend-title','People / mi²');
    el('legend-content').innerHTML='<span class="legend-ramp">'+colors.map(color=>'<i style="background:'+color+'"></i>').join('')+'</span><span class="legend-values">0 / 500 / 2k / 5k / 10k+</span><span class="legend-values"><i class="boundary-key"></i>Growth boundary</span>';
    text('legend-date','2020 Census · tract averages');
  }else if(mode==='growth'){
    text('legend-title','King County growth designations');
    el('legend-content').innerHTML='<span class="legend-key"><i style="background:#b59a72"></i>Urban growth area</span><span class="legend-key"><i style="background:#a6b49c"></i>Outside urban growth area</span>';
    text('legend-date','Planning snapshot · not Census urban/rural');
  }else{
    text('legend-title','Agricultural production districts');
    el('legend-content').innerHTML='<span class="legend-key"><i style="background:#e0bc56"></i>Designated agricultural land</span><span class="legend-values"><i class="boundary-key"></i>Growth boundary</span>';
    text('legend-date','Planning designation · not active-farm inventory');
  }
  for(const panel of panels){
    const layers=panel.layers;if(!layers)continue;
    layers.people.visible=mode==='people';layers.growth.visible=mode==='growth';
    layers.land.visible=mode==='land';layers.boundary.opacity=mode==='growth'?.9:.65;
  }
  if(dataReady)scheduleSave();
}
async function recenter(panel:Panel,center:Position=panel.place.coordinate){
  if(!panel.ready)return;
  // Changing a place moves only this center. Keep programmatic changes out of
  // the user-driven scale synchronization, including latitude adjustments.
  const scale=sharedScale;
  syncing=true;
  panel.element.center=new Point({longitude:center[0],latitude:center[1]});
  panel.element.scale=scale;
  syncing=false;renderScale();scheduleSave();
}
function choose(panel:Panel,place:Place){
  panel.place=place;renderPanel(panel);renderComparison();void recenter(panel);
}
for(const panel of panels){
  fillSelect(panel);
  (el('select-'+panel.side) as HTMLSelectElement).addEventListener('change',event=>{
    choose(panel,getPlace((event.target as HTMLSelectElement).value,panel.place));
  });
  renderPanel(panel);
  panel.element.addEventListener('arcgisViewClick',event=>{
    if(!dataReady)return;
    const point=event.detail.mapPoint;if(!point)return;
    panel.place=customPlace([point.longitude!,point.latitude!]);renderPanel(panel);renderComparison();
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-pair]').forEach(button=>button.addEventListener('click',()=>{
  const pair=presets[button.dataset.pair!];panels.forEach((panel,index)=>choose(panel,getPlace(pair[index],panel.place)));
}));
document.querySelectorAll<HTMLButtonElement>('.mode-button').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode as Mode;renderMode();}));
document.querySelectorAll<HTMLButtonElement>('.recenter').forEach(button=>button.addEventListener('click',()=>void recenter(panels[button.dataset.side==='a'?0:1])));
el('zoom-in').addEventListener('click',()=>setScale(sharedScale/1.6));
el('zoom-out').addEventListener('click',()=>setScale(sharedScale*1.6));
el('reset-view').addEventListener('click',()=>{for(const panel of panels)void recenter(panel);});
el('swap').addEventListener('click',()=>{
  const a=panels[0].place,b=panels[1].place;choose(panels[0],b);choose(panels[1],a);
});
el('sources-button').addEventListener('click',()=>{dialog.open=true;});
el('close-sources').addEventListener('click',()=>{dialog.open=false;});
dialog.addEventListener('calciteDialogClose',()=>{void(el('sources-button') as HTMLCalciteButtonElement).setFocus();});
el('share-button').addEventListener('click',async()=>{
  saveState();
  try{await navigator.clipboard.writeText(location.href);notify('Comparison link copied, including places, lens, and map scale.');}
  catch{notify('Your comparison is in the address bar. Copy its URL to share it.');}
});
for(const id of ['zoom-in','zoom-out','reset-view']) (el(id) as HTMLButtonElement).disabled=true;
renderMode();
async function json(url:URL):Promise<FeatureCollection>{
  const response=await fetch(url);if(!response.ok)throw new Error('Local geography unavailable: '+response.status);return response.json();
}
function blobUrl(data:FeatureCollection){
  const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));objectUrls.push(url);return url;
}
function createLayers(urls:{tracts:string;growth:string;land:string}):Layers{
  const fill=(color:string)=>new SimpleFillSymbol({color,outline:{color:[0,0,0,0],width:0}});
  return {
    people:new GeoJSONLayer({url:urls.tracts,title:'People per square mile · 2020',copyright:'King County GIS Center; U.S. Census Bureau',popupEnabled:false,opacity:.65,
      renderer:new ClassBreaksRenderer({field:'density',defaultSymbol:fill('#a4a59a'),classBreakInfos:[
        {minValue:0,maxValue:500,symbol:fill(colors[0])},{minValue:500,maxValue:2000,symbol:fill(colors[1])},
        {minValue:2000,maxValue:5000,symbol:fill(colors[2])},{minValue:5000,maxValue:10000,symbol:fill(colors[3])},{minValue:10000,maxValue:1e9,symbol:fill(colors[4])}]})}),
    growth:new GeoJSONLayer({url:urls.growth,title:'County growth designations',copyright:'King County GIS Center',popupEnabled:false,opacity:.62,
      renderer:new UniqueValueRenderer({field:'UGASIDE',defaultSymbol:fill('#a4a59a'),uniqueValueInfos:[{value:'u',symbol:fill('#b59a72')},{value:'r',symbol:fill('#a6b49c')}]})}),
    boundary:new GeoJSONLayer({url:urls.growth,title:'Urban growth boundary',copyright:'King County GIS Center',definitionExpression:"UGASIDE = 'u'",popupEnabled:false,
      renderer:{type:'simple',symbol:new SimpleFillSymbol({style:'none',outline:{color:'#95482e',width:1.3,style:'short-dash'}})}}),
    land:new GeoJSONLayer({url:urls.land,title:'Agricultural Production Districts',copyright:'King County GIS Center',popupEnabled:false,
      renderer:{type:'simple',symbol:new SimpleFillSymbol({color:[224,188,86,.7],outline:{color:'#9b7427',width:1.2}})}})
  };
}
async function setupMap(panel:Panel,urls:{tracts:string;growth:string;land:string}){
  const initialPlace=panel.place;
  const layers=createLayers(urls);panel.layers=layers;
  const base=new TileLayer({url:'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer',title:'Esri Light Gray Base'});
  const reference=new TileLayer({url:'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Reference/MapServer',title:'Esri place names'});
  panel.element.map=new Map({basemap:new Basemap({baseLayers:[base],referenceLayers:[reference]}),layers:[layers.growth,layers.people,layers.land,layers.boundary,panel.graphics]});
  panel.element.center=new Point({longitude:panel.place.coordinate[0],latitude:panel.place.coordinate[1]});panel.element.scale=sharedScale;
  renderMode();
  await panel.element.viewOnReady();
  panel.element.view.constraints={minScale:1000000,maxScale:4000,snapToZoom:false,rotationEnabled:false};
  panel.element.view.popupEnabled=false;panel.ready=true;
  const center=panel.place===initialPlace?(parseCoordinate(params.get(panel.side+'center'))??panel.place.coordinate):panel.place.coordinate;
  await panel.element.goTo({center,scale:sharedScale},{animate:false});
  for(const eventName of ['pointer-down','mouse-wheel','key-down'] as const)
    handles.push(panel.element.view.on(eventName,()=>{scaleLeader=panel;}));
  handles.push(reactiveUtils.watch(()=>panel.element.view.scale,value=>{
    renderScale();
    if(syncing||scaleLeader!==panel||!Number.isFinite(value))return;
    sharedScale=value;syncing=true;
    for(const other of panels)if(other!==panel&&other.ready&&Math.abs(other.element.view.scale-value)>0.1)other.element.view.scale=value;
    syncing=false;renderScale();scheduleSave();
  },{sync:true}));
  handles.push(reactiveUtils.watch(()=>panel.element.view.stationary,stationary=>{if(stationary)scheduleSave();}));
  await Promise.all(Object.values(layers).map(layer=>layer.load()));
  renderScale();
  base.load().catch(()=>{text('scale-'+panel.side,'Background unavailable');});
}
async function init(){
  [tracts,growth,agriculture]=await Promise.all([
    json(new URL('../../../data/tracts.geojson',import.meta.url)),
    json(new URL('../../../data/growth.geojson',import.meta.url)),
    json(new URL('../../../data/agriculture.geojson',import.meta.url))]);
  dataReady=true;panels.forEach(renderPanel);renderComparison();
  const urls={tracts:blobUrl(tracts),growth:blobUrl(growth),land:blobUrl(agriculture)};
  const results=await Promise.allSettled(panels.map(panel=>setupMap(panel,urls)));
  results.forEach((result,index)=>{if(result.status==='rejected'){panels[index].failed=true;console.error(result.reason);text('scale-'+panels[index].side,'Map could not load');}});
  const count=panels.filter(panel=>panel.ready&&!panel.failed).length;
  if(count){
    setScale(sharedScale);
    for(const id of ['zoom-in','zoom-out','reset-view'])(el(id) as HTMLButtonElement).disabled=false;
  }
  text('map-status',count===2?'Two maps · linked scale · 494 bundled Census tracts · independent panning':count===1?'One map could not load. Both place comparisons remain available.':'Maps could not load. Local place comparisons remain available.');
}
init().catch(error=>{
  console.error(error);text('map-status','Local data could not load. Please reload to retry.');notify('The comparison data could not load. Please reload the page.');
});
window.addEventListener('pagehide',event=>{if(!event.persisted){handles.forEach(handle=>handle.remove());objectUrls.forEach(url=>URL.revokeObjectURL(url));}});


