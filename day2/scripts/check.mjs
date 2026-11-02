import assert from 'node:assert/strict';
import { bearing, destination, distance, midpoint, orientTerrain } from '../navigation.js';

const downhill = [[[-122.35,47.6,80],[-122.35,47.601,40]]];
const result = orientTerrain(downhill, -9999);
assert.equal(result.directed, true);
assert.equal(result.paths[0][0][2], 40, 'A must be lower');
assert.equal(result.paths[0].at(-1)[2], 80, 'B must be higher');
assert.equal(downhill[0][0][2], 80, 'Do not mutate service geometries');
assert.equal(orientTerrain([[[-122,47,10],[-122,47.001,-9999]]], -9999).directed, false, 'No-data elevations cannot set uphill direction');
assert.equal(orientTerrain([[[-122,47,10],[-122,47.001,10.2]]], -9999).directed, false, 'Near-flat terrain has no reliable direction');
assert.equal(orientTerrain([...downhill,...downhill], -9999).directed, false, 'Do not join disconnected paths');
assert.equal(orientTerrain([[[-122,47],[-122,47.001]]], -9999).directed, false);
assert.equal(orientTerrain([[[-122,47,10],[-122,47,20]]], -9999).directed, false, 'Coincident endpoints have no heading');
assert.equal(bearing([0,0],[0,1]), 0);
assert.equal(bearing([0,0],[1,0]), 90);
assert.equal(bearing([0,0],[0,-1]), 180);
const start = [-122.35,47.6];
const north = destination(start,0,200);
assert(Math.abs(distance(start,north)-200)<0.001);
assert(Math.min(bearing(start,north),360-bearing(start,north))<0.001);
const route = [[[0,0,10],[0,0.001,20],[0.001,0.001,30]]];
const middle = midpoint(route);
assert(Math.abs(middle.point[0])<0.000001 && Math.abs(middle.point[1]-0.001)<0.000001, 'Marker follows the line bend, not the bounding-box center');
assert(Math.abs(middle.point[2]-20)<0.01);
assert(Math.abs(midpoint([[[0,0],[0,0.001]],[[1,1],[1,1.001]]]).length-222.39)<0.2, 'Multipart distance must not bridge gaps');
console.log('PASS: uphill direction, no-data/flat/multipart fallbacks, non-mutating reversal, geographic camera bearing and distance, along-line marker placement.');


