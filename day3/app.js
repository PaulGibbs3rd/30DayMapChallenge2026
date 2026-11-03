import { API, OFFICES, COLORS, STATES, validateFeed, racesFromFeed, stateSummary, filterRaces, callCounts, districtRaceKey, party, number, escapeHTML as esc } from './model.js';

const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('en-US').format(n);
const dateTime = value => { const d = new Date(value); return Number.isNaN(+d) ? 'Unavailable' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }); };
const feeds = Object.fromEntries(Object.keys(OFFICES).map(key => [key, { data: null, origin: 'pending', error: '', fetchedAt: null, busy: false }]));
const params = new URLSearchParams(location.hash.slice(1));
let office = Object.hasOwn(OFFICES, params.get('office')) ? params.get('office') : 'senate';
let selectedState = Object.hasOwn(STATES, params.get('state')) ? params.get('state') : '';
let selectedDistrict = office === 'house' && /^[a-z]{2}-(?:al|\d{2})$/.test(params.get('district') || '') && Object.hasOwn(STATES, params.get('district').slice(0,2).toUpperCase()) ? params.get('district') : '';
if (selectedDistrict) selectedState = selectedDistrict.slice(0,2).toUpperCase();
let layer, layerView, homeExtent, graphics = [], highlight, mapReady = false, pointerSequence = 0;
let districtLayer, districtLayerView, districtGraphics = [], districtLoading = false, districtError = '', FeatureLayerClass;
let districtOptions = '';
let mapHintContext = '';

for (const [abbr, name] of Object.entries(STATES).sort((a,b) => a[1].localeCompare(b[1]))) {
  const option = document.createElement('calcite-option'); option.value = abbr; option.textContent = name; $('state').append(option);
}

await Promise.all(['calcite-select', 'calcite-option', 'calcite-segmented-control', 'calcite-segmented-control-item', 'calcite-input-text', 'calcite-dialog', 'arcgis-map'].map(tag => customElements.whenDefined(tag)));
// Attributes are available before Calcite's lazy component hydration completes.
for (const item of $('office').children) item.checked = item.getAttribute('value') === office;
$('state').value = selectedState;
function shareState() { const p = new URLSearchParams({ office }); if (selectedState) p.set('state', selectedState); if (office === 'house' && selectedDistrict) p.set('district', selectedDistrict); history.replaceState(null, '', '#' + p); }
function getRaces() { return racesFromFeed(feeds[office].data, office); }
function currentFilter() { return { state: selectedState, district: office === 'house' ? selectedDistrict : '', search: $('search').value || '', filter: $('filter').value || 'all' }; }

function card(r) {
  const status = r.winner ? 'Called' : r.total === 0 ? 'Awaiting results' : r.color === 'TIE' ? 'Tied' : r.close ? 'Close race' : 'Leading';
  const candidates = r.sorted.map(c => {
    const votes = number(c.votes), percent = r.total ? votes / r.total * 100 : null;
    return `<div class="candidate"><div class="candidate-row"><span class="candidate-name">${esc(c.name)}<span class="party" style="color:${COLORS[party(c.party)]}">${esc(c.party || 'Other')}${c.incumbent === true ? ' · Inc.' : ''}${c.winner === true ? ' · ✓ Called' : ''}</span></span><span class="candidate-number">${percent === null ? '—' : percent.toFixed(1) + '%'}</span></div><div class="vote-track"><span style="width:${percent || 0}%;background:${COLORS[party(c.party)]}"></span></div><div class="votes">${fmt(votes)} votes</div></div>`;
  }).join('');
  return `<article class="race-card"><div class="race-card-head"><a class="race-link" href="#office=${office}&state=${r.state}${office === 'house' ? '&district=' + r.key : ''}" data-state="${r.state}"${office === 'house' ? ` data-district="${r.key}"` : ''}>${esc(r.name)}</a><span class="race-badge ${r.winner ? 'called' : r.close ? 'close' : ''}">${status}</span></div><div class="race-card-sub">${esc(STATES[r.state])} · ${r.winner ? esc(r.winner.name) + ' called by CivicAPI' : r.total === 0 ? 'No votes reported' : r.color === 'TIE' ? 'Top candidates tied' : esc(r.leader.name) + ' leads'}</div>${candidates || '<p class="empty">No candidate data supplied.</p>'}<div class="race-card-foot"><span class="reporting">${r.reporting === null ? 'Reporting unavailable' : r.reporting.toFixed(0) + '% reporting'}</span><a href="https://civicapi.org/results/elections/${r.id}" target="_blank" rel="noopener">Full source results ↗</a></div></article>`;
}

