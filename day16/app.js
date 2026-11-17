const byId = (id) => document.getElementById(id);
const map = byId("map");
const status = byId("map-status");
const routePicker = byId("route");
const details = byId("details");
const modeControls = [...document.querySelectorAll("[data-mode]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const modes = {
  bus: { label: "Bus", color: "#65c9ef", width: 1.55, opacity: 0.83, style: "solid" },
  rail: { label: "Rail", color: "#d5f88a", width: 3.3, opacity: 1, style: "solid" },
  ferry: { label: "Ferry", color: "#fff2ca", width: 2.4, opacity: 1, style: "dash" },
};
const bounds = {
  xmin: -122.551, ymin: 47.522, xmax: -122.236, ymax: 47.721,
  spatialReference: { wkid: 4326 },
};
const routeGraphics = new Map();
const modeLayers = new Map();
let Graphic;
let selected;
let highlight;
let openingExtent;
let hitRequest = 0;

function line(color, width, style = "solid") {
  return { type: "simple-line", color, width, style };
}

function routeName({ mode, name }) {
  return mode === "bus" && /^\d/.test(name) ? `Route ${name}` : name;
}

function fit(target) {
  map.goTo(target, { animate: !reducedMotion.matches }).catch((error) => {
    if (error.name !== "AbortError") console.warn(error);
  });
}

function selectRoute(id) {
  hitRequest++;
  selected = routeGraphics.get(id);
  routePicker.value = selected ? id : "";
  highlight.removeAll();
  details.hidden = !selected;
  byId("route-hint").hidden = Boolean(selected);
  for (const [mode, layer] of modeLayers) {
    layer.opacity = selected ? modes[mode].opacity * 0.32 : modes[mode].opacity;
  }
  if (!selected) return;

  const { geometry, attributes } = selected;
  const { mode, description, agency } = attributes;
  const symbol = modes[mode];
  highlight.addMany([
    new Graphic({ geometry, symbol: line("#10364a", symbol.width + 4) }),
    new Graphic({ geometry, symbol: line(symbol.color, symbol.width + 1.5, symbol.style) }),
  ]);
  byId("route-mode").textContent = symbol.label;
  byId("route-name").textContent = routeName(attributes);
  byId("route-info").textContent = [agency, description].filter(Boolean).join(" · ");
}

function updateRoutePicker() {
  const collator = new Intl.Collator("en", { numeric: true });
  const placeholder = new Option("Choose a route", "");
  routePicker.replaceChildren(placeholder);
  for (const [mode, layer] of modeLayers) {
    if (!layer.visible) continue;
    const group = document.createElement("optgroup");
    group.label = modes[mode].label;
    const routes = layer.graphics.toArray().sort((a, b) => (
      collator.compare(a.attributes.name, b.attributes.name) ||
      collator.compare(a.attributes.agency, b.attributes.agency)
    ));
    for (const { attributes } of routes) {
      const agency = mode === "ferry" ? ` · ${attributes.agency}` : "";
      group.append(new Option(routeName(attributes) + agency, attributes.id));
    }
    routePicker.append(group);
  }
  routePicker.value = selected?.attributes.id ?? "";
  routePicker.disabled = routePicker.options.length < 2;
}

async function fetchRoutes() {
  const response = await fetch(new URL("data/routes.geojson", import.meta.url), {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("The route snapshot could not be loaded.");
  return (await response.json()).features;
}

async function openMap() {
  const [[ArcGISMap, Basemap, VectorTileLayer, GraphicsLayer, GraphicClass, Extent], features] = await Promise.all([
    $arcgis.import([
      "@arcgis/core/Map.js", "@arcgis/core/Basemap.js", "@arcgis/core/layers/VectorTileLayer.js",
      "@arcgis/core/layers/GraphicsLayer.js", "@arcgis/core/Graphic.js",
      "@arcgis/core/geometry/Extent.js",
    ]),
    fetchRoutes(),
  ]);
  Graphic = GraphicClass;
  openingExtent = new Extent(bounds);
  const vectorBasemap = new VectorTileLayer({
    title: "Seattle, in Common",
    url: new URL("data/seattle-style.json", import.meta.url).href,
  });
  for (const [mode, symbol] of Object.entries(modes)) {
    modeLayers.set(mode, new GraphicsLayer({ title: symbol.label, opacity: symbol.opacity }));
  }
  highlight = new GraphicsLayer({ title: "Selected route", listMode: "hide" });
  for (const { id, properties, geometry } of features) {
    const symbol = modes[properties.mode];
    const graphic = new Graphic({
      attributes: { id, ...properties },
      geometry: { type: "polyline", paths: [geometry.coordinates], spatialReference: { wkid: 4326 } },
      symbol: line(symbol.color, symbol.width, symbol.style),
    });
    routeGraphics.set(id, graphic);
    modeLayers.get(properties.mode).add(graphic);
  }

  map.map = new ArcGISMap({
    basemap: new Basemap({ baseLayers: [vectorBasemap] }),
    layers: [...modeLayers.values(), highlight],
  });
  map.extent = openingExtent;
  await Promise.all([map.viewOnReady(), vectorBasemap.load()]);
  status.hidden = true;

  updateRoutePicker();
  byId("reset").disabled = false;
  for (const control of modeControls) {
    const layer = modeLayers.get(control.dataset.mode);
    document.querySelector(`[data-count="${control.dataset.mode}"]`).textContent = layer.graphics.length;
    control.checked = layer.visible;
    control.disabled = false;
    control.addEventListener("change", () => {
      hitRequest++;
      layer.visible = control.checked;
      if (!layer.visible && selected?.attributes.mode === control.dataset.mode) selectRoute("");
      updateRoutePicker();
    });
  }

  map.view.on("click", async (event) => {
    const request = ++hitRequest;
    try {
      const hits = await map.view.hitTest(event, { include: [...modeLayers.values()] });
      if (request !== hitRequest) return;
      const match = hits.results.find((result) => result.type === "graphic" && result.graphic.layer.visible);
      if (match) selectRoute(match.graphic.attributes.id);
    } catch (error) {
      console.warn(error);
    }
  });
}

routePicker.addEventListener("change", () => selectRoute(routePicker.value));
byId("clear").addEventListener("click", () => {
  selectRoute("");
  routePicker.focus();
});
byId("fit").addEventListener("click", () => {
  if (selected) fit(selected.geometry.extent.expand(1.25));
});
byId("reset").addEventListener("click", () => {
  selectRoute("");
  fit(openingExtent);
});

openMap().catch((error) => {
  console.error(error);
  status.textContent = "The transit map couldn’t load. Refresh to try again.";
});
