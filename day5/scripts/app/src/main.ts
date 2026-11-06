import "./style.css";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-navigation-toggle";
import "@arcgis/map-components/components/arcgis-compass";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-icon";
import "@esri/calcite-components/components/calcite-button";
import "@esri/calcite-components/components/calcite-input-text";
import "@esri/calcite-components/components/calcite-input-number";
import "@esri/calcite-components/components/calcite-label";
import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";
import "@esri/calcite-components/components/calcite-dialog";
import "@esri/calcite-components/components/calcite-loader";
import {setAssetPath} from "@esri/calcite-components";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D.js";
import Camera from "@arcgis/core/Camera.js";
import Environment from "@arcgis/core/views/3d/environment/Environment.js";
import Map from "@arcgis/core/Map.js";
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";
import Point from "@arcgis/core/geometry/Point.js";
import Multipoint from "@arcgis/core/geometry/Multipoint.js";
import Graphic from "@arcgis/core/Graphic.js";
import LineOfSightAnalysis from "@arcgis/core/analysis/LineOfSightAnalysis.js";
import type LineOfSightAnalysisView3D from "@arcgis/core/views/3d/analysis/LineOfSightAnalysisView3D.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import {LANDMARKS, NEEDLE, distanceBearing, rimPosition} from "./landmarks";
import type {Landmark} from "./landmarks";

setAssetPath(new URL("./calcite/", document.baseURI).href);
const scene = document.querySelector("arcgis-scene")!;
const search = document.querySelector("calcite-input-text")!;
const filter = document.querySelector("calcite-segmented-control")!;
const about = document.querySelector("calcite-dialog")!;
function el(id:string){return document.getElementById(id)!;}
function button(id:string){return document.getElementById(id) as HTMLCalciteButtonElement;}
const statusLabels={pending:"Pending",clear:"Clear",blocked:"Obstructed",error:"Unavailable"};
type Status = keyof typeof statusLabels;
type Entry = {place:Landmark; ground?:number; analysis?:LineOfSightAnalysis; view?:LineOfSightAnalysisView3D; status:Status; removeWatch?:()=>void; point?:Point};
let entries:Entry[]=LANDMARKS.map(place=>({place:{...place},status:"pending"}));
let selected="pike", ready=false, placing=false, customCount=0, generation=0;
let groundNeedle=0;
const initAbort=new AbortController();
const elevation=new ElevationLayer({url:"https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"});
const buildings=new SceneLayer({portalItem:{id:"fd343811bb604dafa58f23a00e5c0fd0"},title:"Seattle buildings · 2015–16",popupEnabled:false,renderer:{type:"simple",symbol:{type:"mesh-3d",symbolLayers:[{type:"fill",material:{color:[181,193,181],colorMixMode:"replace"},edges:new SolidEdges3D({color:[63,82,81,.45],size:.5})}]}}});
const needleModel=new SceneLayer({portalItem:{id:"6f8eb961cbff4554acbde23fa3de0ca0"},title:"Space Needle · City of Seattle model",popupEnabled:false});
const labels=new GraphicsLayer({title:"Landmark labels",elevationInfo:{mode:"absolute-height"},listMode:"hide"});
scene.map=new Map({basemap:"dark-gray-vector",ground:{layers:[elevation]},layers:[buildings,needleModel,labels]});
scene.environment=new Environment({background:{type:"color",color:[25,43,53]},atmosphereEnabled:false,starsEnabled:false,lighting:{type:"virtual"}});
scene.camera=new Camera({position:point(-122.386,47.591,4800),heading:38,tilt:49});