function render() {
  const f = feeds[office], races = getRaces(), filtered = filterRaces(races, currentFilter()), counts = callCounts(races);
  $('map-title').textContent = OFFICES[office].title;
  $('race-count').textContent = f.data ? `${fmt(races.length)} contests` : f.origin === 'pending' ? 'Loading contests…' : 'Feed unavailable';
  for (const [id, key] of [['dem-called','DEM'],['gop-called','GOP'],['other-called','OTHER'],['uncalled','uncalled']]) $(id).textContent = f.data ? fmt(counts[key]) : '—';
  $('seat-track').innerHTML = ['DEM','OTHER','uncalled','GOP'].map(k => `<span style="width:${races.length ? counts[k]/races.length*100 : 0}%;background:${COLORS[k] || '#3f4d60'}"></span>`).join('');
  $('map-note').textContent = office === 'house' ? 'District fill shows the leading candidate’s party. Select a district for its race. A lead is not a call.' : 'Fill shows the leading candidate’s party. A lead is not a call. Calls appear in the results panel.';
  $('boundary-notice').hidden = office !== 'house';
  $('boundary-caption').textContent = office === 'house' ? '119TH CONGRESS DISTRICTS · ESRI / US CENSUS' : 'STATE BOUNDARIES · US CENSUS / ESRI';
  $('district').hidden = office !== 'house';
  const hintContext = `${office}/${selectedState}/${selectedDistrict}`;
  if (hintContext !== mapHintContext) {
    $('hover').textContent = office === 'house' ? selectedDistrict ? `${selectedDistrict.toUpperCase()} selected · Choose another district on the map or in the list` : 'Choose a congressional district on the map or in the list' : 'Choose a state on the map or in the list';
    mapHintContext = hintContext;
  }
  const options = '<calcite-option value="">All districts</calcite-option>' + races.filter(r => !selectedState || r.state === selectedState).map(r => `<calcite-option value="${r.key}"${r.key === selectedDistrict ? ' selected' : ''}>${esc(r.name)}</calcite-option>`).join('');
  if (office === 'house' && options !== districtOptions) { $('district').innerHTML = options; districtOptions = options; }
  if (office === 'house') $('district').value = selectedDistrict;
  $('connection-dot').className = 'connection-dot ' + (f.origin === 'api' && !f.error ? 'connected' : f.error ? 'error' : '');
  $('connection-text').textContent = f.origin === 'pending' ? 'Connecting to CivicAPI' : !f.data ? 'Feed unavailable' : f.error ? f.origin === 'snapshot' ? 'Saved snapshot' : 'Refresh failed' : 'Connected to CivicAPI';
  const warnings = [];
  if (f.error) warnings.push(f.origin === 'snapshot' ? 'CivicAPI is unavailable. Showing a saved snapshot; these are not live returns.' : f.data ? 'Refresh failed. Showing the last successful fetch; results may be outdated.' : 'CivicAPI is unavailable and no saved data could be loaded. Use Refresh to try again.');
  if (f.data && races.length !== OFFICES[office].expected) warnings.push(`Provider coverage: ${races.length} contests (expected ${OFFICES[office].expected}).`);
  if (office === 'house' && districtError) warnings.push('Congressional boundaries are unavailable. Use the district selector or race list; Refresh retries the map.');
  if (office === 'house' && districtLayer && f.data) {
    const keys = new Set(districtGraphics.map(g => g.attributes.RACE_KEY));
    const unmatched = races.filter(r => !keys.has(r.key)).length;
    if (unmatched) warnings.push(`${unmatched} House races have no matching supplied district boundary.`);
  }
  if (f.data && races.every(r => r.total === 0)) warnings.push('Awaiting results. The source has not reported any votes for these contests.');
  if (f.data?.last_updated && Date.now() - Date.parse(f.data.last_updated) > 15 * 60 * 1000) warnings.push(`Source last updated ${dateTime(f.data.last_updated)}. A successful fetch does not mean new results.`);
  $('feed-alert').hidden = !warnings.length; $('feed-alert').textContent = warnings.join(' ');
  $('source-time').textContent = f.data ? 'Source updated ' + dateTime(f.data.last_updated) : 'Source update unavailable';
  $('fetch-time').textContent = f.fetchedAt ? `${f.origin === 'snapshot' ? 'Snapshot saved' : 'Last successful fetch'} ${dateTime(f.fetchedAt)} · Your local time` : 'No successful fetch yet';
  $('results-label').textContent = f.data ? `${fmt(filtered.length)} ${filtered.length === 1 ? 'race' : 'races'}${selectedState ? ' · ' + STATES[selectedState] : ' · all states'}` : f.origin === 'pending' ? 'Loading races…' : 'Results unavailable';
  // Preserve scroll position across timed updates and avoid replacing focused links.
  const content = filtered.map(card).join('') || `<p class="empty">${!f.data ? f.origin === 'pending' ? 'Connecting to the Election Day feed…' : 'Results are unavailable. Refresh to retry.' : selectedState && !races.some(r => r.state === selectedState) ? `No ${OFFICES[office].label.toLowerCase()} contest supplied for ${esc(STATES[selectedState])} in this feed.` : 'No races match these filters. Try another state, search, or race filter.'}</p>`;
  if ($('results').innerHTML !== content) {
    const scroll = $('results').scrollTop;
    const focused = document.activeElement;
    if (!$('results').contains(focused)) { $('results').innerHTML = content; $('results').scrollTop = scroll; }
  }
  $('results').setAttribute('aria-busy', String(f.busy));
  $('refresh').loading = f.busy;
  updateMap(races, filtered);
}

