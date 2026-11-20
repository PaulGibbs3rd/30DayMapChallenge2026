import { areas, labels, lines, paperColor, routeColor, stopStyle, waterColor } from "./cartography.js";

const wgs84 = { wkid: 4326 };
const routeBounds = { xmin: -122.3477, ymin: 47.5955, xmax: -122.3127, ymax: 47.6128, spatialReference: wgs84 };
const wideOffsets = { 2: [7, 10], 3: [-13, -13] };
const narrowOffsets = { 2: [12, 9], 3: [-13, 11] };
const shortLabels = {
  "Pike Place Market": "Pike Place",
  "PIONEER SQUARE": "Pioneer Sq.",
  "CHINATOWN": "Chinatown",
  "LITTLE SAIGON": "Little Saigon",
  "Westlake": "Westlake",
  "Elliott Bay": "Elliott Bay",
  "Pier 62": "Pier 62"
};
const narrowLabelPositions = {
  "Pike Place Market": { xoffset: 51, yoffset: -23 },
  "Pier 62": { xoffset: 10, yoffset: -7 },
  "Elliott Bay": { xoffset: 8 }
};

export async function createMap(element, base, walk, onPick) {
  await customElements.whenDefined("arcgis-map");
  const [Map, Extent, Graphic, GraphicsLayer, { whenOnce }] = await globalThis.$arcgis.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/geometry/Extent.js",
    "@arcgis/core/Graphic.js",
    "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/core/reactiveUtils.js"
  ]);
  const layer = (title) => new GraphicsLayer({ title });
  const ground = layer("Seattle streets and shoreline");
  const route = layer("Walking route");
  const names = layer("Place labels");
  const pins = layer("Scent stops");
  const selected = layer("Selected scent stop");
  const extent = new Extent(routeBounds);
  const stops = walk.filter((feature) => feature.properties.kind === "stop");
  const placeNames = walk.filter((feature) => feature.properties.kind === "label");
  let compact;
  let selectedStop;
  let offsets = wideOffsets;
  const point = ([x, y]) => ({ type: "point", x, y, spatialReference: wgs84 });
  const line = (paths) => ({ type: "polyline", paths, spatialReference: wgs84 });
  const poly = (rings) => ({ type: "polygon", rings, spatialReference: wgs84 });

  for (const [kind, style] of Object.entries(areas)) {
    ground.addMany(base.filter((feature) => feature.properties.kind === kind).map(({ geometry }) => {
      return new Graphic({
        geometry: poly(geometry.coordinates),
        symbol: {
          type: "simple-fill", color: style.fill,
          outline: style.stroke ? { color: style.stroke, width: 0.65 } : { style: "none" }
        }
      });
    }));
  }
  for (const [kind, style] of Object.entries(lines)) {
    ground.add(new Graphic({
      geometry: line(base.find((feature) => feature.properties.kind === kind).geometry.coordinates),
      symbol: { type: "simple-line", color: style.color, width: style.width, cap: "round" }
    }));
  }

  const segments = walk.filter(({ geometry }) => geometry.type === "LineString");
  for (const { geometry } of segments) {
    route.add(new Graphic({
      geometry: line([geometry.coordinates]),
      symbol: { type: "simple-line", color: paperColor, width: 7, cap: "round", join: "round" }
    }));
  }
  for (const { geometry, properties } of segments) {
    route.add(new Graphic({
      geometry: line([geometry.coordinates]),
      symbol: {
        type: "simple-line", color: routeColor, width: 3.5, cap: "round", join: "round",
        style: properties.kind === "covered" ? "short-dot" : "solid"
      }
    }));
  }

  const label = (at, text, style, options = {}) => new Graphic({
    geometry: point(at),
    symbol: {
      type: "text", text, color: style.color,
      font: { family: style.family, size: style.size, weight: style.weight },
      ...options
    }
  });
  const marker = (at, color, size, outline, offsets = [0, 0], stop) => new Graphic({
    geometry: point(at),
    attributes: { stop },
    symbol: {
      type: "simple-marker", style: "circle", color, size, outline,
      xoffset: offsets[0], yoffset: offsets[1]
    }
  });
  const start = walk.find((feature) => feature.properties.kind === "start");

  function select(stop) {
    selectedStop = stop;
    const feature = stops.find((item) => item.properties.stop === stop);
    selected.removeAll();
    selected.add(marker(feature.geometry.coordinates, [0, 0, 0, 0], compact ? 24 : 26, {
      color: "#36271e", width: 1.75
    }, offsets[stop]));
  }

  function drawLabelsAndPins() {
    const useCompactLabels = element.clientWidth < 510;
    if (compact === useCompactLabels) return;
    compact = useCompactLabels;
    offsets = compact ? narrowOffsets : wideOffsets;
    names.removeAll();
    for (const { geometry, properties } of placeNames) {
      const text = compact ? shortLabels[properties.text] : properties.text;
      if (!text) continue;
      const style = labels[properties.style];
      names.add(label(geometry.coordinates, text, {
        ...style, size: compact ? style.size * 0.69 : style.size
      }, {
        haloColor: properties.style === "water" ? waterColor : areas.land.fill,
        haloSize: compact ? 0.45 : 0.75,
        ...(compact ? narrowLabelPositions[properties.text] : undefined)
      }));
    }
    pins.removeAll();
    pins.add(marker(start.geometry.coordinates, paperColor, compact ? 7 : 9, { color: routeColor, width: 1.8 }));
    for (const { geometry, properties: { stop } } of stops) {
      const position = geometry.coordinates;
      const style = stopStyle(stop);
      const [xoffset, yoffset] = offsets[stop] ?? [0, 0];
      if (stop in offsets) {
        pins.add(marker(position, routeColor, 4, { color: paperColor, width: 0.75 }));
      }
      pins.add(marker(position, style.fill, compact ? 16 : 19, {
        color: paperColor, width: 1.6
      }, [xoffset, yoffset], stop));
      pins.add(label(position, style.label, {
        color: style.text, family: "Arial", size: stop === 3 ? 12 : 10, weight: "bold"
      }, { xoffset, yoffset, verticalAlignment: "middle" }));
    }
    if (selectedStop) select(selectedStop);
  }

  drawLabelsAndPins();
  element.spatialReference = { wkid: 3857 };
  element.background = { color: waterColor };
  element.extent = extent;
  element.constraints = { rotationEnabled: false, snapToZoom: false, minScale: 58000, maxScale: 1700 };
  element.navigation = { actionMap: { mouseWheel: "none" }, browserTouchPanEnabled: false };
  element.map = new Map({ layers: [ground, route, names, pins, selected] });
  await element.viewOnReady();
  await whenOnce(() => !element.view.updating);
  new ResizeObserver(drawLabelsAndPins).observe(element);
  element.addEventListener("arcgisViewClick", async ({ detail }) => {
    const hit = await element.hitTest(detail, { include: pins }).catch(() => null);
    const match = hit?.results.find((item) => item.type === "graphic" && item.graphic.attributes?.stop);
    if (match) onPick(match.graphic.attributes.stop);
  });

  function move(target) {
    element.goTo(target, { animate: false }).catch((error) => {
      if (error.name !== "AbortError") console.warn("Could not move the route map", error);
    });
  }

  return {
    select,
    reset() {
      move(extent);
    },
    zoom(direction) {
      move({ scale: element.scale * (direction > 0 ? 0.67 : 1.5) });
    }
  };
}
