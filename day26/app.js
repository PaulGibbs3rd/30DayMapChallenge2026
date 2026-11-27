import { clamp, imageNavigation, MAX_ZOOM, ZOOM_STEP } from "./navigation.js";

const byId = (id) => document.getElementById(id);
const buttons = [...document.querySelectorAll("[data-view]")];
const legendRows = [...document.querySelectorAll("[data-legend]")];
const fallback = byId("map-image");
const captions = {
  before: "Before dam removal. The dashed line marks the estimated high-water shoreline.",
  after: "After dam removal. The solid line marks the estimated high-water shoreline.",
  change: "The river mouth grew seaward. Smaller patches fell below high water between the two surveys.",
};

start().catch((error) => console.warn("The static Elwha map remains available.", error));

async function json(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Cannot load ${path} (${response.status})`);
  return response.json();
}

async function start() {
  const [survey, design] = await Promise.all([json("data/survey.json"), json("data/design.json")]);
  let selection = "change";
  const stage = document.querySelector(".map-stage");
  const surface = byId("map-fallback");
  const nav = byId("map-navigation");
  const zoomIn = nav.querySelector('[data-map-action="zoom-in"]');
  const zoomOut = nav.querySelector('[data-map-action="zoom-out"]');
  const scale = byId("map-scale");
  const mapWidth = survey.bounds[2] - survey.bounds[0];
  let camera = imageNavigation(surface, fallback, updateNavigation);

  function updateNavigation() {
    const { zoom, resolution = mapWidth / (stage.clientWidth * zoom) } = camera.frame;
    zoomIn.setAttribute("aria-disabled", String(zoom >= MAX_ZOOM - .001));
    zoomOut.setAttribute("aria-disabled", String(zoom <= 1.001));
    const distance = [1000, 500, 250, 100, 50, 25, 10, 5].find((value) => value / resolution <= 105);
    if (!distance) return;
    scale.textContent = `${distance} m`;
    scale.style.width = `${distance / resolution}px`;
    scale.hidden = false;
  }

  zoomIn.addEventListener("click", () => camera.zoomBy(ZOOM_STEP));
  zoomOut.addEventListener("click", () => camera.zoomBy(1 / ZOOM_STEP));
  nav.querySelector('[data-map-action="reset"]').addEventListener("click", () => camera.reset());
  new ResizeObserver(updateNavigation).observe(stage);
  nav.hidden = false;
  byId("map-help").hidden = false;
  byId("before-legend").textContent = `${survey.before.label} shoreline`;
  buttons.find((button) => button.dataset.view === "before").textContent = survey.before.label;
  byId("gain-value").textContent = `${(survey.gainSquareMeters / 10000).toFixed(1)} ha`;
  byId("loss-value").textContent = `${(survey.lossSquareMeters / 10000).toFixed(1)} ha`;

  function select(mode) {
    selection = mode;
    for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.view === mode));
    for (const row of legendRows) row.hidden = mode !== "change" && ![mode, "context"].includes(row.dataset.legend);
    byId("map-caption").textContent = captions[mode];
    fallback.src = `assets/map-${mode}.png`;
    fallback.alt = mode === "change"
      ? `Elwha River delta shoreline change from ${survey.before.label} to ${survey.after.label}. A bar grew seaward near the river mouth.`
      : `Estimated Elwha River delta high-water shoreline in ${survey[mode].label}.`;
    camera.select?.(mode);
  }

  for (const button of buttons) button.addEventListener("click", () => select(button.dataset.view));
  select(selection);
  byId("map-controls").hidden = false;

  try {
    const sdkCamera = await startSdk(survey, design);
    const transferFocus = document.activeElement === surface;
    await sdkCamera.restore(camera.frame);
    camera = sdkCamera;
    camera.select(selection);
    camera.watch(updateNavigation);
    if (transferFocus) camera.focus();
    // Keep the image description available to assistive technology in both renderers.
    surface.removeAttribute("tabindex");
    surface.classList.add("backdrop");
    updateNavigation();
  } catch (error) {
    console.info("Using the local Elwha survey images.", error.message);
  }
}

async function loadSdk() {
  if (globalThis.$arcgis?.import) return globalThis.$arcgis;
  const script = byId("arcgis-cdn");
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("ArcGIS CDN did not load")), 7000);
    script.addEventListener("load", () => {
      clearTimeout(timeout);
      if (globalThis.$arcgis?.import) resolve(globalThis.$arcgis);
      else reject(new Error("ArcGIS module loader is unavailable"));
    }, { once: true });
    script.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error("ArcGIS CDN is unavailable"));
    }, { once: true });
  });
}

async function startSdk(survey, design) {
  const probe = document.createElement("canvas").getContext("webgl2");
  if (!probe) throw new Error("WebGL 2 is unavailable");
  probe.getExtension("WEBGL_lose_context")?.loseContext();
  const sdk = await loadSdk();
  const [ArcGISMap, MapView, GeoJSONLayer, GraphicsLayer, Graphic, reactiveUtils] = await sdk.import([
    "@arcgis/core/Map.js", "@arcgis/core/views/MapView.js", "@arcgis/core/layers/GeoJSONLayer.js",
    "@arcgis/core/layers/GraphicsLayer.js", "@arcgis/core/Graphic.js", "@arcgis/core/core/reactiveUtils.js",
  ]);
  const spatialReference = { wkid: 32148 };
  const line = (color, width, style = "solid") => ({ type: "simple-line", color, width, style });
  const order = ["water-before", "water-after", "land-before", "land-after", "common", "gain", "loss", "shore-after", "shore-before"];
  const modeLayers = new Map();
  const layers = [];
  for (const kind of order) {
    const style = design.styles[kind];
    const isShore = kind.startsWith("shore-");
    const url = new URL(isShore ? "data/shorelines.geojson" : "data/areas.geojson", document.baseURI).href;
    const symbols = isShore
      ? [line(style.line, 1.35, style.style)]
      : [{ type: "simple-fill", color: style.fill ?? [0, 0, 0, 0],
        outline: style.line ? line(style.line, 0.7, style.style) : null }];
    if (style.casing) symbols.unshift(line(style.casing, 2.8));
    if (style.hatch) symbols.push({ type: "simple-fill", style: style.hatch, color: style.line, outline: null });
    const group = symbols.map((symbol) => new GeoJSONLayer({ url,
      definitionExpression: `kind = '${kind}'`, popupEnabled: false, visible: design.views.change.includes(kind),
      renderer: { type: "simple", symbol },
    }));
    modeLayers.set(kind, group);
    layers.push(...group);
  }

  const white = "#faf0d2";
  const labels = new GraphicsLayer({ title: "Map labels" });
  const addLabel = ({ text, point: [x, y], italic = false }, size = 10) => labels.add(new Graphic({
    geometry: { type: "point", x, y, spatialReference },
    symbol: { type: "text", text, color: white, haloColor: design.background, haloSize: 1,
      verticalAlignment: "middle", horizontalAlignment: "center",
      font: { family: "Arial", size, style: italic ? "italic" : "normal" } },
  }));
  for (const label of design.labels) addLabel(label);

  const container = byId("arcgis-map");
  container.inert = true;
  const [xmin, ymin, xmax, ymax] = survey.bounds;
  const overview = { type: "extent", xmin, ymin, xmax, ymax, spatialReference };
  const width = xmax - xmin;
  const height = ymax - ymin;
  // Match the SDK's 96 DPI conversion for a projection in meters.
  const scalePerResolution = 96 * 39.37;
  const fitResolution = (w, h) => Math.max(width / w, height / h);
  function levelsAt(fit) {
    return Array.from({ length: 6 }, (_, level) => {
      const resolution = fit * 2 ** (1 - level);
      return { level, resolution, scale: resolution * scalePerResolution };
    });
  }
  const view = new MapView({ container, map: new ArcGISMap({ layers: [...layers, labels] }),
    spatialReference, extent: overview,
    background: { color: design.background }, ui: { components: [] },
    constraints: { geometry: overview, lods: levelsAt(fitResolution(container.clientWidth, container.clientHeight)),
      snapToZoom: false, rotationEnabled: false },
  });
  const signal = AbortSignal.timeout(14000);
  const ready = async () => {
    await Promise.all([view.when(), ...layers.map((layer) => layer.load())]);
    await Promise.all(layers.filter((layer) => layer.visible).map((layer) => view.whenLayerView(layer)));
    await reactiveUtils.whenOnce(() => !view.updating, { signal });
  };
  try {
    await Promise.race([ready(),
      new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }))]);
  } catch (error) {
    view.destroy();
    throw error;
  }

  const overviewResolution = () => fitResolution(view.width, view.height);
  const overviewScale = () => overviewResolution() * scalePerResolution;
  let lastOverviewScale;
  function updateLimits() {
    if (!view.width || !view.height) return;
    const scale = overviewScale();
    const zoom = lastOverviewScale ? clamp(lastOverviewScale / view.scale, 1, MAX_ZOOM) : 1;
    view.constraints.lods = levelsAt(overviewResolution());
    // The SDK snaps its effective limits to LODs. Include the exact boundary levels.
    view.constraints.minScale = scale * 1.000001;
    view.constraints.maxScale = scale / MAX_ZOOM * .999999;
    view.scale = scale / zoom;
    lastOverviewScale = scale;
  }
  function position(x, y, scale) {
    return view.goTo({ target: { type: "point", x, y, spatialReference }, scale }, { animate: false })
      .catch((error) => {
        if (error.name !== "AbortError") throw error;
      });
  }
  function reset() {
    return position((xmin + xmax) / 2, (ymin + ymax) / 2, overviewScale());
  }
  updateLimits();
  await reset();
  reactiveUtils.watch(() => [view.width, view.height], updateLimits);
  view.on("key-down", (event) => {
    if (event.key !== "Home") return;
    event.stopPropagation();
    reset().catch(console.error);
  });
  container.inert = false;
  container.removeAttribute("aria-hidden");
  container.setAttribute("aria-describedby", "map-help");
  container.classList.add("ready");

  return {
    get frame() { return { zoom: clamp(overviewResolution() / view.resolution, 1, MAX_ZOOM), resolution: view.resolution }; },
    select(mode) {
      for (const [kind, group] of modeLayers) {
        const visible = design.views[mode].includes(kind);
        for (const layer of group) layer.visible = visible;
      }
    },
    restore({ x, y, zoom }) {
      if (zoom === 1) return;
      return position(xmin + x * width, ymax - y * height, overviewScale() / zoom);
    },
    zoomBy(factor) { view.scale = clamp(view.scale / factor, view.constraints.maxScale, view.constraints.minScale); },
    reset() { reset().catch(console.error); },
    watch(onChange) { reactiveUtils.watch(() => view.scale, onChange); },
    focus() { view.focus(); },
  };
}