async function refresh(key, initial = false) {
  const f = feeds[key]; if (f.busy) return;
  f.busy = true; if (office === key) render();
  try {
    const response = await fetch(API + OFFICES[key].id, { signal: AbortSignal.timeout(18000), cache: 'no-store' });
    if (!response.ok) throw new Error(`CivicAPI HTTP ${response.status}`);
    f.data = validateFeed(await response.json(), key); f.origin = 'api'; f.error = ''; f.fetchedAt = new Date().toISOString();
  } catch (error) {
    f.error = error.message;
    if (initial && !f.data) {
      try {
        const response = await fetch(`./data/${key}.json`); if (!response.ok) throw new Error('No snapshot');
        const snapshot = await response.json();
        f.data = validateFeed(snapshot.data, key); f.fetchedAt = snapshot.fetchedAt; f.origin = 'snapshot';
      } catch { f.origin = 'unavailable'; }
    }
  } finally { f.busy = false; if (office === key) render(); }
}

function updateMap(races, filtered) {
  if (!layer) return;
  const house = office === 'house';
  layer.visible = !house;
  if (districtLayer) districtLayer.visible = house;
  if (house && mapReady && !districtLayer && !districtLoading && !districtError) loadDistricts();
  $('map').setAttribute('aria-label', house ? 'Select a congressional district to explore its House race' : 'Select a state to explore its election results');
  $('map-loading').hidden = mapReady && (!house || Boolean(districtLayer));
  if (house && !districtLayer) $('map-loading').textContent = districtError ? 'District map unavailable. Use the district selector or race list.' : 'Loading congressional districts…';
  const activeLayer = house ? districtLayer : layer;
  const features = house ? districtGraphics : graphics;
  const view = house ? districtLayerView : layerView;
  highlight?.remove(); highlight = null;
  if (!activeLayer) return;
  const byKey = new Map(races.map(r => [r.key, r]));
  activeLayer.renderer = { type: 'unique-value', field: house ? 'DISTRICTID' : 'STATE_ABBR', defaultSymbol: symbol(COLORS.ERROR), uniqueValueInfos: features.map(g => {
    const abbr = g.attributes.STATE_ABBR, key = g.attributes.RACE_KEY;
    const summary = !feeds[office].data ? { color: 'ERROR', text: 'Feed unavailable' } : house ? byKey.get(key) || { color: 'NONE', text: 'No contest in this feed' } : stateSummary(races.filter(r => r.state === abbr), office);
    return { value: house ? g.attributes.DISTRICTID : abbr, label: house ? key.toUpperCase() : STATES[abbr], symbol: symbol(COLORS[summary.color]) };
  }) };
  if (view) {
    const active = selectedState || selectedDistrict || $('search').value || $('filter').value !== 'all';
    const matching = new Set(filtered.map(r => house ? r.key : r.state));
    view.featureEffect = active ? { filter: { objectIds: features.filter(g => matching.has(house ? g.attributes.RACE_KEY : g.attributes.STATE_ABBR)).map(g => g.getObjectId()) }, excludedEffect: 'opacity(23%)' } : null;
    const selected = house ? features.filter(g => selectedDistrict ? g.attributes.RACE_KEY === selectedDistrict : g.attributes.STATE_ABBR === selectedState) : features.filter(g => g.attributes.STATE_ABBR === selectedState);
    if (selected.length) highlight = view.highlight(selected.map(g => g.getObjectId()));
  }
}

