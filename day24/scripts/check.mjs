import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {patternLegs, routeFor, routes} from "../catalog.js";

const load = async (name) => JSON.parse(await readFile(new URL(`../data/${name}`, import.meta.url), "utf8"));
const [network, shoreline] = await Promise.all([load("network.json"), load("shoreline.geojson")]);
const {terminals, connections, legs, suspended} = network;
assert.equal(Object.keys(terminals).length - 1, 19);
assert.equal(Object.values(terminals).filter(({point}) => point.length === 2).length, 20);
assert.deepEqual(new Set(routes.flatMap(({docks}) => docks)), new Set(Object.keys(terminals).filter((id) => id !== "sidney")));
assert.ok(["Polygon", "MultiPolygon"].includes(shoreline.type));
assert.ok(suspended.some((path) => path.length > 10));

const pattern = (a, b) => connections.find(({from, to}) => from === a && to === b)?.via;
assert.deepEqual(connections.filter(({from}) => from === "7").map(({to}) => to).sort(), ["3", "4"]);
assert.deepEqual(pattern("1", "10"), [[], ["13"]]);
assert.deepEqual(pattern("9", "20"), [[], ["22"]]);
assert.deepEqual(pattern("9", "22"), [[], ["20"]]);

for (const {from, to, via} of connections) {
  assert.ok(routeFor(from, to), `Service area missing for ${from}–${to}`);
  assert.ok(terminals[from] && terminals[to] && from !== to);
  assert.ok(from !== "sidney" && to !== "sidney");
  for (const stops of via) {
    const order = [from, ...stops, to];
    assert.equal(new Set(order).size, order.length, `Repeated dock in ${order.join("–")}`);
    assert.ok(stops.every((dock) => routeFor(from, dock)?.id === routeFor(from, to).id));
    for (const id of patternLegs(order)) assert.ok(legs[id]?.length > 2, `Crossing missing for ${id}`);
  }
}

for (const [key, points] of Object.entries(legs)) {
  const [a, b] = key.split("-");
  assert.deepEqual(points[0], terminals[a].point);
  assert.deepEqual(points.at(-1), terminals[b].point);
}

console.log(`Day 24 verified ${connections.length} directed connections, ${Object.keys(legs).length} crossings, and all 19 terminals.`);
