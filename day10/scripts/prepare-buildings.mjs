import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = 'https://www.portlandmaps.com/od/rest/services/COP_OpenData_Property/MapServer/184';
// Covers the 750 m flight circle and the downtown skyline behind it.
const bounds = '-122.685,45.507,-122.658,45.527';
const query = {
  where: 'AVG_HEIGHT > 0', geometry: bounds, geometryType: 'esriGeometryEnvelope',
  inSR: '4326', spatialRel: 'esriSpatialRelIntersects',
};
const copyright = 'City of Portland, Bureau of Planning and Sustainability';

async function get(params) {
  const response = await fetch(`${source}/query?${new URLSearchParams({ ...query, ...params })}`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Portland query returned HTTP ${response.status}`);
  const result = await response.json();
  if (result.error) throw new Error(`Portland query failed: ${result.error.message} ${result.error.details?.join('; ') ?? ''}`);
  return result;
}

const { count } = await get({ f: 'json', returnCountOnly: 'true' });
if (!Number.isSafeInteger(count) || count < 100 || count > 8000) throw new Error(`Unexpected footprint count: ${count}`);
const features = [];
for (let offset = 0; offset < count; offset += 500) {
  const result = await get({
    f: 'geojson', outFields: 'OBJECTID,AVG_HEIGHT', outSR: '4326', returnZ: 'false',
    orderByFields: 'OBJECTID ASC', resultOffset: String(offset), resultRecordCount: '500', geometryPrecision: '6',
  });
  if (result.features?.length !== Math.min(500, count - offset)) throw new Error(`Incomplete result at offset ${offset}`);
  for (const { geometry, properties } of result.features) {
    if (!['Polygon', 'MultiPolygon'].includes(geometry?.type) || !Number.isFinite(properties.AVG_HEIGHT) || properties.AVG_HEIGHT <= 0) {
      throw new Error(`Invalid footprint ${properties.OBJECTID}`);
    }
    features.push({ type: 'Feature', geometry, properties: { objectId: properties.OBJECTID, heightM: Math.round(properties.AVG_HEIGHT * (1200 / 3937) * 100) / 100 } });
  }
}
if (new Set(features.map((f) => f.properties.objectId)).size !== count) throw new Error('Duplicate footprints returned');
const data = resolve(import.meta.dirname, '../data');
const bundleInput = resolve(import.meta.dirname, 'app/data');
await mkdir(data, { recursive: true });
await mkdir(bundleInput, { recursive: true });
await writeFile(resolve(bundleInput, 'portland-buildings.geojson'), `${JSON.stringify({ type: 'FeatureCollection', features })}\n`);
await writeFile(resolve(data, 'sources.json'), `${JSON.stringify({
  source, copyright, metadata: 'https://www.portlandmaps.com/metadata/index.cfm?action=DisplayLayer&LayerID=52412',
  bounds: bounds.split(',').map(Number), features: count,
  filter: query.where, sourceHeightField: 'AVG_HEIGHT', sourceHeightUnit: 'US survey feet', outputHeightUnit: 'meters',
  retrieved: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date()),
}, null, 2)}\n`);
console.log(`Prepared ${count} Portland building footprints.`);
