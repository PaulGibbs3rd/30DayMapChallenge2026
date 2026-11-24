import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compareCoffees, filterCoffees, flavors, jasminePair } from "../catalog.js";

const file = new URL("../data/coffees.geojson", import.meta.url);
const data = JSON.parse(await readFile(file, "utf8"));
assert.equal(data.type, "FeatureCollection");
assert.equal(data.features.length, 15);

const flavorIds = new Set(flavors.map(({ id }) => id));
const byId = new Map();
const requiredText = ["region", "country", "coffee", "process", "species", "sourceName", "locationType", "locationNote"];
for (const coffee of data.features) {
  const { id, geometry, properties } = coffee;
  assert.match(id, /^[a-z-]+$/);
  assert(!byId.has(id), `Duplicate coffee ID ${id}`);
  byId.set(id, coffee);
  assert.equal(coffee.type, "Feature", id);
  assert.equal(geometry.type, "Point", id);
  assert.equal(geometry.coordinates.length, 2, id);
  const [longitude, latitude] = geometry.coordinates;
  assert(Number.isFinite(longitude) && Math.abs(longitude) <= 180, `${id} longitude`);
  assert(Number.isFinite(latitude) && Math.abs(latitude) <= 90, `${id} latitude`);
  for (const field of requiredText) {
    assert(typeof properties[field] === "string" && properties[field].trim(), `${id} ${field}`);
  }
  for (const field of ["sourceUrl", "locationUrl"]) {
    assert.equal(new URL(properties[field]).protocol, "https:", `${id} ${field}`);
  }
  assert.match(properties.accessed, /^\d{4}-\d{2}-\d{2}$/, `${id} source access date`);
  assert(properties.notes.length && properties.notes.every((note) => typeof note === "string" && note.trim()), `${id} tasting notes`);
  assert(properties.flavors.length && properties.flavors.every((flavor) => flavorIds.has(flavor)), `${id} flavor families`);
}

const [yirgacheffe, boquete] = jasminePair.map((id) => byId.get(id));
assert.deepEqual(compareCoffees(yirgacheffe, boquete).notes, ["Jasmine"]);
assert.deepEqual(compareCoffees(yirgacheffe, boquete).families.map(({ id }) => id), ["floral", "other-fruit"]);
assert(filterCoffees(data.features, "floral").includes(boquete));
assert(filterCoffees(data.features, "floral").includes(yirgacheffe));
assert(filterCoffees(data.features, "other-fruit").includes(byId.get("daklak")));
const kona = byId.get("kona");
assert.equal(kona.properties.region, "Kona, Hawaiʻi");
assert(filterCoffees(data.features, "caramel").includes(kona));
assert(filterCoffees(data.features, "spice").includes(kona));
assert.equal(byId.get("kannur").properties.locationType, "Processing location");
console.log("Validated Day 23 coffee profiles, coordinates, source links, flavor filters, and the jasmine flight.");
