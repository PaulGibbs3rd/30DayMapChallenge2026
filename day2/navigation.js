// Geographic calculations use WGS84 coordinates; elevations and distances are meters.
const R = 6371008.8;
const rad = (degrees) => degrees * Math.PI / 180;
const deg = (radians) => radians * 180 / Math.PI;
export function distance(a, b) {
  const p = rad(b[1] - a[1]), l = rad(b[0] - a[0]);
  const h = Math.sin(p / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(l / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function bearing(a, b) {
  const l = rad(b[0] - a[0]);
  return (deg(Math.atan2(Math.sin(l) * Math.cos(rad(b[1])),
    Math.cos(rad(a[1])) * Math.sin(rad(b[1])) - Math.sin(rad(a[1])) * Math.cos(rad(b[1])) * Math.cos(l))) + 360) % 360;
}
export function destination(point, heading, meters) {
  const a = meters / R, t = rad(heading), p = rad(point[1]), l = rad(point[0]);
  const q = Math.asin(Math.sin(p) * Math.cos(a) + Math.cos(p) * Math.sin(a) * Math.cos(t));
  return [deg(l + Math.atan2(Math.sin(t) * Math.sin(a) * Math.cos(p), Math.cos(a) - Math.sin(p) * Math.sin(q))), deg(q)];
}
// Interpolate by distance along the actual line rather than its bounding box.
export function midpoint(paths) {
  const pieces = [];
  for (const path of paths) for (let i = 1; i < path.length; i++) pieces.push([path[i-1], path[i], distance(path[i-1], path[i])]);
  const total = pieces.reduce((sum, p) => sum + p[2], 0);
  let remaining = total / 2;
  for (const [a, b, length] of pieces) {
    if (remaining <= length && length > 0) {
      const f = remaining / length;
      return { point: [a[0] + (b[0]-a[0])*f, a[1] + (b[1]-a[1])*f, Number.isFinite(a[2]) && Number.isFinite(b[2]) ? a[2] + (b[2]-a[2])*f : 0], length: total };
    }
    remaining -= length;
  }
  return { point: paths[0]?.[0], length: total };
}
export function orientTerrain(paths, noDataValue) {
  const copy = paths.map((path) => path.map((p) => [...p]));
  const points = copy.flat();
  const valid = (p) => Number.isFinite(p?.[2]) && p[2] !== noDataValue;
  if (copy.length !== 1 || points.length < 2 || !points.every(valid)) return { paths: copy, directed: false, reason: copy.length !== 1 ? 'Disconnected geometry; A/B follow source order.' : 'Terrain elevation unavailable; A/B follow source order.' };
  if (points.at(-1)[2] < points[0][2]) copy[0].reverse();
  const a = copy[0][0], b = copy[0].at(-1);
  if (distance(a, b) < 1 || b[2] - a[2] < 0.5) return { paths: copy, directed: false, reason: 'Endpoint elevations are similar; A/B do not imply an uphill direction.' };
  return { paths: copy, directed: true };
}

