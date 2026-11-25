import {regions, routeFor} from "./catalog.js";

const SDK_URL = "https://js.arcgis.com/5.2/";
const spatialReference = {wkid: 3857};
const wgs84 = {wkid: 4326};
const water = "#142f3a";
const highlight = "#ffd079";

function loadSdk() {
  if (globalThis.$arcgis?.import) return Promise.resolve(globalThis.$arcgis);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = SDK_URL;
    const timeout = setTimeout(() => reject(new Error("ArcGIS CDN timed out")), 7000);
    script.addEventListener("load", () => {
      clearTimeout(timeout);
      if (globalThis.$arcgis?.import) resolve(globalThis.$arcgis);
      else reject(new Error("ArcGIS module loader is unavailable"));
    }, {once: true});
    script.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error("ArcGIS CDN is unavailable"));
    }, {once: true});
    document.head.append(script);
  });
}

function clockwise(ring) {
  let sum = 0;
  for (let index = 0; index < ring.length - 1; index++) {
    const [x, y] = ring[index];
    const [nextX, nextY] = ring[index + 1];
    sum += x * nextY - nextX * y;
  }
  return sum < 0;
}

function colorWithOpacity(hex, opacity) {
  return [...hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16)), opacity];
}

export async function startSdk({polygons, extent, land, outline, network, selection}) {
  const chart = document.querySelector("#arcgis-chart");
  const probe = document.createElement("canvas").getContext("webgl2");
  if (!probe) return null;
  probe.getExtension("WEBGL_lose_context")?.loseContext();

  const sdk = await loadSdk();
  const [ArcGISMap, GraphicsLayer, Graphic, Polygon, Polyline, Point, webMercatorUtils, reactiveUtils] = await sdk.import([
    "@arcgis/core/Map.js", "@arcgis/core/layers/GraphicsLayer.js", "@arcgis/core/Graphic.js",
    "@arcgis/core/geometry/Polygon.js", "@arcgis/core/geometry/Polyline.js", "@arcgis/core/geometry/Point.js",
    "@arcgis/core/geometry/support/webMercatorUtils.js", "@arcgis/core/core/reactiveUtils.js",
  ]);
  await customElements.whenDefined("arcgis-map");

  const project = webMercatorUtils.geographicToWebMercator;
  const shoreline = new GraphicsLayer({title: "Salish Sea shoreline"});
  const ferries = new GraphicsLayer({title: "Ferry crossings"});
  const terminals = new GraphicsLayer({title: "Ferry terminals"});
  const layers = [shoreline, ferries, terminals];
  const landSymbol = {type: "simple-fill", color: land, outline: {color: outline, width: .49}};
  for (const polygon of polygons) {
    const rings = polygon.map((ring, index) => clockwise(ring) === (index === 0) ? ring : ring.slice().reverse());
    shoreline.add(new Graphic({geometry: project(new Polygon({rings, spatialReference: wgs84})), symbol: landSymbol}));
  }

  const legs = Object.entries(network.legs).map(([id, path]) => {
    const route = routeFor(...id.split("-"));
    return {id, route: route.id, color: regions[route.region].color,
      geometry: project(new Polyline({paths: [path], spatialReference: wgs84}))};
  });
  const docks = Object.entries(network.terminals).map(([id, {point: [x, y]}]) => ({id,
    geometry: project(new Point({x, y, spatialReference: wgs84}))}));
  const suspended = project(new Polyline({paths: network.suspended, spatialReference: wgs84}));
  const line = (geometry, color, px, opacity, attributes, style = "solid") => new Graphic({geometry, attributes,
    symbol: {type: "simple-line", color: colorWithOpacity(color, opacity), width: `${px}px`, style, cap: "round", join: "round"}});

  function marker(geometry, color, px, fill, width, attributes) {
    return new Graphic({geometry, attributes, symbol: {type: "simple-marker", style: "circle", size: `${px}px`,
      color: fill, outline: {color, width: `${width}px`}}});
  }

  let lastSelection;
  function setSelection(state) {
    if (lastSelection === state) return;
    lastSelection = state;
    const crossings = [];
    if (state.sidney) crossings.push(line(suspended, "#c9cbc7", 1.7, .85, {}, "short-dash"));
    for (const activePass of [false, true]) for (const leg of legs) {
      const active = state.legs?.has(leg.id) ?? false;
      if (activePass !== active) continue;
      crossings.push(line(leg.geometry, water, active ? 6.5 : 4.8, active || !state.legs ? .83 : .4, {route: leg.route}));
      crossings.push(line(leg.geometry, active ? highlight : leg.color, active ? 3.6 : 2.2,
        active || !state.legs ? .94 : .45, {route: leg.route}));
    }
    const points = [];
    for (const {id, geometry} of docks) {
      if (id === "sidney" && !state.sidney) continue;
      const isOrigin = id === state.origin;
      const selected = state.docks?.has(id) ?? false;
      const color = id === "sidney" ? "#c9cbc7" : selected ? highlight : "#f0f4e9";
      const opacity = id !== "sidney" && state.docks && !selected ? .73 : 1;
      if (isOrigin) points.push(marker(geometry, highlight, 18, [0, 0, 0, 0], 1.4, {dock: id}));
      points.push(marker(geometry, colorWithOpacity(color, opacity), isOrigin ? 10.8 : selected ? 9.4 : 6.8,
        colorWithOpacity(isOrigin ? highlight : water, opacity), selected ? 2 : 1.55, {dock: id}));
    }
    ferries.removeAll();
    ferries.addMany(crossings);
    terminals.removeAll();
    terminals.addMany(points);
  }

  setSelection(selection);
  chart.spatialReference = spatialReference;
  chart.map = new ArcGISMap({layers});
  chart.extent = {...extent, spatialReference};
  await chart.viewOnReady();
  const view = chart.view;
  view.background = {color: water};
  view.constraints = {snapToZoom: false, rotationEnabled: false, minScale: 0, maxScale: 0};
  view.ui.components = [];
  view.extent = {...extent, spatialReference};
  await Promise.all(layers.map((layer) => view.whenLayerView(layer)));
  await reactiveUtils.whenOnce(() => !view.updating, {signal: AbortSignal.timeout(12000)});

  let lastExtent = extent;
  return {
    setSelection,
    setExtent(next) {
      if (Object.keys(next).every((key) => Math.abs(next[key] - lastExtent[key]) < .01)) return;
      lastExtent = next;
      view.extent = {...next, spatialReference};
    },
    async hit(x, y) {
      const {results} = await view.hitTest({x, y}, {include: [ferries, terminals]});
      const attributes = results.filter(({type}) => type === "graphic").map(({graphic}) => graphic.attributes);
      return attributes.find(({dock}) => dock && dock !== "sidney") ?? attributes.find(({route}) => route);
    },
  };
}
