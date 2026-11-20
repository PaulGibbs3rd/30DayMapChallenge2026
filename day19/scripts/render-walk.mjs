import { readFile, writeFile } from "node:fs/promises";
import { areas, labels, lines, paperColor, previewPoint, previewSize, routeColor, stopStyle, waterColor } from "../cartography.js";

const readFeatures = async (name) => {
  const document = await readFile(new URL(name, import.meta.url), "utf8");
  return JSON.parse(document).features;
};
const [base, walk] = await Promise.all([
  readFeatures("../basemap.geojson"),
  readFeatures("../walk.geojson")
]);

const xy = (point) => point.map((value) => value.toFixed(1)).join(",");
const path = (points) => "M" + points.map((point) => xy(previewPoint(point))).join(" ");
const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const { width, height } = previewSize;
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="title description">`,
  '<title id="title">Follow Your Nose · Seattle scent walk</title>',
  '<desc id="description">Seven scent stops from Westlake through Pike Place Market and Pier 62 to Little Saigon. A dashed route segment marks the covered arcade. A flower symbol marks the flower tables.</desc>',
  `<rect width="${width}" height="${height}" fill="${waterColor}"/>`
];

for (const [kind, style] of Object.entries(areas)) {
  for (const feature of base.filter((item) => item.properties.kind === kind)) {
    const shape = feature.geometry.coordinates.map((ring) => path(ring) + "Z").join("");
    svg.push(`<path d="${shape}" fill="${style.fill}" stroke="${style.stroke ?? "none"}"/>`);
  }
}

for (const [kind, style] of Object.entries(lines)) {
  const feature = base.find((item) => item.properties.kind === kind);
  const shape = feature.geometry.coordinates.map(path).join("");
  svg.push(`<path d="${shape}" fill="none" stroke="${style.color}" stroke-width="${style.width * 1.45}" stroke-linecap="round"/>`);
}

const segments = walk.filter(({ geometry }) => geometry.type === "LineString");
for (const segment of segments) {
  svg.push(`<path d="${path(segment.geometry.coordinates)}" fill="none" stroke="${paperColor}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`);
}
for (const segment of segments) {
  const dash = segment.properties.kind === "covered" ? ' stroke-dasharray="3 10"' : "";
  svg.push(`<path d="${path(segment.geometry.coordinates)}" fill="none" stroke="${routeColor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"${dash}/>`);
}

for (const { geometry, properties } of walk.filter((item) => item.properties.kind === "label")) {
  const [x, y] = previewPoint(geometry.coordinates);
  const style = labels[properties.style];
  svg.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-family="${style.family}" font-size="${style.size * 1.5}" font-weight="${style.weight}" fill="${style.color}">${escape(properties.text)}</text>`);
}
for (const { geometry, properties } of walk.filter((item) => ["start", "stop"].includes(item.properties.kind))) {
  const point = geometry.coordinates;
  const { stop } = properties;
  const [x, y] = previewPoint(point, stop).map((number) => number.toFixed(1));
  if (!stop) {
    svg.push(`<circle cx="${x}" cy="${y}" r="8" fill="${paperColor}" stroke="${routeColor}" stroke-width="3"/>`);
    continue;
  }
  const style = stopStyle(stop);
  if (stop === 2 || stop === 3) {
    svg.push(`<path d="M${xy(previewPoint(point))} L${x},${y}" stroke="${routeColor}" stroke-width="3"/>`);
  }
  svg.push(`<circle cx="${x}" cy="${y}" r="17" fill="${style.fill}" stroke="${paperColor}" stroke-width="3"/>`);
  svg.push(`<text x="${x}" y="${Number(y) + 6}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="19" fill="${style.text}">${style.label}</text>`);
}

svg.push(
  '<rect x="30" y="30" width="320" height="91" rx="7" fill="#fff9eb" stroke="#cba88d"/>',
  '<text x="48" y="70" font-family="Trebuchet MS,Arial,sans-serif" font-weight="bold" font-size="30" fill="#a83d26">Follow your nose.</text>',
  '<text x="48" y="98" font-family="Arial,sans-serif" font-size="15" fill="#694e3f">Westlake to Little Saigon · Seattle</text>',
  '<rect x="975" y="30" width="315" height="402" rx="7" fill="#fff9eb" stroke="#cba88d"/>',
  '<text x="995" y="66" font-family="Trebuchet MS,Arial,sans-serif" font-weight="bold" font-size="24" fill="#36271e">Seven scent stops</text>'
);
for (const { properties } of walk.filter((item) => item.properties.kind === "stop")) {
  const style = stopStyle(properties.stop);
  const y = 96 + (properties.stop - 1) * 47;
  svg.push(
    `<circle cx="1008" cy="${y}" r="13" fill="${style.fill}"/>`,
    `<text x="1008" y="${y + 5}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="15" fill="${style.text}">${style.label}</text>`,
    `<text x="1032" y="${y}" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#4d3c3d">${escape(properties.name)}</text>`,
    `<text x="1032" y="${y + 17}" font-family="Arial,sans-serif" font-size="14" fill="#625348">${escape(properties.scent)}</text>`
  );
}
svg.push(
  '<g font-family="Arial,sans-serif" font-size="14" fill="#625348">',
  `<path d="M37 842h32" stroke="${routeColor}" stroke-width="5" stroke-linecap="round"/><text x="80" y="847">Walking route</text>`,
  `<path d="M37 869h32" stroke="${routeColor}" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round"/><text x="80" y="874">Covered arcade</text>`,
  '<a href="https://www.openstreetmap.org/copyright"><text x="1286" y="870" text-anchor="end">Map data © OpenStreetMap contributors · openstreetmap.org/copyright</text></a>',
  '</g>',
  '</svg>'
);
await writeFile(new URL("../walk-map.svg", import.meta.url), svg.join("\n") + "\n");
