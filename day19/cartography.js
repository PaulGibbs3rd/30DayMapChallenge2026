export const waterColor = "#cfe6de";
export const paperColor = "#fff9eb";
export const routeColor = "#a83d26";

export const areas = {
  land: { fill: "#f5e5cb" },
  park: { fill: "#dce5bf" },
  pier: { fill: "#e9cea8", stroke: "#ccaa85" },
  landmark: { fill: "#eacfac", stroke: "#ccaa85" }
};

export const lines = {
  street: { color: "#fffaf0", width: 1.25 },
  main: { color: "#fffaf0", width: 2 },
  rail: { color: "#ddd0b7", width: 1 },
  highway: { color: "#d4c6ae", width: 2 },
  walkway: { color: "#d3c6aa", width: 1 }
};

export const labels = {
  water: { color: "#3b6c60", size: 25, family: "Georgia", weight: "normal" },
  district: { color: "#695041", size: 12, family: "Arial", weight: "bold" },
  anchor: { color: "#812e1d", size: 13, family: "Arial", weight: "bold" },
  place: { color: "#664d3d", size: 10, family: "Arial", weight: "normal" }
};

export function stopStyle(stop) {
  if (stop === 3) return { fill: "#f5b9b6", text: "#702b36", label: "✿" };
  if (stop === 4) return { fill: "#285d50", text: paperColor, label: String(stop) };
  return { fill: stop > 4 ? "#744368" : routeColor, text: paperColor, label: String(stop) };
}

export const previewSize = { width: 1320, height: 900 };

export function previewPoint([lon, lat], stop) {
  const scale = 44000;
  const x = previewSize.width / 2 + (lon + 122.3302) * scale * Math.cos(47.6 * Math.PI / 180);
  const y = previewSize.height / 2 - (lat - 47.6036) * scale;
  if (stop === 2) return [x + 10, y - 17];
  if (stop === 3) return [x - 28, y + 23];
  return [x, y];
}
