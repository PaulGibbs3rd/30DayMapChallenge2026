import { loadTrack, stopPlayback, setProvider } from "./player.js";

const $ = (id) => document.getElementById(id);
const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let shows = [], visibleShows = [], selectedId, selectedSong = null;
let mapElement, stopLayer, selectedLayer, routeLayer, Graphic, Extent;
const byId = new Map();
const dateParts = (date) => ({month: monthNames[Number(date.slice(5,7))-1], day: date.slice(8,10)});
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
async function json(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Could not load " + path);
  return response.json();
}
function renderStops() {
  const fragment = document.createDocumentFragment();
  for (const show of visibleShows) {
    const {month, day} = dateParts(show.date);
    const button = el("button", "stop-button");
    button.type = "button"; button.dataset.id = show.id;
    button.setAttribute("aria-label", show.city + ", " + month + " " + day + ". " + show.venue);
    button.setAttribute("aria-current", String(show.id === selectedId));
    const date = el("span", "stop-date");
    date.append(el("span","stop-month",month),el("span","stop-day",day));
    const copy = el("span","stop-copy"), city = el("span","stop-city",show.city + " ");
    city.append(el("span","stop-region",show.region));
    copy.append(city,el("span","stop-venue",show.venue));
    button.append(date,copy,el("span","stop-arrow","↗"));
    button.addEventListener("click", () => selectShow(show.id, true));
    fragment.append(button);
  }
  $("tour-list").replaceChildren(fragment);
  $("stop-count").textContent = visibleShows.length + " STOPS";
  $("no-results").hidden = visibleShows.length !== 0;
  // Mobile keeps every stop accessible even after a desktop filter was applied.
  const options = shows.map(show => {
    const option = el("calcite-option", "", dateParts(show.date).month + " " + dateParts(show.date).day + " · " + show.city + ", " + show.region);
    option.value = show.id;
    if (show.id === selectedId) option.selected = true;
    return option;
  });
  if (!options.length) {
    const empty = el("calcite-option", "", "No matching stops");
    empty.value = ""; empty.disabled = true; options.push(empty);
  }
  $("mobile-stop").replaceChildren(...options);
  updateNavigation();
}
function updateNavigation() {
  const index = visibleShows.findIndex(s => s.id === selectedId);
  $("previous-stop").disabled = index <= 0;
  $("next-stop").disabled = index < 0 || index >= visibleShows.length - 1;
}
function filterStops() {
  const search = ($("stop-search").value || "").trim().toLocaleLowerCase();
  const country = $("country-filter").value || "all";
  visibleShows = shows.filter(show => (country === "all" || show.country === country) && (show.city + " " + show.region + " " + show.venue).toLocaleLowerCase().includes(search));
  if (visibleShows.length && !visibleShows.some(s => s.id === selectedId)) selectShow(visibleShows[0].id, false);
  renderStops();
  if (stopLayer) {
    // Search never enters SQL; the expression uses only our integer stop IDs.
    const roster=visibleShows.length ? "stop IN (" + visibleShows.map(s => s.stop).join(",") + ")" : "1=0";
    stopLayer.definitionExpression = "("+roster+") AND stop <> "+byId.get(selectedId).stop;
    if(stopLayer.cityLabels) stopLayer.cityLabels.definitionExpression=roster;
    selectedLayer.visible = visibleShows.some(s => s.id === selectedId);
    routeLayer.visible = $("route-switch").checked && visibleShows.length === shows.length;
    scheduleCollage();
  }
}
function selectShow(id, navigate = false) {
  const show = byId.get(id);
  if (!show) return;
  selectedId = id;
  history.replaceState(null, "", "#" + id);
  $("stop-label").textContent = "STOP " + String(show.stop).padStart(2,"0") + " / 23";
  const city = el("span","",show.region + ", " + (show.country === "CA" ? "CANADA" : "USA"));
  $("show-city").replaceChildren(document.createTextNode(show.city),city);
  const {month,day} = dateParts(show.date);
  $("show-date").replaceChildren(document.createTextNode(month),el("strong","",day));
  $("show-venue").textContent = show.venue;
  $("song-count").textContent = show.songs.length + " SONG ENTRIES";
  $("setlist-source").href = show.sourceUrl;
  const fragment = document.createDocumentFragment();
  show.songs.forEach((song,index) => {
    const li = el("li","song-row");
    if (index + 1 === show.encoreStartsAt) {
      const divider = el("div","encore-divider","ENCORE"); divider.setAttribute("aria-hidden","true"); li.append(divider);
    }
    const button = el("button","song-button");
    button.type = "button"; button.dataset.song = song;
    button.setAttribute("aria-label", "Play " + song);
    button.setAttribute("aria-pressed", String(song === selectedSong));
    const play = el("span","song-play",song === selectedSong ? "▶" : "▷"); play.setAttribute("aria-hidden","true");
    button.append(el("span","song-name",song),play);
    button.addEventListener("click", () => {
      selectedSong = song;
      for (const row of document.querySelectorAll(".song-button")) {
        const active = row.dataset.song === song;
        row.setAttribute("aria-pressed",String(active));
        row.querySelector(".song-play").textContent = active ? "▶" : "▷";
      }
      loadTrack(song);
      document.querySelector(".player").scrollIntoView({block:"nearest",behavior:reduceMotion ? "instant" : "smooth"});
    });
    li.append(button); fragment.append(li);
  });
  $("setlist").replaceChildren(fragment);
  $("show-notes").replaceChildren(...show.notes.map(note => el("p","",note)));
  document.querySelector(".setlist-scroll").scrollTop = 0;
  for (const row of document.querySelectorAll(".stop-button")) row.setAttribute("aria-current",String(row.dataset.id === id));
  $("mobile-stop").value = id;
  updateNavigation();
  if (selectedLayer) {
    drawSelection(show);
    scheduleCollage();
    const roster=visibleShows.length ? "stop IN ("+visibleShows.map(s=>s.stop).join(",")+")" : "1=0";
    stopLayer.definitionExpression="("+roster+") AND stop <> "+show.stop;
    selectedLayer.visible = true;
    if (navigate) {
      mapElement.goTo({center:show.coordinates,zoom:6.4},{duration:reduceMotion ? 0 : 650}).catch(handleNavigation);
      const current = [...document.querySelectorAll(".stop-button")].find(b=>b.dataset.id===id);
      current?.scrollIntoView({block:"nearest",behavior:reduceMotion ? "instant" : "smooth"});
    }
  }
}
function handleNavigation(error) {
  if (error.name !== "AbortError") console.warn("Map navigation did not finish:",error.message);
}
function drawSelection(show) {
  selectedLayer.removeAll();
  selectedLayer.addMany([
    new Graphic({geometry:{type:"point",longitude:show.coordinates[0],latitude:show.coordinates[1]},attributes:{id:show.id},
      symbol:{type:"simple-marker",size:32,color:[187,48,38,.2],outline:{color:[239,189,79,.5],width:1}}}),
    new Graphic({geometry:{type:"point",longitude:show.coordinates[0],latitude:show.coordinates[1]},attributes:{id:show.id},
      symbol:{type:"simple-marker",size:23,color:"#bb3026",outline:{color:"#f3df9f",width:1.7}}}),
    new Graphic({geometry:{type:"point",longitude:show.coordinates[0],latitude:show.coordinates[1]},attributes:{id:show.id},
      symbol:{type:"text",text:String(show.stop).padStart(2,"0"),color:"#fff3cf",font:{family:"monospace",size:8,weight:"bold"},verticalAlignment:"middle",horizontalAlignment:"center"}}),
    new Graphic({geometry:{type:"point",longitude:show.coordinates[0],latitude:show.coordinates[1]},attributes:{id:show.id},
      symbol:{type:"text",text:show.city.toUpperCase(),color:"#f4e5b4",haloColor:"#303b30",haloSize:1.3,font:{family:"sans-serif",size:9,weight:"bold"},xoffset:19,yoffset:17,horizontalAlignment:"left"}})
  ]);
  $("map-coordinates").textContent = show.coordinates[1].toFixed(2) + "° N / " + Math.abs(show.coordinates[0]).toFixed(2) + "° W";
}
async function fitTour() {
  if (!mapElement?.ready || !Extent) return;
  const roster = visibleShows.length ? visibleShows : shows;
  const xs = roster.map(s=>s.coordinates[0]), ys = roster.map(s=>s.coordinates[1]);
  if (roster.length === 1) return mapElement.goTo({center:roster[0].coordinates,zoom:6.4}).catch(handleNavigation);
  const extent = new Extent({xmin:Math.min(...xs)-4,ymin:Math.min(...ys)-4,xmax:Math.max(...xs)+4,ymax:Math.max(...ys)+4,spatialReference:{wkid:4326}});
  await mapElement.goTo(extent,{duration:reduceMotion ? 0 : 500}).catch(handleNavigation);
}
// Place scrapbook art in available screen space, protecting venue points and labels.
function layoutCollage() {
  if (!mapElement?.ready || !Graphic) return;
  const collage=document.querySelector(".map-collage");
  const width=collage.clientWidth, height=collage.clientHeight;
  const mobile=width<430, topEdge=mobile ? 158 : 108;
  const occupied=[];
  const points=visibleShows.map(show=>{
    const geometry=new Graphic({geometry:{type:"point",longitude:show.coordinates[0],latitude:show.coordinates[1]}}).geometry;
    const point=mapElement.view.toScreen(geometry);
    return point ? {...point,selected:show.id===selectedId} : null;
  }).filter(Boolean);
  for(const piece of collage.querySelectorAll(".map-sticker")) {
    if(getComputedStyle(piece).display==="none") continue;
    const w=piece.offsetWidth,h=piece.offsetHeight,pad=mobile ? 9 : 18;
    const maxY=height-h-62;
    if(maxY<topEdge){piece.style.visibility="hidden";continue;}
    const corners={
      nw:[20,topEdge],ne:[width-w-25,topEdge],
      sw:[20,maxY-(mobile ? 0 : 12)],se:[width-w-25,maxY-(mobile ? 0 : 12)]
    };
    const candidates=[
      corners[piece.dataset.artCorner],
      [(width-w)/2,topEdge],corners.nw,corners.ne,corners.sw,corners.se,
      [width*.32-w/2,topEdge],[width*.68-w/2,topEdge],
      [20,Math.max(topEdge,(height-h)/2)],[width-w-25,Math.max(topEdge,(height-h)/2)]
    ];
    let placement=null;
    for(const candidate of candidates) {
      const x=Math.max(pad,Math.min(width-w-pad,candidate[0]));
      const y=Math.max(topEdge,Math.min(maxY,candidate[1]));
      const rect={left:x-pad,top:y-pad,right:x+w+pad,bottom:y+h+pad};
      const blocksPoint=points.some(p=>{
        const labelSpace=p.selected ? 76 : (mapElement.scale<15000000 ? 58 : 24);
        return p.x+labelSpace>rect.left && p.x-24<rect.right && p.y+24>rect.top && p.y-32<rect.bottom;
      });
      const blocksArt=occupied.some(r=>rect.left<r.right&&rect.right>r.left&&rect.top<r.bottom&&rect.bottom>r.top);
      if(!blocksPoint&&!blocksArt){placement={x,y,rect};break;}
    }
    piece.dataset.placed=String(!!placement);
    piece.style.visibility=placement ? "visible" : "hidden";
    if(placement){piece.style.left=placement.x+"px";piece.style.top=placement.y+"px";occupied.push(placement.rect);}
  }
}
let artFrame;
function scheduleCollage() {
  cancelAnimationFrame(artFrame);
  artFrame=requestAnimationFrame(layoutCollage);
}

