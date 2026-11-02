import { bearing, destination, midpoint, orientTerrain } from './navigation.js';

const $ = (id) => document.getElementById(id);
const SERVICE = 'https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Seattle_Streets_1/FeatureServer/0';
const ROAD_WHERE = "STATUS = 'INSVC' AND STREETTYPE IS NOT NULL AND STREETTYPE <> 'Alley'";
const FIELDS = ['OBJECTID','STNAME_ORD','UNITDESC','SLOPE_PCT','SEGLENGTH','XSTRLO','XSTRHI','STREETTYPE'];
let streets, scene, profile, layerView, highlight, current, selectionRequest, markerRequest;
let rankMarkers, endpoints, Graphic, Point, Camera;
let records = [], ranked = [], climb;
const geometryCache = new Map();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const title = (a) => a.STNAME_ORD?.trim() || 'Unnamed street';
const between = (a) => [a.XSTRLO?.trim() || 'Unknown endpoint', a.XSTRHI?.trim() || 'Unknown endpoint'].join(' ↔ ');
function errorMessage(id, message, error) {
  console.error(message, error);
  $(id).textContent = message;
  $(id).hidden = false;
}
function rankFor(a) { return ranked.findIndex((r) => r.SLOPE_PCT === a.SLOPE_PCT) + 1; }
function rankLabel() {
  if (!current) return;
  const a = current.attributes;
  const found = ranked.some((r) => r.OBJECTID === a.OBJECTID);
  $('selected-rank').textContent = found ? 'RANK ' + String(rankFor(a)).padStart(2,'0') + ' / RECORDED SEGMENT GRADE' : 'SELECTED STREET SEGMENT';
}
function renderRanking() {
  const min = Number($('min-length').value), seen = new Set();
  const eligible = records.filter((a) => Number.isFinite(a.SLOPE_PCT) && a.SLOPE_PCT >= 0 && a.SEGLENGTH >= min);
  ranked = eligible.filter((a) => {
    if (!$('unique').checked) return true;
    const name = title(a).toUpperCase();
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  }).slice(0,20);
  $('ranking').replaceChildren();
  ranked.forEach((a) => {
    const item = document.createElement('calcite-list-item');
    item.label = title(a);
    item.description = between(a) + ' · ' + fmt.format(a.SEGLENGTH) + ' ft';
    item.value = String(a.OBJECTID);
    item.selected = current?.attributes.OBJECTID === a.OBJECTID;
    const number = document.createElement('span');
    number.slot = 'content-start'; number.className = 'rank-number';
    number.textContent = String(rankFor(a)).padStart(2,'0');
    const grade = document.createElement('span');
    grade.slot = 'content-end'; grade.className = 'rank-grade'; grade.textContent = a.SLOPE_PCT + '%';
    item.append(number, grade);
    item.addEventListener('calciteListItemSelect', () => selectStreet(a.OBJECTID));
    $('ranking').append(item);
  });
  $('ranking-status').textContent = ranked.length ? fmt.format(eligible.length) + ' eligible segments · ' + ranked.length + ' shown' : 'No matching segments. Try a shorter minimum length.';
  rankLabel();
  updateMarkers();
}
async function loadRanking() {
  $('retry').hidden = true;
  $('ranking-status').textContent = 'Reading Seattle’s street records…';
  try {
    const results = [];
    for (let start = 0; ; start += 2000) {
      const q = streets.createQuery();
      q.where = ROAD_WHERE + ' AND SLOPE_PCT IS NOT NULL'; q.outFields = FIELDS; q.returnGeometry = false;
      q.orderByFields = ['SLOPE_PCT DESC','OBJECTID ASC']; q.start = start; q.num = 2000;
      const page = await streets.queryFeatures(q);
      results.push(...page.features.map((f) => f.attributes));
      if (!page.exceededTransferLimit || !page.features.length) break;
    }
    records = results;
    renderRanking();
    if (!current && ranked.length) await selectStreet(ranked[0].OBJECTID, false);
  } catch (error) {
    errorMessage('ranking-status', 'Street records could not load. Check your connection and retry.', error);
    $('retry').hidden = false;
  }
}
function point(coordinates) {
  return new Point({ longitude: coordinates[0], latitude: coordinates[1], z: coordinates[2], spatialReference: { wkid: 4326 } });
}
function badge(coordinates, text, attributes, color = '#142630') {
  const geometry = point(coordinates);
  // Two screen-facing symbols keep the numbered circles legible while orbiting.
  return [
    new Graphic({ geometry, attributes, symbol: { type: 'simple-marker', style: 'circle', size: 25, color, outline: { color: '#b2eadf', width: 1.4 } } }),
    new Graphic({ geometry, attributes, symbol: { type: 'text', text, color: '#f4fffc', font: { family: 'Arial', size: 10, weight: 'bold' }, verticalAlignment: 'middle', horizontalAlignment: 'center', yoffset: 0 } })
  ];
}
async function updateMarkers() {
  if (!rankMarkers) return;
  markerRequest?.abort();
  const controller = markerRequest = new AbortController();
  rankMarkers.removeAll();
  $('marker-status').textContent = 'Locating ranked climbs…';
  try {
    const missing = ranked.filter((a) => !geometryCache.has(a.OBJECTID));
    if (missing.length) {
      const q = streets.createQuery();
      q.objectIds = missing.map((a) => a.OBJECTID); q.outFields = FIELDS;
      q.returnGeometry = true; q.returnM = false; q.outSpatialReference = { wkid: 4326 };
      const result = await streets.queryFeatures(q, { signal: controller.signal });
      if (controller.signal.aborted) return;
      for (const f of result.features) if (f.geometry) geometryCache.set(f.attributes.OBJECTID, f);
    }
    if (controller.signal.aborted) return;
    for (const a of ranked) {
      const f = geometryCache.get(a.OBJECTID);
      if (!f) continue;
      const center = midpoint(f.geometry.paths).point;
      if (center) rankMarkers.addMany(badge(center, String(rankFor(a)).padStart(2,'0'), { streetId: a.OBJECTID }));
    }
    $('marker-status').textContent = 'Numbered circles match the ranking · select a circle to explore';
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.warn('Rank markers unavailable', error);
      $('marker-status').textContent = 'Rank markers unavailable. Select a street from the list.';
    }
  }
}
async function zoomToCurrent() {
  if (!current) return;
  const selectedClimb = climb;
  const selectedFeature = current;
  try {
    if (!selectedClimb?.directed) {
      await scene.goTo({ target: selectedFeature.geometry.extent.expand(3), tilt: 55 }, { animate: !reducedMotion });
      return;
    }
    const { paths } = selectedClimb;
    const { point: target, length } = midpoint(paths);
    const heading = bearing(paths[0][0], paths[0].at(-1));
    const aspect = scene.clientWidth / Math.max(1, scene.clientHeight);
    const range = Math.max(150, length * Math.max(2, aspect * 1.8));
    const position = destination(target, heading + 180, range);
    let altitude = target[2] + range / Math.tan(68 * Math.PI / 180);
    // Keep the eye above terrain even when the hillside continues behind endpoint A.
    try {
      const sampled = await scene.map.ground.queryElevation(point(position), { signal: selectionRequest?.signal });
      if (sampled.geometry.z !== sampled.noDataValue && Number.isFinite(sampled.geometry.z)) altitude = Math.max(altitude, sampled.geometry.z + 35);
    } catch (error) { if (error.name === 'AbortError') return; }
    if (current !== selectedFeature) return;
    await scene.goTo(new Camera({
      position: point([...position, altitude]), heading,
      tilt: Math.atan2(range, altitude - target[2]) * 180 / Math.PI
    }), { animate: !reducedMotion, duration: 1200 });
  } catch (error) { if (error.name !== 'AbortError') console.warn('Camera navigation interrupted', error); }
}
function displayEndpoints(geometry, directed, reason) {
  endpoints.removeAll();
  const first = geometry.paths[0]?.[0], last = geometry.paths.at(-1)?.at(-1);
  if (!first || !last) return;
  for (const p of [first, last]) endpoints.add(new Graphic({
    geometry: { type: 'polyline', paths: [[[p[0],p[1],-5],[p[0],p[1],0]]], hasZ: true, spatialReference: { wkid: 4326 } },
    symbol: { type: 'simple-line', color: '#b2eadf', width: 1 }
  }));
  endpoints.addMany(badge(first.slice(0,2), 'A', { endpoint: 'A' }, '#24695f'));
  endpoints.addMany(badge(last.slice(0,2), 'B', { endpoint: 'B' }, '#8c4f32'));
  const ft = (p) => Number.isFinite(p[2]) ? fmt.format(p[2] * 3.28084) + ' ft' : 'elevation unavailable';
  $('endpoint-a').textContent = 'A · ' + (directed ? 'Lower endpoint · ' : 'Profile start · ') + ft(first);
  $('endpoint-b').textContent = 'B · ' + (directed ? 'Higher endpoint · ' : 'Profile end · ') + ft(last);
  $('direction-status').textContent = directed
    ? 'Profile runs A → B, from the lower to the higher terrain endpoint. Camera looks uphill.'
    : reason;
  $('locate').textContent = directed ? 'Look uphill A → B' : 'Zoom to segment';
}
async function selectStreet(id, zoom = true) {
  selectionRequest?.abort();
  const controller = selectionRequest = new AbortController();
  $('scene-status').textContent = 'Sampling terrain for the uphill view…'; $('scene-status').hidden = false;
  endpoints.removeAll(); climb = null; $('locate').disabled = true;
  try {
    let f = geometryCache.get(id);
    if (!f) {
      const q = streets.createQuery();
      q.objectIds = [id]; q.outFields = FIELDS; q.returnGeometry = true;
      q.outSpatialReference = { wkid: 4326 }; q.returnM = false;
      const result = await streets.queryFeatures(q, { signal: controller.signal });
      f = result.features[0];
    }
    if (controller.signal.aborted) return;
    if (!f?.geometry) throw new Error('Street geometry unavailable');
    geometryCache.set(id, f);
    let geometry = f.geometry.clone(), directed = false;
    let reason = 'Terrain sampling unavailable; A/B follow source order.';
    try {
      const sample = await scene.map.ground.queryElevation(geometry, { demResolution: 'finest-contiguous', signal: controller.signal });
      const oriented = orientTerrain(sample.geometry.paths, sample.noDataValue);
      directed = oriented.directed; reason = oriented.reason;
      geometry.paths = oriented.paths.map((path) => path.map((p) => p[2] === sample.noDataValue ? p.slice(0,2) : p));
      geometry.hasZ = geometry.paths.flat().every((p) => Number.isFinite(p[2]));
    } catch (error) { if (error.name === 'AbortError') return; console.warn('Terrain orientation unavailable', error); }
    if (controller.signal.aborted) return;
    current = f; climb = { paths: geometry.paths, directed };
    highlight?.remove(); highlight = layerView.highlight(f);
    const a = f.attributes;
    $('street-heading').textContent = title(a); $('cross-streets').textContent = between(a);
    $('grade').textContent = a.SLOPE_PCT == null ? 'No data' : a.SLOPE_PCT + '%';
    $('length').textContent = a.SEGLENGTH == null ? 'No data' : fmt.format(a.SEGLENGTH) + ' ft';
    profile.geometry = geometry;
    displayEndpoints(geometry, directed, reason);
    for (const item of $('ranking').children) item.selected = item.value === String(id);
    rankLabel(); $('locate').disabled = false; $('scene-status').hidden = true;
    if (zoom) await zoomToCurrent();
  } catch (error) {
    if (error.name !== 'AbortError') errorMessage('scene-status', 'This street could not load. Select it again to retry.', error);
  }
}
$('about').addEventListener('click', () => { $('about-dialog').open = true; });
$('min-length').addEventListener('calciteSelectChange', renderRanking);
$('unique').addEventListener('calciteSwitchChange', renderRanking);
$('retry').addEventListener('click', loadRanking);
$('locate').addEventListener('click', zoomToCurrent);
try {
  let FeatureLayer, GraphicsLayer, reactiveUtils;
  [FeatureLayer, GraphicsLayer, Graphic, Point, Camera, reactiveUtils] = await $arcgis.import([
    '@arcgis/core/layers/FeatureLayer.js', '@arcgis/core/layers/GraphicsLayer.js',
    '@arcgis/core/Graphic.js', '@arcgis/core/geometry/Point.js', '@arcgis/core/Camera.js', '@arcgis/core/core/reactiveUtils.js'
  ]);
  scene = $('scene'); profile = $('profile');
  await scene.viewOnReady(); await profile.componentOnReady();
  scene.environment = { background: { type: 'color', color: '#172b37' }, atmosphereEnabled: false, starsEnabled: false, lighting: { type: 'virtual' } };
  streets = new FeatureLayer({
    url: SERVICE, title: 'Recorded street grade · Seattle SDOT', outFields: FIELDS, definitionExpression: ROAD_WHERE,
    elevationInfo: { mode: 'on-the-ground' }, popupEnabled: false,
    renderer: {
      type: 'class-breaks', field: 'SLOPE_PCT', defaultSymbol: { type: 'simple-line', color: '#64727c', width: 1 }, defaultLabel: 'Unrecorded',
      classBreakInfos: [
        [0,4.999,'#5c929f',1,'0–<5%'], [5,9.999,'#91d2bd',1.3,'5–<10%'],
        [10,14.999,'#f0ce84',1.7,'10–<15%'], [15,19.999,'#ed9975',2.2,'15–<20%'], [20,100,'#de6a91',2.8,'20%+']
      ].map(([minValue,maxValue,color,width,label]) => ({ minValue,maxValue,label,symbol:{type:'simple-line',color,width} }))
    }
  });
  rankMarkers = new GraphicsLayer({ title: 'Ranked climbs', elevationInfo: { mode: 'relative-to-ground', offset: 7 }, popupEnabled: false });
  endpoints = new GraphicsLayer({ title: 'Profile endpoints A and B', elevationInfo: { mode: 'relative-to-ground', offset: 5 }, popupEnabled: false });
  scene.map.addMany([streets, rankMarkers, endpoints]);
  profile.profiles = [{ type: 'ground', color: '#90decf', title: 'Terrain elevation · A → B' }];
  await streets.load(); layerView = await scene.whenLayerView(streets);
  const extentQuery = streets.createQuery();
  extentQuery.outSpatialReference = { wkid: 4326 };
  const city = await streets.queryExtent(extentQuery);
  if (city.extent) await scene.goTo({ target: city.extent.expand(1.12), tilt: 35, heading: 0 }, { animate: false });
  const overview = scene.viewpoint.clone();
  $('overview').addEventListener('click', async () => {
    try { await scene.goTo(overview, { animate: !reducedMotion }); }
    catch (error) { if (error.name !== 'AbortError') console.warn(error); }
  });
  // Ranked circles give way to A/B labels when viewing an individual block.
  reactiveUtils.watch(() => scene.scale, (scale) => { rankMarkers.visible = scale > 18000; endpoints.visible = scale <= 18000; $('marker-status').textContent = scale > 18000 ? 'Numbered circles match the ranking · select a circle to explore' : 'A → B follows the terrain profile · City overview restores the ranked circles'; }, { initial: true });
  $('steep-only').addEventListener('calciteSwitchChange', () => { layerView.filter = $('steep-only').checked ? { where: 'SLOPE_PCT >= 15' } : null; });
  scene.addEventListener('arcgisViewClick', async (event) => {
    try {
      const hit = await scene.hitTest(event.detail, { include: [rankMarkers, streets] });
      const marker = hit.results.find((r) => r.type === 'graphic' && r.graphic.layer === rankMarkers)?.graphic;
      const street = hit.results.find((r) => r.type === 'graphic' && r.graphic.layer === streets)?.graphic;
      if (marker) await selectStreet(marker.attributes.streetId);
      else if (street) await selectStreet(street.attributes.OBJECTID);
    } catch (error) { console.warn('Street selection failed', error); }
  });
  $('scene-status').hidden = true;
  await loadRanking();
} catch (error) {
  errorMessage('scene-status', 'The 3D scene could not start. Check your connection and WebGL support, then reload.', error);
  $('ranking-status').textContent = 'Street ranking is unavailable until the scene starts.';
}