async function loadDistricts() {
  if (!mapReady || districtLayer || districtLoading) return;
  districtLoading = true; districtError = ''; render();
  try {
    const source = new FeatureLayerClass({ portalItem: { id: '2bdcd2410ac34b1c859025d49cacaf87' }, layerId: 0, definitionExpression: "STATE_ABBR <> 'DC'", outFields: ['OBJECTID','DISTRICTID','CDFIPS','STATE_ABBR'], popupEnabled: false, minScale: 0 });
    await source.load();
    const query = source.createQuery();
    query.where = "STATE_ABBR <> 'DC'";
    query.outFields = ['OBJECTID', 'DISTRICTID', 'CDFIPS', 'STATE_ABBR'];
    query.returnGeometry = false; // Let FeatureLayer stream geometry at the view's resolution.
    const response = await source.queryFeatures(query);
    if (response.exceededTransferLimit) throw new Error('District identifier response was truncated.');
    districtGraphics = response.features.filter(g => districtRaceKey(g.attributes));
    for (const g of districtGraphics) g.attributes.RACE_KEY = districtRaceKey(g.attributes);
    if (districtGraphics.length !== 435 || new Set(districtGraphics.map(g => g.attributes.RACE_KEY)).size !== 435) throw new Error('Expected 435 distinct voting district boundaries.');
    districtLayer = source;
    districtLayer.title = '119th Congress district boundaries · House results';
    districtLayer.visible = office === 'house';
    districtLayer.renderer = {type:'simple',symbol:symbol(COLORS.WAIT)};
    $('map').map.add(districtLayer);
    districtLayerView = await $('map').whenLayerView(districtLayer);
    if (office === 'house' && selectedDistrict) zoomDistrict(selectedDistrict);
  } catch (error) {
    districtError = error.message;
    if (districtLayer) $('map').map.remove(districtLayer);
    districtLayer = null; districtLayerView = null; districtGraphics = [];
    console.warn('Congressional boundaries unavailable:', error);
  }
  finally { districtLoading = false; render(); }
}
let districtZoomSequence = 0;
async function zoomDistrict(key) {
  const g = districtGraphics.find(g => g.attributes.RACE_KEY === key); if (!g || !districtLayer) return;
  const sequence = ++districtZoomSequence;
  try {
    const result = await districtLayer.queryExtent({objectIds:[g.getObjectId()],outSpatialReference:{wkid:102003}});
    if (result.extent && sequence === districtZoomSequence && office === 'house' && selectedDistrict === key) go(result.extent.expand(1.4));
  } catch (error) { console.warn('District zoom unavailable:',error); }
}
function selectDistrict(key, zoom = true) {
  selectedDistrict = key;
  if (key) { selectedState = key.slice(0,2).toUpperCase(); $('state').value = selectedState; }
  $('search').value = ''; $('filter').value = 'all';
  $('results').scrollTop = 0; shareState(); render();
  if (zoom && key) zoomDistrict(key); else if (zoom && selectedState) zoomState(selectedState);
}
function symbol(color) { return { type: 'simple-fill', color, outline: { color: '#9aaec5', width: .6 } }; }
function go(target) { if (mapReady) $('map').goTo(target, { duration: 550 }).catch(e => { if (e.name !== 'AbortError') console.warn('Map navigation failed', e); }); }
const home = { target: { xmin: -2500000, ymin: -1500000, xmax: 2350000, ymax: 1550000, spatialReference: { wkid: 102003 } } };
function zoomState(abbr) {
  // The service has already projected every polygon to Albers, so even Alaska's
  // antimeridian islands have a usable projected extent. Fit it at every size.
  const g = graphics.find(g => g.attributes.STATE_ABBR === abbr);
  if (g) go(g.geometry.extent.expand(1.3));
}
function selectState(abbr, zoom = true) { districtZoomSequence++; selectedDistrict = ''; selectedState = abbr; $('state').value = abbr; $('results').scrollTop = 0; shareState(); render(); if (zoom && abbr) zoomState(abbr); }

