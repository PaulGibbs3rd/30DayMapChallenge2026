import './style.css';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import '@arcgis/map-components/components/arcgis-home';
import '@arcgis/map-components/components/arcgis-popup';
import '@arcgis/map-components/components/arcgis-legend';
import '@esri/calcite-components/components/calcite-shell';
import Map from '@arcgis/core/Map.js';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer.js';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import SizeVariable from '@arcgis/core/renderers/visualVariables/SizeVariable.js';
const view = document.querySelector('arcgis-map')!;
const status = document.querySelector<HTMLElement>('#status')!;
const feed = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';
view.map = new Map({basemap:'gray-vector'});
type EventFeature = {type:'Feature'; id:string; geometry:{type:'Point';coordinates:number[]};properties:{mag:number|null;place:string;time:number;url:string;type:string;[key:string]:unknown}};
async function load(){
 try{
  const response=await fetch(feed,{signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw new Error('USGS returned '+response.status);
  const source=await response.json() as {metadata:{generated:number};features:EventFeature[]};
  const events=source.features.filter(f=>f.properties.type==='earthquake' && typeof f.properties.mag==='number' && f.properties.mag>=2.5);
  // USGS third coordinate is depth in km, not map elevation.
  const features=events.map(f=>({...f,geometry:{...f.geometry,coordinates:f.geometry.coordinates.slice(0,2)},properties:{...f.properties,depth_km:f.geometry.coordinates[2],event_utc:new Date(f.properties.time).toISOString().slice(0,19).replace('T',' ')+' UTC'}}));
  const blob=URL.createObjectURL(new Blob([JSON.stringify({type:'FeatureCollection',features})],{type:'application/geo+json'}));
  const layer=new GeoJSONLayer({url:blob,title:'Earthquake magnitude',copyright:'USGS Earthquake Hazards Program',
   fields:[{name:'mag',alias:'Magnitude',type:'double'},{name:'place',alias:'Reported location',type:'string'},{name:'event_utc',alias:'Event time (UTC)',type:'string'},{name:'depth_km',alias:'Depth (km)',type:'double'},{name:'url',alias:'USGS event page',type:'string'}],
   renderer:new SimpleRenderer({symbol:new SimpleMarkerSymbol({color:[227,88,39,0.72],outline:{color:[171,53,17,0.9],width:0.7}}),visualVariables:[new SizeVariable({field:'mag',legendOptions:{title:'Magnitude'},stops:[{value:2.5,size:5},{value:5,size:17},{value:7,size:31}]})]}),
   popupTemplate:{title:'M{mag} · {place}',content:[{type:'fields',fieldInfos:[{fieldName:'event_utc',label:'Event time (UTC)'},{fieldName:'depth_km',label:'Depth (km)',format:{places:1,digitSeparator:true}}]},{type:'text',text:'<a href="{url}" target="_blank" rel="noopener noreferrer">View this event at USGS ↗</a>'}]}
  });
  await view.viewOnReady();
  view.map!.add(layer);
  await layer.load();
  document.querySelector('#count')!.textContent=events.length.toLocaleString();
  document.querySelector('#largest')!.textContent=events.length?'M'+Math.max(...events.map(f=>f.properties.mag!)).toFixed(1):'—';
  document.querySelector('#generated')!.textContent=new Date(source.metadata.generated).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
  status.textContent=events.length?'Data loaded · click a circle to explore':'No matching earthquakes in this feed.';
  status.classList.add('loaded');
 }catch(error){console.error(error);status.textContent='Earthquake data could not load. Reload this page to try again, or open the USGS source below.';status.classList.add('error');}
}
void load();

