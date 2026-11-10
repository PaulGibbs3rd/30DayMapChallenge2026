import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const out = resolve(import.meta.dirname, '../data');
const base = 'https://services.arcgis.com/Ej0PsM5Aw677QF1W/arcgis/rest/services/';
const services = {
  growth: base + 'URBAN_GROWTH_AREA_328/FeatureServer/0',
  agriculture: base + 'AGRPDDST_AREA_203/FeatureServer/0',
  tracts: base + 'TRACTS20_SHORE_AREA_2885/FeatureServer/0',
  population: base + 'TRACTS20_PL94TOTALPOP_2897/FeatureServer/0',
};
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const body = await response.json();
  if (body.error) throw new Error(JSON.stringify(body.error));
  if (body.exceededTransferLimit) throw new Error('Incomplete data: transfer limit exceeded');
  return body;
}
async function query(url, params) {
  return get(url + '/query?' + new URLSearchParams({ where: '1=1', ...params }));
}
const datasets = await Promise.all([
  query(services.growth, { f: 'geojson', outFields: 'OBJECTID,UGASIDE,EDITDATE', outSR: '4326', geometryPrecision: '6', maxAllowableOffset: '0.00003' }),
  query(services.agriculture, { f: 'geojson', outFields: 'OBJECTID,NAME,EDITDATE', outSR: '4326', geometryPrecision: '6', maxAllowableOffset: '0.00003' }),
  query(services.tracts, { f: 'geojson', outFields: 'OBJECTID,GEO_ID_TRT,NAME20,ALAND20', outSR: '4326', geometryPrecision: '6', maxAllowableOffset: '0.00003' }),
  query(services.population, { f: 'json', outFields: 'GEOCODE,P0010001', returnGeometry: 'false' }),
]);
const [growth, agriculture, tracts, pop] = datasets;
const population = new Map(pop.features.map(f => [String(f.attributes.GEOCODE), f.attributes.P0010001]));
const seen = new Set();
for (const feature of tracts.features) {
  const p = feature.properties;
  const geoid = String(p.GEO_ID_TRT);
  if (seen.has(geoid)) throw new Error('Duplicate tract ' + geoid);
  seen.add(geoid);
  if (!population.has(geoid)) throw new Error('Missing population for ' + geoid);
  const total = population.get(geoid);
  const land = p.ALAND20;
  if (!Number.isFinite(total) || total < 0 || !Number.isFinite(land) || land < 0) throw new Error('Invalid measures ' + geoid);
  feature.properties = { OBJECTID: p.OBJECTID, geoid, name: 'Tract ' + p.NAME20, population: total, land_m2: land,
    density: land > 0 ? total / (land / 2589988.110336) : null };
}
const total = tracts.features.reduce((sum, f) => sum + f.properties.population, 0);
if (tracts.features.length !== 494 || total !== 2269675) throw new Error(`Unexpected King County coverage: ${tracts.features.length} tracts, population ${total}`);
await mkdir(out, { recursive: true });
const files = { 'growth.geojson': growth, 'agriculture.geojson': agriculture, 'tracts.geojson': tracts };
for (const [name, data] of Object.entries(files)) {
  await writeFile(resolve(out, name), JSON.stringify(data));
  console.log(`${name}: ${data.features.length} features, ${Buffer.byteLength(JSON.stringify(data))} bytes`);
}
await writeFile(resolve(out, 'sources.json'), JSON.stringify({ retrieved: new Date().toISOString(), services,
  censusYear: 2020, tractCount: tracts.features.length, population: total,
  density: '2020 total population / original Census ALAND20 in square miles; display geography water-clipped by King County and generalized at 0.00003 degrees; no clipped-area population estimates.',
  growthValues: [...new Set(growth.features.map(f => f.properties.UGASIDE))],
  districtNames: [...new Set(agriculture.features.map(f => f.properties.NAME))],
  attribution: 'King County GIS Center; U.S. Census Bureau. Planning designations are distinct from Census urban/rural classification.' }, null, 2));
console.log('Joined all tracts; 2020 King County population:', total);
