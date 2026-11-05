import "./style.css";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-search";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-button";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-dialog";
import "@esri/calcite-components/components/calcite-alert";
import "@esri/calcite-components/components/calcite-slider";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureReductionCluster from "@arcgis/core/layers/support/FeatureReductionCluster.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";
import LocatorSearchSource from "@arcgis/core/widgets/Search/LocatorSearchSource.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import type FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView.js";
import type Graphic from "@arcgis/core/Graphic.js";
import type MapView from "@arcgis/core/views/MapView.js";
import { categories, classify, categoryExpression, categoryCondition, categoryExclusion } from "./categories";
import type { CategoryId } from "./categories";

const SERVICE = "https://services6.arcgis.com/Do88DoK2xjTUCXd1/arcgis/rest/services/OSM_Buildings_NA/FeatureServer/0";
const MIN_ZOOM = 10;
const DEFAULT_ZOOM = 13;
const MAX_SCALE = 600000;
const CONTEXT_SCALE = 80000;
const BASE_WHERE = "(LOWER(TRIM(BOTH ' ' FROM building)) <> 'no' OR building IS NULL)";
const fmt = new Intl.NumberFormat("en-US");
const el = (id: string) => document.getElementById(id)!;
const text = (id: string, value: string) => { el(id).textContent = value; };
const map = document.querySelector("arcgis-map")!;
const slider = document.querySelector("calcite-slider")!;
const display = document.querySelector("calcite-segmented-control")!;
const search = document.querySelector("arcgis-search")!;
const toast = document.querySelector("calcite-alert")!;
const about = document.querySelector("calcite-dialog")!;
const capture = el("capture") as HTMLCalciteButtonElement;
const placeSelect = el("place-select") as HTMLCalciteSelectElement;
const presets = [
  { label: "Redlands warehouse district", name: "Redlands", state: "CA", x: -117.22, y: 34.075, zoom: DEFAULT_ZOOM },
  { label: "Ontario", name: "Ontario", state: "CA", x: -117.55, y: 34.055, zoom: DEFAULT_ZOOM },
  { label: "Fontana", name: "Fontana", state: "CA", x: -117.47, y: 34.09, zoom: DEFAULT_ZOOM },
  { label: "Rialto", name: "Rialto", state: "CA", x: -117.39, y: 34.10, zoom: DEFAULT_ZOOM },
  { label: "Bloomington", name: "Bloomington", state: "CA", x: -117.40, y: 34.065, zoom: DEFAULT_ZOOM },
];
let view: MapView;
let selected: CategoryId | "all" = "warehouse";
let counts = Object.fromEntries(categories.map(c=>[c.id,0])) as Record<CategoryId,number>;
let total = 0;
let surroundingTotal = 0;
let placeName = "Inland Empire";
let statsReady = false;
let contextStatsAvailable = false;
let selectedGraphic: Graphic | null = null;
let statsController: AbortController | null = null;
let statsTimer: ReturnType<typeof setTimeout>;
let highlight: { remove: () => void } | undefined;
let buildingLayerView: FeatureLayerView | undefined;
let contextLayerView: FeatureLayerView | undefined;
let clicking = 0;
let layerFailed = false;

