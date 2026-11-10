export type Mode = 'people' | 'growth' | 'land';
export type Position = [number, number];
export interface Feature {
  type: 'Feature';
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] };
  properties: Record<string, string | number | null>;
}
export interface FeatureCollection { type: 'FeatureCollection'; features: Feature[] }
export interface Place { id: string; name: string; label: string; coordinate: Position; zoom: number; heading: string; description: string; }
export const places: Place[] = [
  { id: 'seattle', name: 'Seattle', label: 'The urban anchor', coordinate: [-122.3345, 47.6123], zoom: 12.5,
    heading: 'A skyline is only the beginning.', description: 'Seattle’s compact downtown blocks provide an urban anchor. Compare this surrounding Census tract with the valley at the same map scale: the contrast is visible in both the street pattern and the density figures.' },
  { id: 'redmond', name: 'Redmond', label: 'An Eastside city', coordinate: [-122.122, 47.674], zoom: 13,
    heading: 'Another center, across the lake.', description: 'The Eastside has urban centers of its own. Look at the density around downtown Redmond, then follow the Sammamish River north toward land designated for agriculture.' },
  { id: 'sammamish', name: 'Sammamish Valley', label: 'Working land at the edge', coordinate: [-122.137, 47.718], zoom: 13,
    heading: 'Working land, close to the city.', description: 'The Sammamish River Agricultural Production District places working land beside the Eastside’s urban fabric. Switch to Working land to see its designated footprint. A designation describes planning intent, not what every parcel grows.' },
  { id: 'ridge', name: 'Redmond Ridge', label: 'An urban pocket', coordinate: [-122.027, 47.695], zoom: 13,
    heading: 'The edge has islands of its own.', description: 'King County’s Bear Creek/Sammamish area includes the Redmond Ridge Urban Planned Development. Compare its mapped growth designation with the surrounding landscape: distance from Seattle alone cannot explain the pattern.' },
  { id: 'duvall', name: 'Duvall', label: 'A town beside the valley', coordinate: [-121.986, 47.742], zoom: 13,
    heading: 'A small city, a wider rural setting.', description: 'Duvall sits beside the Snoqualmie Valley. The county describes it as a city in a rural setting. Local planning language and Census urban/rural classification answer different questions; this map’s growth label comes from the county plan.' },
  { id: 'carnation', name: 'Carnation valley', label: 'Farms, river, and settlement', coordinate: [-121.921, 47.656], zoom: 12.5,
    heading: 'A valley with more than one job.', description: 'The Snoqualmie Valley is a working landscape. King County’s Fish, Farm & Flood effort balances the farm economy, salmon habitat, and flood risk. Look at the agricultural district alongside the small city of Carnation.' },
  { id: 'fallcity', name: 'Fall City', label: 'The valley continues', coordinate: [-121.887, 47.568], zoom: 12.5,
    heading: 'Country is a place people live.', description: 'Fall City adds another settlement to the valley’s patchwork. Compare its surrounding tract with Seattle’s, then look at the growth boundary. A tract’s average density does not describe every home, field, or street inside it.' },
];

// GeoJSON includes holes and disconnected polygons. Display geometry is
// generalized; the UI describes these lookups as mapped, not legal findings.
function inRing(point: Position, ring: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
export function contains(feature: Feature, point: Position): boolean {
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
  return polygons.some(rings => inRing(point, rings[0]) && !rings.slice(1).some(ring => inRing(point, ring)));
}
export function findFeature(data: FeatureCollection, point: Position): Feature | undefined {
  return data.features.find(feature => contains(feature, point));
}
export function density(population: number | null, land: number | null): number | null {
  return population !== null && Number.isFinite(population) && population >= 0 && land !== null && Number.isFinite(land) && land > 0 ? population / (land / 2589988.110336) : null;
}
export function parseCoordinate(input: string | null): Position | null {
  if (!input || !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(input)) return null;
  const [x, y] = input.split(',').map(Number);
  return x >= -180 && x <= 180 && y >= -90 && y <= 90 ? [x, y] : null;
}
export function getPlace(input: string | null, fallback: Place): Place {
  return places.find(place => place.id === input) ?? fallback;
}
export function formatDensity(value: number | null): string {
  return value === null ? 'Unavailable' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