function current(){return entries.find(e=>e.place.id===selected)!;}
function escape(value:string){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
function metric(entry:Entry){return distanceBearing(entry.place.lon,entry.place.lat);}
function statusText(text:string,settled=false){el("status-text").textContent=text;el("map-status").classList.toggle("ready",settled);}
function makeList(){
 el("landmarks").innerHTML=entries.map((entry,i)=>'<button type="button" class="landmark" data-id="'+entry.place.id+'" aria-pressed="false"><span class="place-number">'+String(i+1).padStart(2,'0')+'</span><span class="place-copy"><span class="place-name">'+escape(entry.place.name)+'</span><span class="place-meta">'+escape(entry.place.category)+' · <b>'+ (metric(entry).distance/1000).toFixed(2)+' km</b></span></span><span class="status pending">Pending</span></button>').join('')+'<p id="empty-list" class="empty" hidden>No places match this view. Try another filter or search.</p>';
 updateList();
}
function updateList(){
 const term=search.value.trim().toLowerCase(), mode=filter.value||"all";
 let visible=0;
 document.querySelectorAll<HTMLButtonElement>(".landmark").forEach(row=>{
  const entry=entries.find(e=>e.place.id===row.dataset.id)!;
  row.hidden=!((mode==="all"||entry.status===mode)&&(entry.place.name+' '+entry.place.category).toLowerCase().includes(term));
  if(!row.hidden)visible++;
  row.setAttribute("aria-pressed",String(entry.place.id===selected));
  const badge=row.querySelector(".status")!;badge.className="status "+entry.status;badge.textContent=statusLabels[entry.status];
 });
 el("target-count").textContent=entries.length+" PLACES";
 el("empty-list").hidden=visible>0;
}
function renderDetail(){
 const entry=current(),m=metric(entry),p=entry.place;
 el("detail").innerHTML='<div class="detail-top"><div class="eyebrow">'+escape(p.category)+'<span id="detail-status" class="status"></span></div><h2>'+escape(p.name)+'</h2><p>'+escape(p.description)+'</p></div><div class="detail-metrics"><div class="metric"><span>Distance</span><strong>'+(m.distance/1000).toFixed(2)+' <small>km</small></strong></div><div class="metric"><span>Bearing</span><strong>'+Math.round(m.bearing)+'<small>°</small></strong></div><div class="metric"><span>Target height</span><strong id="target-height-label">'+p.height+' <small>m AGL</small></strong></div></div><div class="height-control"><calcite-label>Sample height above terrain (m)<calcite-input-number id="target-height" min="1" max="300" step="1" value="'+p.height+'" scale="s" aria-label="Target height above terrain in meters"></calcite-input-number></calcite-label></div><div class="detail-actions"><calcite-button id="focus-target" scale="s" appearance="outline" icon-start="zoom-to-object" '+(!ready?'disabled':'')+'>Inspect sightline</calcite-button>'+(p.custom?'<calcite-button id="remove-target" scale="s" appearance="transparent" kind="danger" icon-start="trash">Remove</calcite-button>':'')+'</div>';
 button("focus-target").addEventListener("click",()=>void focusTarget());
 el("target-height").addEventListener("calciteInputNumberChange",event=>{
  const input=event.target as HTMLCalciteInputNumberElement;
  const height=Number(input.value);
  if(!Number.isFinite(height)||height<1||height>300){input.value=String(entry.place.height);return;}
  entry.place.height=height;
  el("target-height-label").innerHTML=height+' <small>m AGL</small>';
  if(entry.analysis&&entry.ground!==undefined){const position=point(entry.place.lon,entry.place.lat,entry.ground+height);entry.analysis.targets.at(0)!.position=position;entry.point=position;entry.status="pending";refreshLabels();updateResults();}
 });
 if(p.custom)button("remove-target").addEventListener("click",()=>{dispose(entry);entries=entries.filter(e=>e!==entry);selected="pike";makeList();renderDetail();refreshLabels();updateResults();});
 paintDetail();
}
function paintDetail(){const e=current(),badge=el("detail-status");badge.className="status "+e.status;badge.textContent=statusLabels[e.status];}
function select(id:string){selected=id;updateList();renderDetail();refreshLabels();if(ready&&metric(current()).distance>8000)void focusTarget();}
function point(lon:number,lat:number,z=0){return new Point({longitude:lon,latitude:lat,z,spatialReference:{wkid:4326}});}
function refreshLabels(){
 labels.removeAll();
 if(!ready)return;
 labels.add(new Graphic({geometry:point(NEEDLE.lon,NEEDLE.lat,groundNeedle+160),symbol:{type:"text",text:"SPACE NEEDLE",color:"#d8f8a5",haloColor:"#14212a",haloSize:2,yoffset:18,font:{size:11,weight:"bold"}}}));
 entries.forEach(e=>{if(e.point)labels.add(new Graphic({geometry:e.point,attributes:{placeId:e.place.id},symbol:{type:"text",text:e.place.id===selected?e.place.name:String(entries.indexOf(e)+1).padStart(2,"0"),color:e.place.id===selected?"#e6ffb0":"#edf1ec",haloColor:"#14212a",haloSize:2,yoffset:14,font:{size:e.place.id===selected?11:9,weight:"bold"}}}));});
}
function updateResults(){
 if(!ready)return;
 const unsettled=scene.updating||!scene.stationary;
 entries.forEach(e=>{
  if(e.status==="error")return;
  const result=e.view?.results.at(0);
  e.status=unsettled||!result?"pending":result.visible?"clear":"blocked";
 });
 updateList();paintDetail();
 const clear=entries.filter(e=>e.status==="clear").length,blocked=entries.filter(e=>e.status==="blocked").length,pending=entries.length-clear-blocked;
 el("summary").textContent=clear+' clear · '+blocked+' obstructed'+(pending?' · '+pending+' pending':'')+' / '+entries.length+' targets';
 button("export").disabled=clear+blocked===0;
 statusText(unsettled?"Updating terrain and building visibility…":pending?"Some targets are outside this view. Select a distant place or inspect its sightline.":"Sightlines resolved · explore a place below",!unsettled);
}
let updateTimer=0;
function schedule(){clearTimeout(updateTimer);updateTimer=window.setTimeout(updateResults,180);}
async function analyze(entry:Entry){
 const rim=rimPosition(metric(entry).bearing);
 entry.point=point(entry.place.lon,entry.place.lat,entry.ground!+entry.place.height);
 entry.analysis=new LineOfSightAnalysis({observer:{position:point(rim.lon,rim.lat,groundNeedle+158.496+1.5)},targets:[{position:entry.point}]});
 scene.analyses.add(entry.analysis);
 entry.view=await scene.whenAnalysisView(entry.analysis) as LineOfSightAnalysisView3D;
 const watch=reactiveUtils.watch(()=>entry.view!.results.map(r=>r?[r.visible,r.intersectedLocation]:null),schedule,{initial:true});entry.removeWatch=()=>watch.remove();
}
function dispose(entry:Entry){entry.removeWatch?.();if(entry.analysis){scene.analyses.remove(entry.analysis);entry.analysis.destroy();}}
async function navigate(target:Parameters<typeof scene.goTo>[0]){try{await scene.goTo(target,{animate:!matchMedia('(prefers-reduced-motion: reduce)').matches,duration:1100});}catch(error){if((error as Error).name!=="AbortError")statusText("Navigation interrupted. Use the map to continue.",true);}}
async function overview(){if(ready)await navigate({target:point(-122.344,47.622),zoom:14.1,heading:30,tilt:53});}
async function focusTarget(){const entry=current();if(!ready||!entry.analysis?.observer?.position||!entry.point)return;const m=metric(entry),target=[entry.analysis!.observer!.position!,entry.point!];if(m.distance>8000){await navigate({target,tilt:45,heading:m.bearing});}else{await navigate({target,tilt:65,heading:m.bearing,scale:Math.max(m.distance*5,2600)});}}
async function deckView(){const entry=current();if(!ready||!entry.analysis?.observer?.position||!entry.point)return;const origin=entry.analysis!.observer!.position!;await navigate(new Camera({position:origin,heading:metric(entry).bearing,tilt:90-Math.atan2(origin.z!-entry.point!.z!,metric(entry).distance)*180/Math.PI}));}
function setPlacing(value:boolean){placing=value;el("placement").hidden=!value;scene.style.cursor=value?"crosshair":"";button("add-target").textContent=value?"Choose a point…":"Add a test point";}
function fail(message:string){ready=false;initAbort.abort();el("failure").hidden=false;el("failure-text").textContent=message;el("summary").textContent="Analysis unavailable";statusText("Scene unavailable",true);button("add-target").disabled=true;button("export").disabled=true;}

el("landmarks").addEventListener("click",event=>{const row=(event.target as HTMLElement).closest<HTMLButtonElement>(".landmark");if(row)select(row.dataset.id!);});
search.addEventListener("calciteInputTextInput",updateList);filter.addEventListener("calciteSegmentedControlChange",updateList);
button("about").addEventListener("click",()=>{about.open=true;});button("close-about").addEventListener("click",()=>{about.open=false;button("about").setFocus();});
button("overview").addEventListener("click",()=>void overview());button("deck-view").addEventListener("click",()=>void deckView());
button("add-target").addEventListener("click",()=>setPlacing(!placing));button("cancel-add").addEventListener("click",()=>setPlacing(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape")setPlacing(false);});
button("retry").addEventListener("click",()=>location.reload());
button("reset").addEventListener("click",()=>{
 generation++;setPlacing(false);entries.forEach(dispose);entries=LANDMARKS.map(place=>({place:{...place},status:"pending"}));selected="pike";search.value="";filter.value="all";makeList();renderDetail();
 if(ready)void initializeEntries().then(()=>overview()).catch(()=>fail("The analysis could not reset. Reload the scene to try again."));
});
button("export").addEventListener("click",()=>{
 updateResults();const date=new Date().toISOString();
 const rows=[['name','longitude','latitude','height_above_terrain_m','distance_m','bearing_deg','visibility','observer_deck_m','eye_height_m','rim_radius_m','building_vintage','exported_utc'],...entries.map(e=>[e.place.name,e.place.lon,e.place.lat,e.place.height,metric(e).distance.toFixed(1),metric(e).bearing.toFixed(1),e.status,158.496,1.5,21,'2015–16',date])];
 const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='seattle-sightlines.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
async function initializeEntries(){
 const run=++generation;
 const snapshot=[...entries];
 const data=await elevation.queryElevation(new Multipoint({points:snapshot.map(e=>[e.place.lon,e.place.lat]),spatialReference:{wkid:4326}}),{returnSampleInfo:true,signal:initAbort.signal});
 if(run!==generation)return;
 await Promise.all(snapshot.map(async(e,i)=>{if(data.sampleInfo?.[i]?.demResolution===-1)throw new Error("Missing terrain sample");e.ground=data.geometry.points[i][2];await analyze(e);}));
 if(run!==generation)return;refreshLabels();schedule();
}
async function start(){
 const timeout=window.setTimeout(()=>fail("Seattle’s 3D services did not finish loading. Check your connection, then reload."),60000);
 try{
  await scene.viewOnReady();
  await Promise.all([buildings.load(),needleModel.load(),elevation.load()]);
  console.info("Seattle building source", JSON.stringify({title:buildings.title,access:buildings.portalItem?.access,objectIdField:buildings.objectIdField,fields:buildings.fields?.map(f=>f.name)}));
  const base=await elevation.queryElevation(point(NEEDLE.lon,NEEDLE.lat),{returnSampleInfo:true,signal:initAbort.signal});
  if(base.sampleInfo?.[0]?.demResolution===-1)throw new Error('Missing observer terrain');
  groundNeedle=base.geometry.z!;ready=true;
  await initializeEntries();
  await scene.whenLayerView(buildings);
  button("add-target").disabled=false;button("reset").disabled=false;renderDetail();
  reactiveUtils.watch(()=>[scene.updating,scene.stationary],schedule);
  reactiveUtils.watch(()=>scene.fatalError,error=>{if(error)fail("WebGL rendering stopped. Reload the scene or try a browser with hardware acceleration.");});
  scene.addEventListener("arcgisViewClick",async event=>{
   const location=event.detail.mapPoint;if(!location||!ready)return;
   if(!placing){const hits=await scene.hitTest(event.detail);const hit=hits.results.find(r=>r.type==="graphic"&&r.graphic.layer===labels);if(hit?.type==="graphic"&&hit.graphic.attributes?.placeId)select(hit.graphic.attributes.placeId);return;}
   const lon=location.longitude!,lat=location.latitude!,distance=distanceBearing(lon,lat).distance;
   if(distance<50||distance>8000){statusText("Choose a point between 50 m and 8 km from the Space Needle.",true);return;}
   if(entries.length>=25){setPlacing(false);statusText("25 target limit reached. Remove a custom target or reset.",true);return;}
   setPlacing(false);const run=generation;
   try{const terrain=await elevation.queryElevation(point(lon,lat),{returnSampleInfo:true,signal:initAbort.signal});if(run!==generation)return;if(terrain.sampleInfo?.[0]?.demResolution===-1)throw new Error('Missing terrain');
    const e:Entry={place:{id:'custom-'+(++customCount),name:'Your point '+customCount,category:'Custom target',lon,lat,height:2,custom:true,description:'Your sample point, measured from terrain. Adjust its height to explore how the sightline changes.'},ground:terrain.geometry.z,status:'pending'};
    entries.push(e);await analyze(e);makeList();select(e.place.id);schedule();
   }catch{statusText("Could not sample terrain at that point. Try again.",true);}
  });
  await overview();schedule();
 }catch(error){if(!initAbort.signal.aborted){console.error(error);fail("The terrain or Seattle building layer could not load. Check your internet connection and reload.");}}
 finally{clearTimeout(timeout);}
}
makeList();renderDetail();void start();
