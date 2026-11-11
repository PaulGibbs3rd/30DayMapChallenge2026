export const LIMITS = {
  radius: 750, clearance: 3, launchHeight: 8, speed: 32, verticalSpeed: 6,
  yawRate: 90, tiltRate: 45, minTilt: 55, maxTilt: 90, launchTilt: 82,
} as const;

export const STEP = 1 / 60;
const GRAVITY = 9.81; // m/s²
const MAX_CLEARANCE_SLOPE = 0.6; // Vertical meters per horizontal meter.
const WGS84_RADIUS = 6378137;
const RAD = Math.PI / 180;
const MERCATOR_EDGE = Math.PI * WGS84_RADIUS;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));
const bearing = (degrees: number) => (degrees % 360 + 360) % 360;
const mercatorY = (lat: number) => WGS84_RADIUS * Math.asinh(Math.tan(lat * RAD));
const latitude = (y: number) => Math.atan(Math.sinh(y / WGS84_RADIUS)) / RAD;

export function launchFrame(longitude: number, lat: number) {
  if (!Number.isFinite(longitude) || !Number.isFinite(lat) || Math.abs(longitude) > 180 || Math.abs(lat) > 85) {
    throw new Error('Choose a launch point within 85° of the equator.');
  }
  const x = WGS84_RADIUS * longitude * RAD, y = mercatorY(lat);
  const scale = Math.cos(lat * RAD);
  const radius = (LIMITS.radius + 12) / scale;
  if (Math.abs(x) + radius >= MERCATOR_EDGE || Math.abs(y) + radius >= MERCATOR_EDGE) {
    throw new Error('Choose a launch point farther from the edge of the Web Mercator grid.');
  }
  const mercator = (east: number, north: number) => [x + east / scale, y + north / scale] as const;
  const lonLat = (east: number, north: number) => {
    const [px, py] = mercator(east, north);
    return [px / WGS84_RADIUS / RAD, latitude(py)] as const;
  };
  return { mercator, lonLat, radius };
}

export function parseLaunch(value: string) {
  const parts = value.split(',').map((part) => part.trim());
  if (parts.length !== 2 || parts.some((part) => !/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(part))) {
    throw new Error('Launch position must be longitude,latitude in decimal degrees.');
  }
  return [Number(parts[0]), Number(parts[1])] as const;
}

export interface Pose {
  east: number;
  north: number;
  z: number;
  ground: number;
  heading: number;
  tilt: number;
  ve: number;
  vn: number;
  vz: number;
}

export interface FlightInput { forward: number; right: number; yaw: number; throttle: boolean; look: number }

export function initialPose(ground: number, heading: number): Pose {
  return { east: 0, north: 0, z: ground + LIMITS.launchHeight, ground, heading: bearing(heading), tilt: LIMITS.launchTilt, ve: 0, vn: 0, vz: 0 };
}

export function stop(pose: Pose) {
  return { ...pose, ve: 0, vn: 0, vz: 0 };
}

export function fly(p: Pose, input: FlightInput, groundAt: (east: number, north: number) => number | null): Pose | null {
  const heading = bearing(p.heading + input.yaw * LIMITS.yawRate * STEP);
  const tilt = clamp(p.tilt + input.look * LIMITS.tiltRate * STEP, LIMITS.minTilt, LIMITS.maxTilt);

  const [s, c] = [Math.sin(heading * RAD), Math.cos(heading * RAD)];
  const speed = LIMITS.speed / Math.max(1, Math.hypot(input.forward, input.right));
  const de = (input.forward * s + input.right * c) * speed - p.ve;
  const dn = (input.forward * c - input.right * s) * speed - p.vn;
  const horizontalAcceleration = input.forward || input.right ? 22 : 42;
  const gain = Math.min(1, horizontalAcceleration * STEP / (Math.hypot(de, dn) || 1));
  let ve = p.ve + gain * de, vn = p.vn + gain * dn;
  const verticalAcceleration = input.throttle ? 10 : -GRAVITY;
  let vz = clamp(p.vz + verticalAcceleration * STEP, -LIMITS.verticalSpeed, LIMITS.verticalSpeed);
  let east = p.east + ve * STEP, north = p.north + vn * STEP, z = p.z + vz * STEP;

  if (Math.hypot(east, north) > LIMITS.radius) {
    // Remove only the outward component. Project the tangential step onto the circle.
    const radius = Math.hypot(east, north);
    const ue = east / radius, un = north / radius;
    const outward = Math.max(0, ve * ue + vn * un);
    ve -= outward * ue;
    vn -= outward * un;
    east = ue * LIMITS.radius;
    north = un * LIMITS.radius;
  }

  let ground = p.ground;
  if (east !== p.east || north !== p.north) {
    const next = groundAt(east, north);
    if (next === null || !Number.isFinite(next)) return null;
    const horizontalDistance = Math.hypot(east - p.east, north - p.north);
    if (z < next + LIMITS.clearance && next - p.ground > horizontalDistance * MAX_CLEARANCE_SLOPE) {
      [east, north, ve, vn] = [p.east, p.north, 0, 0];
    } else {
      ground = next;
    }
  }
  // Follow gentle slopes at minimum clearance without stalling lateral flight.
  if (z <= ground + LIMITS.clearance) {
    z = ground + LIMITS.clearance;
    vz = Math.max(0, vz);
  }
  return { east, north, z, ground, heading, tilt, ve, vn, vz };
}