function notify(message: string) { text("toast-message",message); toast.open = true; }
function status(message: string) { el("map-status").querySelector("span")!.textContent = message; }
function setControls(open: boolean, returnFocus=false) {
  document.body.classList.toggle("controls-open",open);
  el("controls-backdrop").hidden=!open;
  el("mobile-controls").setAttribute("aria-expanded",String(open));
  document.querySelector<HTMLElement>(".map-stage")!.inert=open;
  document.querySelector<HTMLElement>(".topbar")!.inert=open;
  document.querySelector<HTMLElement>(".skip-link")!.inert=open;
  el("sidebar").setAttribute("role",open?"dialog":"complementary");
  if(open) {
    el("sidebar").setAttribute("aria-modal","true");
    void (el("close-controls") as HTMLCalciteActionElement).setFocus();
  } else {
    el("sidebar").removeAttribute("aria-modal");
    if(returnFocus) void (el("mobile-controls") as HTMLCalciteButtonElement).setFocus();
  }
}
function setPlace(name: string, state = "") {
  placeName = name;
  const title = el("place-name");
  title.replaceChildren(document.createTextNode(name));
  if(state) { const badge = document.createElement("span"); badge.textContent = state; title.append(badge); }
}
function closeInspector() { el("inspector").hidden=true; selectedGraphic=null; highlight?.remove(); highlight=undefined; clicking++; }
function safeText(value: unknown) { return String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!)); }
const clusterFields = categories.map(c=>({
  name:"n_"+c.id, alias:c.label, statisticType:"sum" as const,
  onStatisticExpression:{expression:categoryExpression.replaceAll("return '"+c.id+"';","return 1;").replace(/return '[^']+';/g,"return 0;"), returnType:"number" as const},
}));
const dominantExpression = categories.map(c=>`var n_${c.id} = DefaultValue($feature.n_${c.id}, 0);`).join("\n") +
  "\nvar highest = -1; var result = 'unknown';\n" +
  categories.map(c=>`if (n_${c.id} > highest) { highest = n_${c.id}; result = '${c.id}'; }`).join("\n") + "\nreturn result;";
const rgba = (hex: string, alpha: number) => [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16),alpha];
const clusters = new FeatureReductionCluster({
  clusterRadius:80, maxScale:0, popupEnabled:false,
  fields:clusterFields,
  renderer:new UniqueValueRenderer({
    valueExpression:dominantExpression,
    uniqueValueInfos:categories.map(c=>({
      value:c.id,label:c.label,symbol:{type:"simple-marker",style:"circle",size:28,color:rgba(c.color,.22),outline:{color:c.color,width:1.5}},
    })),
    visualVariables:[{type:"size",field:"cluster_count",stops:[{value:1,size:17},{value:30,size:23},{value:150,size:34},{value:500,size:47},{value:1500,size:62}]}],
  }),
  labelingInfo:[{labelExpressionInfo:{expression:"Text($feature.cluster_count, '#,###')"},labelPlacement:"center-center",deconflictionStrategy:"none",symbol:{type:"text",color:"#f5f9ff",haloColor:"#08111c",haloSize:1,font:{family:"Arial",size:9,weight:"bold"}}}],
});
const buildings = new FeatureLayer({
  url:SERVICE,title:"OSM building types",outFields:["building","name","height","levels","addr_housenumber","addr_street","osm_id2"],
  definitionExpression:BASE_WHERE+" AND ("+categoryCondition(selected)+")",
  minScale:MAX_SCALE,popupEnabled:false,featureReduction:clusters,
  renderer:new UniqueValueRenderer({
    valueExpression:categoryExpression,
    uniqueValueInfos:categories.map(c=>({value:c.id,label:c.label,symbol:{type:"simple-fill",color:rgba(c.color,.35),outline:{color:rgba(c.color,.85),width:.65}}})),
  }),
});
// Retain the physical neighborhood when filtering the clustered focus layer.
// Unknown types remain neutral; they are not assumed to be homes or warehouses.
const neighborhood = new FeatureLayer({
  url:SERVICE,title:"Surrounding building footprints",
  outFields:["building","name","height","levels","addr_housenumber","addr_street","osm_id2"],
  definitionExpression:BASE_WHERE+" AND ("+categoryExclusion(selected)+")",minScale:CONTEXT_SCALE,popupEnabled:false,
  renderer:new UniqueValueRenderer({
    valueExpression:categoryExpression,
    defaultSymbol:{type:"simple-fill",color:rgba("#91a3bb",.19),outline:{color:rgba("#a9bad0",.48),width:.55}},
    defaultLabel:"Other / unknown buildings",
    uniqueValueInfos:[
      {value:"warehouse",label:"Warehouses",symbol:{type:"simple-fill",color:rgba("#ffb84d",.48),outline:{color:rgba("#ffb84d",.95),width:1}}},
      {value:"residential",label:"Residential (tagged)",symbol:{type:"simple-fill",color:rgba("#43f5d0",.24),outline:{color:rgba("#43f5d0",.68),width:.65}}},
    ],
  }),
});
// Queries do not inherit the context layer's exclusion of the selected category.
const statistics = new FeatureLayer({url:SERVICE,definitionExpression:BASE_WHERE});
function focusScaleLimit() {
  return selected==="warehouse"&&display.value==="clusters"?MAX_SCALE:CONTEXT_SCALE;
}
function renderLegend() {
  if (!el("categories").children.length) {
    el("categories").innerHTML=categories.map(c=>`<button type="button" class="category-row" data-category="${c.id}" style="--category:${c.color}"><span class="swatch"></span><span>${c.label}</span><span class="category-count"></span><span class="category-bar"></span></button>`).join("");
  }
  for (const c of categories) {
    const row=el("categories").querySelector<HTMLButtonElement>(`[data-category="${c.id}"]`)!;
    row.setAttribute("aria-pressed",String(selected===c.id));
    row.querySelector(".category-count")!.textContent=statsReady&&(contextStatsAvailable||selected===c.id)?fmt.format(counts[c.id]):"—";
    row.querySelector<HTMLElement>(".category-bar")!.style.width=(statsReady&&surroundingTotal?100*counts[c.id]/surroundingTotal:0)+"%";
  }
}
function updateControls() {
  text("summary-label",selected==="warehouse"?"WAREHOUSES IN VIEW":"BUILDINGS IN VIEW");
  text("stats-badge",selected==="all"?"ALL TYPES":categories.find(c=>c.id===selected)!.label);
  renderLegend();
  const footprint = display.value==="footprints";
  buildings.minScale=focusScaleLimit();
  // Each building belongs to one visible layer: selected features or context, never both.
  neighborhood.definitionExpression=BASE_WHERE+" AND ("+categoryExclusion(selected)+")";
  const detailed=!view||view.scale<=CONTEXT_SCALE;
  const selectedLabel=selected==="all"?"All building types":categories.find(c=>c.id===selected)!.label;
  const contextKey=(selected!=="warehouse"?'<i class="warehouse-swatch"></i>Warehouse context<br>':'')+(selected!=="residential"?'<i class="home-swatch"></i>Residential context (tagged)<br>':'')+'<i class="other-swatch"></i>Other / unknown context buildings';
  el("key-text").innerHTML='<b>'+selectedLabel+(footprint?' as footprints':' as circles')+'</b><br><span class="context-key">'+(detailed&&selected!=="all"?contextKey:detailed?'Each building shown once':'Zoom in for surrounding building footprints')+'</span>';
  slider.disabled=display.value==="footprints";
}
function setFilter(id: CategoryId | "all") {
  selected=id;
  closeInspector();
  buildings.definitionExpression=BASE_WHERE+" AND ("+categoryCondition(id)+")";
  updateControls();
  scheduleStats();
  updateHash();
}
function updateHash() {
  if(!view?.center) return;
  const p = new URLSearchParams({
    x:view.center.longitude!.toFixed(5), y:view.center.latitude!.toFixed(5), z:view.zoom.toFixed(2),
    type:selected, radius:String(slider.value), mode:display.value, place:placeName,
  });
  history.replaceState(null,"","#"+p);
}
function scheduleStats() {
  statsController?.abort();
  clearTimeout(statsTimer);
  statsReady=false;
  text("total","—");
  text("stats-note","Updating the buildings in view…");
  renderLegend();
  if(!view) return;
  if(layerFailed) { status("Building service unavailable. Reload to retry."); return; }
  const wide=view.scale>focusScaleLimit();
  el("wide-message").hidden=!wide;
  capture.disabled=wide;
  if(wide) { status("Zoom in for this building type or switch to warehouse clusters"); text("stats-note","Detailed buildings pause at regional scales to keep the map responsive."); return; }
  status(view.updating?"Loading mapped buildings…":"Counting mapped buildings…");
  statsTimer=setTimeout(()=>void loadStats(),450);
}
async function loadStats() {
  statsController?.abort();
  const controller=new AbortController(); statsController=controller;
  try {
    // Complete server-side statistics, independent of visible feature / transfer limits.
    const detailed=view.scale<=CONTEXT_SCALE;
    const query=statistics.createQuery();
    if(!detailed) query.where=BASE_WHERE+" AND ("+categoryCondition(selected)+")";
    query.geometry=view.extent;
    query.spatialRelationship="intersects";
    query.returnGeometry=false;
    query.groupByFieldsForStatistics=["building"];
    query.outStatistics=[{onStatisticField:statistics.objectIdField,statisticType:"count",outStatisticFieldName:"building_count"}];
    const result=await statistics.queryFeatures(query,{signal:controller.signal});
    if(controller.signal.aborted) return;
    if(result.exceededTransferLimit) throw new Error("Statistics exceeded service transfer limit");
    counts=Object.fromEntries(categories.map(c=>[c.id,0])) as Record<CategoryId,number>;
    for(const f of result.features) counts[classify(f.attributes.building)]+=Number(f.attributes.building_count)||0;
    surroundingTotal=Object.values(counts).reduce((a,b)=>a+b,0);
    total=selected==="all"?surroundingTotal:counts[selected];statsReady=true;contextStatsAvailable=detailed;
    text("total",fmt.format(total));
    const unknown=surroundingTotal?Math.round(100*counts.unknown/surroundingTotal):0;
    text("stats-note",!detailed?"Warehouse overview · zoom in for neighborhood context":selected==="all"?`${unknown}% of mapped buildings have unspecified type`:`${fmt.format(surroundingTotal-total)} other mapped buildings remain visible`);
    renderLegend();
    status(display.value==="footprints"?"Individual footprints · click a building":!detailed?"Warehouse clusters · zoom in for surrounding buildings":total?"Click a cluster to see what makes it":"Try another area or reset the type filter");
  } catch(error) {
    if(controller.signal.aborted) return;
    console.error("Building statistics failed",error);
    text("total","—");text("stats-note","Counts unavailable. Move the map to retry.");
    status("Building counts could not load. Try another area.");
  }
}
function showCluster(g: Graphic) {
  const a=g.attributes;
  const n=Number(a.cluster_count)||1;
  text("inspect-kicker","INSIDE THE CLUSTER");
  text("inspect-title",fmt.format(n)+" building"+(n===1?"":"s"));
  const parts=categories.map(c=>({...c,count:Number(a["n_"+c.id])||0})).filter(c=>c.count>0).sort((a,b)=>b.count-a.count);
  const dominant=parts[0];
  text("inspect-subtitle",dominant?`${dominant.label} leads this cluster · ${Math.round(100*dominant.count/n)}% of mapped buildings`:"Mapped buildings grouped by proximity");
  el("inspect-chart").innerHTML=parts.map(c=>`<div class="chart-row" style="--category:${c.color}"><span>${c.label}</span><span>${fmt.format(c.count)} · ${Math.round(100*c.count/n)}%</span><div class="chart-track"><div class="chart-fill" style="width:${100*c.count/n}%"></div></div></div>`).join("");
  text("inspect-detail",`${Math.round(100*(Number(a.n_unknown)||0)/n)}% unknown type. Groups change with zoom and cluster reach.`);
}
function showBuilding(g: Graphic) {
  const a=g.attributes;
  const category=categories.find(c=>c.id===classify(a.building))!;
  text("inspect-kicker","ONE FOOTPRINT / ONE STORY");
  const address=[a.addr_housenumber,a.addr_street].filter(Boolean).join(" ");
  text("inspect-title",a.name||address||category.label+" building");
  text("inspect-subtitle",category.label+" · OSM building="+(a.building||"unspecified"));
  el("inspect-chart").replaceChildren();
  const rows=[["Name",a.name],["Address",address],["Height",a.height?fmt.format(a.height)+" m":null],["Levels",a.levels]];
  el("inspect-detail").innerHTML="<dl>"+rows.map(([k,v])=>`<dt>${k}</dt><dd>${safeText(v||"Not mapped")}</dd>`).join("")+"</dl>";
}
async function navigate(p: typeof presets[number]) {
  setPlace(p.name,p.state);
  placeSelect.value=String(presets.indexOf(p));
  search.searchTerm="";
  closeInspector();
  setControls(false,document.body.classList.contains("controls-open"));
  try { await map.goTo({center:[p.x,p.y],zoom:p.zoom}); setPlace(p.name,p.state);updateHash(); } catch(e) { if((e as Error).name!=="AbortError") console.error(e); }
}
function restoreHash() {
  const p=new URLSearchParams(location.hash.slice(1));
  const x=Number(p.get("x")),y=Number(p.get("y")),z=Number(p.get("z"));
  if(p.has("x")&&p.has("y")&&Number.isFinite(x)&&Number.isFinite(y)&&x>=-180&&x<=-60&&y>=15&&y<=75) {
    map.center=[x,y];map.zoom=Number.isFinite(z)?Math.min(20,Math.max(MIN_ZOOM,z)):MIN_ZOOM;
    setPlace((p.get("place")||"Explore the United States").slice(0,80));
    const preset=presets.findIndex(p=>Math.hypot(p.x-x,p.y-y)<.02);
    placeSelect.value=preset<0?"":String(preset);
  }
  const type=p.get("type");if(type==="all"||categories.some(c=>c.id===type)) {selected=type as CategoryId|"all";buildings.definitionExpression=BASE_WHERE+" AND ("+categoryCondition(selected)+")";}
  const radius=Number(p.get("radius")); if(radius>=40&&radius<=140) {slider.value=radius;clusters.clusterRadius=radius;text("radius-value",radius+" px");}
  if(p.get("mode")==="footprints") {display.value="footprints";buildings.featureReduction=null;}
}
async function initialize() {
  await map.viewOnReady();
  view=map.view;
  view.popupEnabled=false;
  // Apply before adding the feature layer, including when restoring an old wide-area URL.
  view.constraints.minZoom=MIN_ZOOM;
  search.sources.add(new LocatorSearchSource({url:"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",singleLineFieldName:"SingleLine",name:"US places",placeholder:"Search any US city or place",countryCode:"USA",outFields:["Match_addr"],defaultZoomScale:30000}));
  search.resultGraphicDisabled=true;
  search.referenceElement=map;
  restoreHash();
  updateControls();
  map.map!.addMany([neighborhood,buildings]);
  await Promise.all([neighborhood.load(),buildings.load(),statistics.load()]);
  buildingLayerView=await view.whenLayerView(buildings) as FeatureLayerView;
  contextLayerView=await view.whenLayerView(neighborhood) as FeatureLayerView;
  reactiveUtils.watch(()=>view.stationary,stationary=>{
    if(stationary) {updateControls();scheduleStats();updateHash();} else {statsController?.abort();clearTimeout(statsTimer);statsReady=false; text("total","—");text("stats-note","Updating buildings in the new view…");renderLegend(); closeInspector();}
  });
  // Avoid keeping a city name after a visitor pans far away.
  reactiveUtils.watch(()=>view.center,()=>{
    const c=view.center;
    if(c && !presets.some(p=>Math.abs(p.x-c.longitude!)<.13&&Math.abs(p.y-c.latitude!)<.1) && placeName!=="Explore the United States") {
      setPlace("Explore the United States");
    }
  });
  view.on("click",async event=>{
    const ticket=++clicking;
    try {
      const hit=await view.hitTest(event,{include:[buildings,neighborhood]});
      if(ticket!==clicking) return;
      const result=hit.results.find(r=>r.type==="graphic"&&r.graphic.layer===buildings)??hit.results.find(r=>r.type==="graphic");
      if(!result||result.type!=="graphic") {closeInspector();return;}
      highlight?.remove();
      selectedGraphic=result.graphic;
      const g=selectedGraphic;
      if(g.isAggregate) showCluster(g); else {showBuilding(g);highlight=(g.layer===neighborhood?contextLayerView:buildingLayerView)?.highlight(g);}
      el("inspector").hidden=false;
    } catch(error) {console.error("Selection failed",error);notify("Could not inspect that building. Please try again.");}
  });
  updateControls();scheduleStats();updateHash();
}
el("categories").addEventListener("click",event=>{
  const button=(event.target as HTMLElement).closest<HTMLButtonElement>("[data-category]");
  if(button) setFilter(selected===button.dataset.category?"all":button.dataset.category as CategoryId);
});
el("reset").addEventListener("click",()=>setFilter("all"));
slider.addEventListener("calciteSliderInput",()=>{
  const radius=Number(slider.value);clusters.clusterRadius=radius;
  text("radius-value",radius+" px");closeInspector();updateHash();
});
display.addEventListener("calciteSegmentedControlChange",()=>{
  buildings.minScale=focusScaleLimit();
  buildings.featureReduction=display.value==="footprints"?null:clusters;
  closeInspector();updateControls();scheduleStats();updateHash();
});
placeSelect.innerHTML='<calcite-option value="" disabled>Choose a district…</calcite-option>'+presets.map((p,i)=>`<calcite-option value="${i}"${i===0?" selected":""}>${p.label}</calcite-option>`).join("");
placeSelect.addEventListener("calciteSelectChange",()=>{
  if(placeSelect.value==="") return;
  const preset=presets[Number(placeSelect.value)];
  if(preset&&view) void navigate(preset);
});
el("back-story").addEventListener("click",()=>{setFilter("warehouse");void navigate(presets[0]);});
el("story-home").addEventListener("click",()=>{setFilter("warehouse");void navigate(presets[0]);});
el("close-inspector").addEventListener("click",closeInspector);
el("inspect-zoom").addEventListener("click",async()=>{
  const geometry=selectedGraphic?.geometry;if(!geometry) return;
  const target=geometry.type==="point"?{center:geometry,zoom:Math.min(view.zoom+2,19)}:{target:geometry,scale:Math.min(view.scale/3,5000)};
  closeInspector();
  try {await map.goTo(target);} catch(error) {if((error as Error).name!=="AbortError") console.error(error);}
});
search.addEventListener("arcgisSearchComplete",event=>{
  const result=event.detail.results?.flatMap(r=>r.results)[0];
  if(result) {setPlace(result.name);placeSelect.value="";closeInspector();setControls(false,document.body.classList.contains("controls-open"));}
});
el("about").addEventListener("click",()=>{about.open=true;});
el("mobile-controls").addEventListener("click",()=>{
  setControls(!document.body.classList.contains("controls-open"));
});
el("close-controls").addEventListener("click",()=>setControls(false,true));
el("controls-backdrop").addEventListener("click",()=>setControls(false,true));
matchMedia("(min-width: 901px)").addEventListener("change",()=>setControls(false));
el("present").addEventListener("click",()=>{
  const active=document.body.classList.toggle("presentation");
  setControls(false);
  text("present",active?"Exit presentation":"Presentation");
  el("present").setAttribute("aria-pressed",String(active));
  closeInspector();
});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape") {closeInspector();if(document.body.classList.contains("controls-open"))setControls(false,true);}
});
el("share").addEventListener("click",async()=>{
  updateHash();
  // Development links remain local; published links retain the exact hosting path.
  try {await navigator.clipboard.writeText(location.href);notify("View link copied. It includes your location, filter, and cluster reach.");}
  catch {notify("Copy the link from your browser address bar to share this view.");}
});
capture.addEventListener("click",async()=>{
  if(!view||view.updating||!statsReady) {notify("Let the map finish loading before saving an image.");return;}
  capture.loading=true;capture.disabled=true;
  try {
    const savedPlace=placeName, savedTotal=total, savedFilter=selected;
    const shot=await view.takeScreenshot({width:1600,height:1000,format:"png"});
    const canvas=document.createElement("canvas");canvas.width=1600;canvas.height=1000;
    const ctx=canvas.getContext("2d")!;ctx.putImageData(shot.data,0,0);
    const gradient=ctx.createLinearGradient(0,0,0,270);gradient.addColorStop(0,"#080c13");gradient.addColorStop(1,"#080c1300");
    ctx.fillStyle=gradient;ctx.fillRect(0,0,1600,270);
    ctx.fillStyle="#43f5d0";ctx.font="bold 16px Arial";ctx.fillText("DAY 04 / CLUSTERS    ·    #30DayMapChallenge",48,47);
    ctx.fillStyle="#f0f6ff";ctx.font="bold 66px Arial";ctx.fillText("Warehouse / Country.",44,121);
    ctx.fillStyle="#bbcce0";ctx.font="24px Arial";ctx.fillText(savedPlace+"  /  "+(savedFilter==="all"?"All building types":categories.find(c=>c.id===savedFilter)!.label)+(view.scale<=CONTEXT_SCALE?" + surrounding context":" / Regional overview"),48,163);
    ctx.fillStyle="#080c13ed";ctx.fillRect(0,858,1600,142);
    ctx.fillStyle="#fff";ctx.font="bold 23px Arial";ctx.fillText(fmt.format(savedTotal)+" mapped "+(savedFilter==="warehouse"?"warehouses":"buildings in selected types")+" in view",48,897);
    ctx.font="16px Arial";let x=48;
    const exportLegend=[{color:categories.find(c=>c.id===savedFilter)?.color??"#e9efff",label:"Selected type: "+(display.value==="footprints"?"footprints":"clusters")}];
    if(view.scale<=CONTEXT_SCALE&&savedFilter!=="all") exportLegend.push({color:"#a9bad0",label:"Other building types remain as context footprints"});
    for(const c of exportLegend) {ctx.fillStyle=c.color;ctx.fillRect(x,921,8,8);ctx.fillStyle="#bacce2";ctx.fillText(c.label,x+16,932);x+=ctx.measureText(c.label).width+43;}
    ctx.fillStyle="#93a9c4";ctx.font="14px Arial";ctx.fillText("PAUL GIBBS  ·  Inland Empire warehouses, one mapped footprint at a time.",48,975);
    const creditText=document.createElement("span");
    creditText.innerHTML=view.attributionItems.map(item=>item.text).join(" · ");
    const credits="© OpenStreetMap contributors (ODbL) · "+(creditText.textContent||"Esri basemap");
    ctx.fillStyle="#080c13";ctx.fillRect(0,978,1600,22);
    ctx.fillStyle="#93a9c4";ctx.font="10px Arial";ctx.fillText(credits,48,992,1504);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Image export failed")),"image/png"));
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="warehouse-country-"+savedPlace.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".png";a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    notify("Image saved. Add your own observation when you share it.");
  } catch(error) {console.error(error);notify("Image could not be saved. Try again after the map loads.");}
  finally {capture.loading=false;capture.disabled=view.scale>focusScaleLimit();}
});
renderLegend();
void initialize().catch(error=>{layerFailed=true;console.error(error);status("Building data could not load. Reload to retry.");text("stats-note","Connection unavailable. Reload the page to retry.");notify("Building data could not load. Check your connection and reload.");});