async function initializeMapView() {
  await Promise.race([
    customElements.whenDefined("arcgis-map"),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error("ArcGIS CDN did not load")),25000))
  ]);
  const [ArcMap, GeoJSONLayer, GraphicsLayer, GraphicType, ExtentType, TileInfo] = await Promise.all([
    $arcgis.import("@arcgis/core/Map.js"), $arcgis.import("@arcgis/core/layers/GeoJSONLayer.js"),
    $arcgis.import("@arcgis/core/layers/GraphicsLayer.js"), $arcgis.import("@arcgis/core/Graphic.js"),
    $arcgis.import("@arcgis/core/geometry/Extent.js"), $arcgis.import("@arcgis/core/layers/support/TileInfo.js")
  ]);
  Graphic = GraphicType; Extent = ExtentType;
  const countries = new GeoJSONLayer({
    url:new URL("../data/countries.geojson",import.meta.url).href,title:"Natural Earth countries",copyright:"Natural Earth (public domain)",popupEnabled:false,
    renderer:{type:"simple",symbol:{type:"simple-fill",color:"#64684b",outline:{color:"#8d8b60",width:.6}}}
  });
  const states = new GeoJSONLayer({
    url:new URL("../data/states.geojson",import.meta.url).href,title:"Natural Earth state boundaries",copyright:"Natural Earth (public domain)",popupEnabled:false,
    renderer:{type:"simple",symbol:{type:"simple-line",color:[173,169,113,.37],width:.6}}
  });
  stopLayer = new GeoJSONLayer({
    url:new URL("../data/tour.geojson",import.meta.url).href,title:"Gorillaz · 23 tour stops",popupEnabled:false,outFields:["*"],
    renderer:{type:"simple",symbol:{type:"simple-marker",size:19,color:"#efbd4f",outline:{color:"#272d24",width:1.4}}},
    labelingInfo:[
      {labelExpressionInfo:{expression:"Text($feature.stop, '00')"},labelPlacement:"center-center",deconflictionStrategy:"none",symbol:{type:"text",color:"#262a22",font:{family:"monospace",size:7.5,weight:"bold"}}}
    ]
  });
  const cityLabels = new GeoJSONLayer({
    url:new URL("../data/tour.geojson",import.meta.url).href,title:"Tour cities",popupEnabled:false,minScale:15000000,
    renderer:{type:"simple",symbol:{type:"simple-marker",size:0,color:[0,0,0,0],outline:null}},
    labelingInfo:[{labelExpressionInfo:{expression:"Upper($feature.city)"},labelPlacement:"above-right",symbol:{type:"text",color:"#f4e5b4",haloColor:"#303b30",haloSize:1,font:{family:"sans-serif",size:8,weight:"bold"},xoffset:7,yoffset:6}}]
  });
  stopLayer.cityLabels = cityLabels;
  routeLayer = new GraphicsLayer({title:"Show order (not a travel route)",visible:false});
  routeLayer.add(new Graphic({geometry:{type:"polyline",paths:[shows.map(s=>s.coordinates)],spatialReference:{wkid:4326}},symbol:{type:"simple-line",color:[232,159,87,.6],width:1.3,style:"dash"}}));
  selectedLayer = new GraphicsLayer({title:"Selected show"});
  mapElement = $("tour-map");
  mapElement.spatialReference = {wkid:3857};
  mapElement.background = {type:"color",color:"#252d29"};
  mapElement.constraints = {lods:TileInfo.create().lods,minZoom:3,maxZoom:9,rotationEnabled:false};
  mapElement.aria = {label:"Gorillaz North American tour map. Select gold venue points to see their setlists. The tour list provides the same selections."};
  mapElement.padding = {top:90,bottom:50,left:20,right:20};
  mapElement.map = new ArcMap({basemap:null,layers:[countries,states,routeLayer,stopLayer,cityLabels,selectedLayer]});
  await mapElement.viewOnReady();
  await Promise.all([countries.load(),states.load(),stopLayer.load()]);
  drawSelection(byId.get(selectedId));
  await fitTour();
  filterStops();
  $("map-loading").hidden = true;
  mapElement.addEventListener("arcgisViewChange",()=>{
    const collage=document.querySelector(".map-collage");
    collage.classList.toggle("is-navigating",!mapElement.stationary);
    if(mapElement.ready&&mapElement.stationary) scheduleCollage();
  });
  new ResizeObserver(scheduleCollage).observe(document.querySelector(".map-stage"));
  scheduleCollage();
  mapElement.addEventListener("arcgisViewClick",async (event)=>{
    const hits = await mapElement.hitTest(event.detail,{include:[stopLayer,selectedLayer]});
    const hit = hits.results.find(result=>result.type==="graphic" && result.graphic.attributes?.id);
    if (hit) {
      const attrs=hit.graphic.attributes;
      const show=byId.get(attrs.id) || shows.find(s=>s.stop===attrs.stop);
      if(show) selectShow(show.id,true);
    }
  });
  mapElement.addEventListener("arcgisViewPointerMove",async (event)=>{
    const hits = await mapElement.hitTest(event.detail,{include:[stopLayer,selectedLayer]});
    mapElement.style.cursor = hits.results.length ? "pointer" : "default";
  });
}
async function boot() {
  const [tour, setlists] = await Promise.all([json("./data/tour.geojson"),json("./data/setlists.json")]);
  for (const feature of tour.features) {
    const info = setlists.shows.find(show => show.date === feature.properties.date);
    if (!info) throw new Error("Missing setlist for " + feature.properties.date);
    const show = {...info,...feature.properties,coordinates:feature.geometry.coordinates,songs:info.songs,sourceUrl:info.sourceUrl,notes:info.notes};
    shows.push(show); byId.set(show.id,show);
  }
  shows.sort((a,b)=>a.stop-b.stop); visibleShows = [...shows];
  const requestedId = location.hash.slice(1);
  selectShow(byId.has(requestedId) ? requestedId : shows[0].id);
  renderStops();
  $("stop-search").addEventListener("calciteInputTextInput",filterStops);
  $("stop-search").addEventListener("calciteInputTextChange",filterStops);
  $("country-filter").addEventListener("calciteSegmentedControlChange",filterStops);
  $("mobile-stop").addEventListener("calciteSelectChange",()=>{
    const id=$("mobile-stop").value;
    $("stop-search").value=""; $("country-filter").value="all";
    visibleShows=[...shows]; renderStops();
    if(stopLayer){stopLayer.definitionExpression="1=1";if(stopLayer.cityLabels)stopLayer.cityLabels.definitionExpression="1=1";}
    selectShow(id,true);
  });
  $("previous-stop").addEventListener("click",()=>{
    const index = visibleShows.findIndex(s=>s.id===selectedId);
    if (index>0) selectShow(visibleShows[index-1].id,true);
  });
  $("next-stop").addEventListener("click",()=>{
    const index = visibleShows.findIndex(s=>s.id===selectedId);
    if (index<visibleShows.length-1) selectShow(visibleShows[index+1].id,true);
  });
  $("fit-tour").addEventListener("click",fitTour);
  $("route-switch").addEventListener("calciteSwitchChange",()=>{
    if(routeLayer) routeLayer.visible=$("route-switch").checked && visibleShows.length===shows.length;
  });
  $("stop-player").addEventListener("click",()=>{
    stopPlayback(); selectedSong=null;
    document.querySelectorAll(".song-button").forEach(row=>{row.setAttribute("aria-pressed","false");row.querySelector(".song-play").textContent="▷";});
  });
  $("music-provider").addEventListener("calciteSegmentedControlChange",()=>{
    setProvider($("music-provider").value);
    if(selectedSong) loadTrack(selectedSong);
  });
  $("about-button").addEventListener("click",()=>{$("about-dialog").open=true;});
  $("close-about").addEventListener("click",()=>{$("about-dialog").open=false;});
  window.addEventListener("hashchange",()=>{if(byId.has(location.hash.slice(1))) selectShow(location.hash.slice(1),true);});
  initializeMapView().catch(error=>{
    console.error(error); $("map-loading").hidden=true;$("map-error").hidden=false;
  });
}
boot().catch(error=>{
  console.error(error);
  $("map-loading").hidden=true; $("map-error").hidden=false;
  $("map-error").textContent="Tour data could not load. Refresh the page or open the research notes for direct setlist links.";
});

