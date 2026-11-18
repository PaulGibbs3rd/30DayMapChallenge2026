const MINUTE = 60_000;
const DAY = 1_440 * MINUTE;
const DEG = Math.PI / 180;
const LATITUDE = 47.602 * DEG;
const LONGITUDE = -122.332;

export const DEFAULT_BEARING = 65;

function angle180(angle) {
  return ((angle % 360 + 540) % 360) - 180;
}

function equatorialSun(time) {
  // US Naval Observatory, Computing Approximate Solar Coordinates.
  const days = (time - Date.UTC(2000, 0, 1, 12)) / DAY;
  const anomaly = (357.529 + 0.98560028 * days) * DEG;
  const meanLongitude = 280.459 + 0.98564736 * days;
  const longitude = (meanLongitude + 1.915 * Math.sin(anomaly) + 0.020 * Math.sin(2 * anomaly)) * DEG;
  const obliquity = (23.439 - 0.00000036 * days) * DEG;
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(longitude), Math.cos(longitude)) / DEG;
  return {
    declination: Math.asin(Math.sin(obliquity) * Math.sin(longitude)) / DEG,
    equationOfTime: 4 * angle180(meanLongitude - rightAscension),
  };
}

export function lightForBearing(bearing) {
  const azimuth = bearing * DEG;
  const declinationAt = (altitude) => Math.asin(
    Math.sin(LATITUDE) * Math.sin(altitude * DEG) +
    Math.cos(LATITUDE) * Math.cos(altitude * DEG) * Math.cos(azimuth),
  ) / DEG;

  // Keep the sun low. Near due south it must be higher, and near the ends
  // it must be lower, for the requested direction to occur in Seattle.
  let elevation = 14;
  while (declinationAt(elevation) < -23.2) elevation += 0.5;
  while (declinationAt(elevation) > 23.2) elevation -= 0.5;

  const altitude = elevation * DEG;
  const declination = declinationAt(elevation);
  const hourAngle = Math.atan2(
    -Math.sin(azimuth) * Math.cos(altitude),
    Math.cos(LATITUDE) * Math.sin(altitude) - Math.sin(LATITUDE) * Math.cos(altitude) * Math.cos(azimuth),
  ) / DEG;

  // Declination rises monotonically between the winter and summer solstices.
  let early = Date.UTC(2025, 11, 22);
  let late = Date.UTC(2026, 5, 20);
  while (late - early > MINUTE) {
    const middle = (early + late) / 2;
    if (equatorialSun(middle).declination < declination) early = middle;
    else late = middle;
  }
  const midnight = Math.round(((early + late) / 2) / DAY) * DAY;
  const meanSolarTime = midnight + (720 + 4 * (hourAngle - LONGITUDE)) * MINUTE;
  const date = new Date(meanSolarTime - equatorialSun(meanSolarTime).equationOfTime * MINUTE);
  return { date, elevation };
}

export function compassDirection(bearing) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(bearing / 45) % 8];
}

export function eclipseAt(progress) {
  const offset = progress / 50 - 1;
  const separation = Math.abs(offset);
  // Equal apparent disks, with center separation expressed in diameters.
  const coverage = 2 / Math.PI * (Math.acos(separation) - separation * Math.sqrt(1 - separation ** 2));
  return { offset, coverage };
}

export function projectSun(bearing, elevation, camera, width, height) {
  const azimuth = (bearing - camera.heading) * DEG;
  const altitude = elevation * DEG;
  const pitch = (camera.tilt - 90) * DEG;
  const right = Math.cos(altitude) * Math.sin(azimuth);
  const forward = Math.cos(altitude) * Math.cos(azimuth);
  const up = Math.sin(altitude);
  const depth = forward * Math.cos(pitch) + up * Math.sin(pitch);
  if (depth <= 0) return null;

  // ArcGIS Camera.fov spans the diagonal, so both axes share this focal length.
  const focalLength = Math.hypot(width, height) / (2 * Math.tan(camera.fov * DEG / 2));
  const screenUp = up * Math.cos(pitch) - forward * Math.sin(pitch);
  return {
    x: width / 2 + focalLength * right / depth,
    y: height / 2 - focalLength * screenUp / depth,
  };
}