$('office').addEventListener('calciteSegmentedControlChange', () => { office = $('office').value; districtZoomSequence++; selectedDistrict = ''; $('results').scrollTop = 0; shareState(); render(); if (selectedState) zoomState(selectedState); if (!feeds[office].busy) refresh(office, !feeds[office].data); });
$('state').addEventListener('calciteSelectChange', () => selectState($('state').value));
$('district').addEventListener('calciteSelectChange', () => selectDistrict($('district').value));
$('search').addEventListener('calciteInputTextInput', render);
$('filter').addEventListener('calciteSelectChange', render);
$('clear').addEventListener('click', () => { $('search').value = ''; $('filter').value = 'all'; selectState('', false); go(homeExtent); });
$('results').addEventListener('click', event => { const link = event.target.closest('[data-state]'); if (link) { event.preventDefault(); if (link.dataset.district) selectDistrict(link.dataset.district); else selectState(link.dataset.state); } });
$('refresh').addEventListener('click', () => { refresh(office, !feeds[office].data); if (office === 'house' && districtError) loadDistricts(); });
$('about').addEventListener('click', () => { $('about-dialog').open = true; });
$('close-about').addEventListener('click', () => { $('about-dialog').open = false; });
$('home').addEventListener('click', () => { districtZoomSequence++; go(homeExtent); });
$('alaska').addEventListener('click', () => selectState('AK'));
$('hawaii').addEventListener('click', () => selectState('HI'));
setInterval(() => { if ($('auto').checked && !document.hidden) refresh(office, !feeds[office].data); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && $('auto').checked && (!feeds[office].fetchedAt || Date.now() - Date.parse(feeds[office].fetchedAt) > 60000)) refresh(office, !feeds[office].data); });
render();
// The independent feeds may fail separately; each retains its own provenance.
Promise.allSettled(Object.keys(OFFICES).map(key => refresh(key, true)));

