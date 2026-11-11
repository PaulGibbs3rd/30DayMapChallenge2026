import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fly, initialPose, launchFrame, LIMITS, parseLaunch, STEP, stop } from './app/src/flight.ts';

const idle = { forward: 0, right: 0, yaw: 0, throttle: false, look: 0 };
const flat = () => 0;
function advance(pose, input, seconds, ground = flat) {
  for (let i = 0; i < Math.round(seconds / STEP); i++) pose = fly(pose, { ...idle, ...input }, ground);
  return pose;
}
const near = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} is not within ${tolerance} of ${b}`);

test('movement follows the compass and diagonal speed is capped', () => {
  const north = advance(initialPose(0, 0), { forward: 1 }, 3);
  const east = advance(initialPose(0, 90), { forward: 1 }, 3);
  const diagonal = advance(initialPose(0, 0), { forward: 1, right: 1 }, 3);
  near(north.east, 0); near(east.north, 0);
  near(north.north, east.east); near(Math.hypot(diagonal.east, diagonal.north), north.north);
  near(Math.hypot(diagonal.ve, diagonal.vn), LIMITS.speed);
});

test('releasing horizontal controls slows the drone and yaw and tilt still respond', () => {
  const active = advance(initialPose(0, 350), { forward: 1, throttle: true }, 2);
  const released = advance(active, {}, 1);
  near(released.vn, 0); near(released.ve, 0);
  const turned = advance(active, { yaw: 1, look: 1 }, 1);
  near(turned.heading, 80); near(turned.tilt, 90);
  assert.deepEqual(stop(active), { ...active, ve: 0, vn: 0, vz: 0 });
});

test('gravity accelerates the drone downward until the terrain floor stops it', () => {
  const launch = initialPose(0, 0);
  const falling = advance(launch, {}, .5);
  near(falling.vz, -9.81 * .5);
  assert.ok(falling.z < launch.z);

  const atClearance = advance(falling, {}, 3);
  near(atClearance.z, LIMITS.clearance);
  near(atClearance.vz, 0);
  assert.ok(advance(atClearance, { throttle: true }, .5).z > atClearance.z);
});

test('releasing climb retains upward momentum briefly before descent', () => {
  const climbing = advance(initialPose(0, 0), { throttle: true }, 1);
  const coasting = advance(climbing, {}, .25);
  assert.ok(coasting.z > climbing.z && coasting.vz > 0 && coasting.vz < climbing.vz);
  assert.ok(advance(coasting, {}, .75).vz < 0);
});

test('terrain clearance blocks a rise until the drone climbs, and zero is a valid sample', () => {
  const terrain = (_east, north) => north > 1 ? 25 : 0;
  const blocked = advance(initialPose(0, 0), { forward: 1 }, 3, terrain);
  assert.ok(blocked.north <= 1);
  near(blocked.z, LIMITS.clearance); near(blocked.ground, 0);
  const climbed = advance(blocked, { forward: 1, throttle: true }, 6, terrain);
  assert.ok(climbed.north > 1);
  near(climbed.ground, 25);
  assert.ok(climbed.z - climbed.ground >= LIMITS.clearance);
  assert.equal(fly(climbed, { ...idle, forward: 1 }, () => null), null);
});

test('horizontal flight continues uphill at minimum clearance on a gentle slope', () => {
  const atClearance = advance(initialPose(0, 0), {}, 3);
  const moving = advance(atClearance, { forward: 1 }, 1, (_east, north) => north * .15);
  assert.ok(moving.north > 5);
  near(moving.z - moving.ground, LIMITS.clearance);
});

test('flight radius blocks outward motion and allows retreat', () => {
  const rim = advance(initialPose(0, 0), { forward: 1 }, 60);
  near(rim.north, LIMITS.radius); near(rim.vn, 0);
  const back = advance(rim, { forward: -1 }, 2);
  assert.ok(back.north < LIMITS.radius - 10);
});

test('launch coordinates preserve axis order and local scale', () => {
  const launch = parseLaunch('-122.67177, 45.51698');
  const frame = launchFrame(...launch);
  const [lon, lat] = frame.lonLat(0, 0);
  near(lon, launch[0]); near(lat, launch[1]);
  const [east, north] = frame.lonLat(200, 200);
  assert.ok(east > lon && north > lat);
  near((north - lat) * Math.PI / 180 * 6378137, 200, .02);
  assert.throws(() => parseLaunch(' , 45.5'), /longitude,latitude/);
  assert.throws(() => launchFrame(180, 0), /edge/);
});