try {
  const [Map, FeatureLayer, Extent] = await $arcgis.import(['@arcgis/core/Map.js', '@arcgis/core/layers/FeatureLayer.js', '@arcgis/core/geometry/Extent.js']);
  homeExtent = new Extent(home.target); FeatureLayerClass = FeatureLayer;
  const source = new FeatureLayer({ portalItem: { id: '1612d351695b467eba75fdf82c10884f' }, layerId: 0 });
  await source.load();
  const query = source.createQuery(); query.where = '1=1'; query.outFields = ['FID', 'NAME', 'STATE_ABBR']; query.returnGeometry = true; query.outSpatialReference = { wkid: 102003 };
  const response = await source.queryFeatures(query);
  graphics = response.features.filter(g => Object.hasOwn(STATES, g.attributes.STATE_ABBR));
  if (graphics.length !== 50) throw new Error(`Expected 50 state polygons, received ${graphics.length}.`);
  layer = new FeatureLayer({ source: graphics, objectIdField: 'FID', geometryType: 'polygon', spatialReference: { wkid: 102003 }, fields: [{ name: 'FID', type: 'oid' }, { name: 'NAME', type: 'string' }, { name: 'STATE_ABBR', type: 'string' }], title: 'Election Day state results', copyright: 'US Census Bureau / Esri · Educational use', popupEnabled: false, renderer: { type: 'simple', symbol: symbol(COLORS.WAIT) } });
  const mapElement = $('map'); mapElement.spatialReference = { wkid: 102003 }; mapElement.background = { color: [16,25,37,0] }; mapElement.map = new Map({ basemap: { baseLayers: [] }, layers: [layer] }); mapElement.extent = homeExtent;
  await mapElement.viewOnReady(); mapReady = true;
  mapElement.constraints = { minScale: 120000000, maxScale: 100000, rotationEnabled: false };
  layerView = await mapElement.whenLayerView(layer);
  $('map-loading').hidden = true; render(); if (selectedState) zoomState(selectedState);
  mapElement.addEventListener('arcgisViewClick', async event => { const clickedOffice = office; const hit = await mapElement.hitTest(event.detail, { include: [office === 'house' ? districtLayer : layer].filter(Boolean) }); if (clickedOffice !== office) return; const g = hit.results.find(r => r.graphic)?.graphic; if (g) { if (office === 'house') selectDistrict(districtRaceKey(g.attributes), false); else selectState(g.attributes.STATE_ABBR, false); } });
  mapElement.addEventListener('arcgisViewPointerMove', async event => {
    const sequence = ++pointerSequence, hoveredOffice = office;
    const hit = await mapElement.hitTest(event.detail, { include: [office === 'house' ? districtLayer : layer].filter(Boolean) }); if (sequence !== pointerSequence || hoveredOffice !== office) return;
    const g = hit.results.find(r => r.graphic)?.graphic;
    if (!g) { $('hover').textContent = office === 'house' ? 'Choose a congressional district on the map or in the list' : 'Choose a state on the map or in the list'; return; }
    const abbr = g.attributes.STATE_ABBR;
    if (office === 'house') {
      const key = districtRaceKey(g.attributes), r = getRaces().find(r => r.key === key);
      const status = !feeds.house.data ? 'Feed unavailable' : !r ? 'No contest in this feed' : r.winner ? r.winner.name + ' called by CivicAPI' : r.total === 0 ? 'Awaiting results' : r.color === 'TIE' ? 'Tied' : r.leader.name + ' leads (' + r.leader.party + ')';
      $('hover').textContent = key.toUpperCase() + ' · ' + STATES[abbr] + ' · ' + status; return;
    }
    const summary = feeds[office].data ? stateSummary(getRaces().filter(r => r.state === abbr), office) : { text: 'Feed unavailable' };
    $('hover').textContent = `${STATES[abbr]} · ${summary.text}`;
  });
} catch (error) {
  $('map-loading').textContent = 'Map unavailable. You can still explore every race in the state list.';
  console.error('State polygon map failed:', error);
}

