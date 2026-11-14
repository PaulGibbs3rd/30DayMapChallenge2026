const id = (name) => document.getElementById(name);
const stack = id("map-stack");
const lens = id("lens");
const overlay = id("wind-map");
const arrows = id("wind-arrows");
const timeline = id("timeline");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const stopButtons = [...document.querySelectorAll("[data-stop]")];
const storyNotes = [...document.querySelectorAll("[data-story-step]")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const dateLabel = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });
const timeLabel = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const playbackInterval = 1150;
const streamlineFadeDuration = 1000;

const stops = [
  { frame: 1, position: [-35, 6] },
  { frame: 2, position: [-48, 6] },
  { frame: 6, position: [-55, 2] },
];

let manifest, view, windView, media, extent, pointAt, createWindLayer, stageImage, waitForLayer;
let windLayer, aerosolElement, currentWind;
let mode = "lens";
let motion = !reducedMotion.matches;
let pendingFrame = 1;
let displayedFrame = null;
let frameController;
let loadingPlaybackFrame = false;
let timer = 0;
let playbackRun = 0;
let playing = false;
let lensPosition;
let dragOffset;

async function getJSON(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
  return response.json();
}

function mapStatus(message = "") {
  id("map-status").textContent = message;
  id("map-status").hidden = !message;
}

function windStatus(message = "") {
  id("wind-status").textContent = message;
  id("wind-status").hidden = !message;
}

async function loadMap() {
  const [
    Map, MapView, GeoJSONLayer, GraphicsLayer, Graphic, Extent, Point, MediaLayer,
    ImageElement, ExtentAndRotationGeoreference, ImageryTileLayer, PixelBlock,
    FlowRenderer, TileInfo, reactiveUtils,
  ] = await globalThis.$arcgis.import([
    "@arcgis/core/Map.js", "@arcgis/core/views/MapView.js",
    "@arcgis/core/layers/GeoJSONLayer.js", "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/Graphic.js", "@arcgis/core/geometry/Extent.js", "@arcgis/core/geometry/Point.js",
    "@arcgis/core/layers/MediaLayer.js", "@arcgis/core/layers/support/ImageElement.js",
    "@arcgis/core/layers/support/ExtentAndRotationGeoreference.js",
    "@arcgis/core/layers/ImageryTileLayer.js", "@arcgis/core/layers/support/PixelBlock.js",
    "@arcgis/core/renderers/FlowRenderer.js", "@arcgis/core/layers/support/TileInfo.js",
    "@arcgis/core/core/reactiveUtils.js",
  ]);
  manifest = await getJSON("data/manifest.json");
  const spatialReference = { wkid: manifest.crs };
  const [xmin, ymin, xmax, ymax] = manifest.bounds;
  extent = new Extent({ xmin, ymin, xmax, ymax, spatialReference });
  pointAt = (longitude, latitude) => new Point({ longitude, latitude });
  const land = new GeoJSONLayer({
    url: new URL("data/land.geojson", location.href).href,
    copyright: "Natural Earth",
    renderer: {
      type: "simple",
      symbol: { type: "simple-fill", color: "#343f3b", outline: { color: "#697b73", width: 0.65 } },
    },
  });
  media = new MediaLayer();
  const labels = new GraphicsLayer();
  const atto = { type: "point", longitude: -59.0056, latitude: -2.1459 };
  labels.add(new Graphic({
    geometry: atto,
    symbol: { type: "simple-marker", size: 7, color: "#ffe0a1", outline: { color: "#101f29", width: 1.5 } },
  }));
  for (const label of [
    { text: "SAHARA", lon: 0, lat: 24 },
    { text: "ATLANTIC OCEAN", lon: -29, lat: -11, size: 10, color: "#aebfc4" },
    { text: "AMAZON BASIN", lon: -62, lat: -9 },
    { text: "ATTO", lon: atto.longitude, lat: atto.latitude, size: 11, color: "#ffdb96", offset: 10 },
  ]) {
    labels.add(new Graphic({
      geometry: { type: "point", longitude: label.lon, latitude: label.lat },
      symbol: {
        type: "text", text: label.text, color: label.color ?? "#f4e9ce", yoffset: label.offset ?? 0,
        font: { family: "sans-serif", size: label.size ?? 13, weight: "bold" },
        haloColor: "#142127", haloSize: 1.5,
      },
    }));
  }

  // Both maps are basemap-free. Share the zoom levels so the wind raster's tile
  // pyramid cannot impose a different scale range on the overlay.
  const lods = TileInfo.create({ spatialReference }).lods;
  const settings = {
    spatialReference,
    ui: { components: [] },
    constraints: {
      lods,
      rotationEnabled: false,
      snapToZoom: false,
    },
  };
  view = new MapView({
    ...settings, container: "map", map: new Map({ layers: [land, media, labels] }),
    constraints: { ...settings.constraints, geometry: extent },
    background: { color: "#101f29" }, extent: openingExtent(),
  });
  await view.when();
  const updateOverviewLimit = () => {
    const width = stack.clientWidth;
    const height = stack.clientHeight;
    if (!width || !height) return;
    const overview = openingExtent();
    // Keep the padded flow request within one world, even on ultrawide screens.
    const resolution = Math.min(
      Math.max(overview.width / width, overview.height / height),
      extent.width * 2 / width,
    );
    const scale = resolution * lods[0].scale / lods[0].resolution;
    view.constraints.minScale = scale;
    if (windView) windView.constraints.minScale = scale;
  };
  updateOverviewLimit();
  const mediaView = await view.whenLayerView(media);
  waitForLayer = (layerView, signal) => reactiveUtils.whenOnce(() => !layerView.updating, { signal });
  try {
    windView = new MapView({
      ...settings, container: "wind-map", map: new Map(), viewpoint: view.viewpoint.clone(),
      constraints: { ...settings.constraints, minScale: view.constraints.minScale },
      background: { color: [0, 0, 0, 0] },
    });
    await windView.when();
  } catch (error) {
    windView?.destroy();
    windView = null;
    console.error(error);
  }
  new ResizeObserver(updateOverviewLimit).observe(stack);
  reactiveUtils.watch(
    () => [view.center?.x, view.center?.y, view.scale, view.width, view.height, windView?.width, windView?.height],
    () => {
      if (windView) windView.viewpoint = view.viewpoint.clone();
      positionLens();
      drawArrows();
    },
    { initial: true, sync: true },
  );

  stageImage = async (image, signal) => {
    const element = new ImageElement({
      image, opacity: 0, georeference: new ExtentAndRotationGeoreference({ extent }),
    });
    media.source.elements.add(element);
    try {
      await waitForLayer(mediaView, signal);
      return element;
    } catch (error) {
      media.source.elements.remove(element);
      throw error;
    }
  };
  createWindLayer = async ({ u, v }) => {
    const layer = new ImageryTileLayer({
      opacity: 0,
      source: {
        extent,
        dataType: "Vector-UV",
        pixelBlock: new PixelBlock({
          width: manifest.width, height: manifest.height, pixelType: "f32",
          pixels: [Float32Array.from(u), Float32Array.from(v)],
        }),
      },
      renderer: new FlowRenderer({
        // ArcGIS 5.2 preserves the direction of signed Vector-UV components in flow-from mode.
        color: [222, 246, 238, 0.95], density: 1.25, flowRepresentation: "flow-from",
        flowSpeed: 9, trailLength: 235, trailWidth: "1.4px", maxPathLength: 280,
      }),
    });
    try {
      await layer.load();
      if (layer.serviceRasterInfo?.dataType !== "vector-uv") throw new Error("The SDK did not recognize the in-memory vector raster.");
      return layer;
    } catch (error) {
      layer.destroy();
      throw error;
    }
  };
}

function openingExtent() {
  return extent.clone().expand(stack.clientWidth < 620 ? 0.94 : 0.86);
}

function setLensFromPoint([longitude, latitude]) {
  lensPosition = view.toScreen(pointAt(longitude, latitude));
  positionLens();
}

function positionLens() {
  const width = stack.clientWidth;
  const height = stack.clientHeight;
  const radius = Math.min(103, width * 0.22, height * 0.23);
  const position = lensPosition ?? { x: width * 0.52, y: height * 0.45 };
  const x = Math.round(Math.max(radius, Math.min(width - radius, position.x)));
  const y = Math.round(Math.max(radius, Math.min(height - radius, position.y)));
  lensPosition = { x, y };
  lens.style.left = `${x}px`;
  lens.style.top = `${y}px`;
  lens.style.width = lens.style.height = `${radius * 2}px`;
  const clip = mode === "lens" ? `circle(${radius}px at ${x}px ${y}px)` : "none";
  overlay.style.clipPath = arrows.style.clipPath = clip;
}

function drawArrows() {
  if (arrows.hidden || !currentWind || !view?.ready) return;
  const width = stack.clientWidth;
  const height = stack.clientHeight;
  const ratio = devicePixelRatio;
  arrows.width = Math.round(width * ratio);
  arrows.height = Math.round(height * ratio);
  const ctx = arrows.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.strokeStyle = "#e1f5e8";
  ctx.lineWidth = 1.1;
  ctx.lineCap = "round";
  const gridWidth = manifest.width;
  const gridHeight = manifest.height;
  const spacing = 32;
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      const point = view.toMap({ x, y });
      if (!point) continue;
      const row = Math.floor((extent.ymax - point.y) * gridHeight / extent.height);
      const col = Math.floor((point.x - extent.xmin) * gridWidth / extent.width);
      if (row < 0 || row >= gridHeight || col < 0 || col >= gridWidth) continue;
      const index = row * gridWidth + col;
      const u = currentWind.u[index];
      const v = currentWind.v[index];
      const speed = Math.hypot(u, v);
      if (speed < 0.5) continue;
      const length = Math.min(21, 6 + speed);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(-v, u));
      ctx.beginPath();
      ctx.moveTo(-length / 2, 0);
      ctx.lineTo(length / 2, 0);
      ctx.lineTo(length / 2 - 4, -3);
      ctx.moveTo(length / 2, 0);
      ctx.lineTo(length / 2 - 4, 3);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function refreshWind() {
  const visible = mode !== "dust" && !!currentWind;
  const animated = visible && motion && !!windLayer;
  overlay.style.visibility = animated ? "visible" : "hidden";
  overlay.style.opacity = animated ? "1" : "0";
  arrows.hidden = !visible || animated;
  lens.hidden = mode !== "lens";
  id("motion").setAttribute("aria-pressed", String(motion));
  modeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
  positionLens();
  drawArrows();
}

function updateTimeline() {
  timeline.value = pendingFrame;
  id("previous").disabled = pendingFrame <= 0;
  id("next").disabled = pendingFrame >= manifest.frames.length - 1;
  id("play").textContent = playing ? "Pause" : "Play";
  const stop = stageAt(displayedFrame ?? pendingFrame);
  stopButtons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === stop)));
  storyNotes.forEach((note, index) => { note.hidden = index !== stop; });
}

function stageAt(index) {
  return index < 2 ? 0 : index < 4 ? 1 : 2;
}

function stopPlayback() {
  playing = false;
  playbackRun++;
  clearTimeout(timer);
  if (loadingPlaybackFrame) {
    frameController.abort();
    loadingPlaybackFrame = false;
    pendingFrame = displayedFrame ?? pendingFrame;
    timeline.setAttribute("aria-valuetext", id("frame-date").textContent);
  }
  if (manifest) updateTimeline();
}

async function selectFrame(index, fromPlayback = false) {
  frameController?.abort();
  frameController = new AbortController();
  const { signal } = frameController;
  loadingPlaybackFrame = fromPlayback;
  pendingFrame = index;
  updateTimeline();
  const data = manifest.frames[index];
  const date = new Date(data.time);
  const label = dateLabel.format(date);
  timeline.setAttribute("aria-valuetext", label);
  if (!playing || displayedFrame === null) mapStatus(`Loading ${label}…`);
  const image = new Image();
  image.src = `data/${data.aerosol}`;
  const [aerosol, wind] = await Promise.allSettled([
    image.decode().then(() => signal.aborted ? null : stageImage(image, signal)),
    getJSON(`data/${data.wind}`, signal).then((grid) => stageWind(grid, signal)),
  ]);
  const nextAerosol = aerosol.status === "fulfilled" ? aerosol.value : null;
  const nextWind = wind.status === "fulfilled" ? wind.value : null;
  if (signal.aborted) {
    if (nextAerosol) media.source.elements.remove(nextAerosol);
    if (nextWind?.layer) discardWind(nextWind.layer);
    return;
  }

  // Commit the imagery, wind, and date together after the new layers are ready.
  if (aerosolElement) media.source.elements.remove(aerosolElement);
  if (windLayer) discardWind(windLayer);
  aerosolElement = nextAerosol;
  windLayer = nextWind?.layer;
  if (aerosolElement) aerosolElement.opacity = 1;
  if (windLayer) windLayer.opacity = 1;
  currentWind = nextWind?.grid;
  displayedFrame = index;
  loadingPlaybackFrame = false;
  id("frame-date").textContent = label;
  id("wind-time").textContent = `${manifest.windPressure} hPa wind at ${timeLabel.format(date)} UTC`;
  mapStatus(aerosolElement ? "" : `Satellite imagery unavailable for ${label}.`);
  const windMessage = currentWind
    ? windLayer ? "" : "Animated wind is unavailable. Showing wind arrows."
    : `Wind data unavailable for ${label}.`;
  windStatus(windMessage);
  updateTimeline();
  refreshWind();
}

async function stageWind(grid, signal) {
  if (!windView || signal.aborted) return { grid };
  let layer;
  try {
    layer = await createWindLayer(grid);
    if (signal.aborted) {
      layer.destroy();
      return { grid };
    }
    windView.map.add(layer);
    const layerView = await windView.whenLayerView(layer);
    await waitForLayer(layerView, signal);
    if (!layerView.suspended) {
      if (windLayer && motion && mode !== "dust") await waitForStreamlineFade(signal);
      return { grid, layer };
    }
  } catch (error) {
    if (!signal.aborted) console.error(error);
  }
  if (layer) discardWind(layer);
  return { grid };
}

function waitForStreamlineFade(signal) {
  // ArcGIS fades in each new streamline mesh for one second after it is built.
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timeout = setTimeout(finish, streamlineFadeDuration);
    signal.addEventListener("abort", finish, { once: true });
    function finish() {
      clearTimeout(timeout);
      signal.removeEventListener("abort", finish);
      resolve();
    }
  });
}

function discardWind(layer) {
  windView.map.remove(layer);
  layer.destroy();
}

function playNext(run) {
  if (run !== playbackRun) return;
  if (pendingFrame >= manifest.frames.length - 1) {
    stopPlayback();
    return;
  }
  // Count the hidden renderer's one-second fade toward the playback interval.
  const delay = motion && windLayer && mode !== "dust"
    ? playbackInterval - streamlineFadeDuration
    : playbackInterval;
  timer = setTimeout(async () => {
    await selectFrame(pendingFrame + 1, true);
    playNext(run);
  }, delay);
}

function moveLens(event, offset = { x: 0, y: 0 }) {
  const box = stack.getBoundingClientRect();
  lensPosition = { x: event.clientX - box.left - offset.x, y: event.clientY - box.top - offset.y };
  positionLens();
}

function bindControls() {
  for (const control of document.querySelectorAll("button[disabled], input[disabled]")) control.disabled = false;
  timeline.max = manifest.frames.length - 1;
  timeline.addEventListener("input", () => {
    const index = Number(timeline.value);
    stopPlayback();
    void selectFrame(index);
  });
  for (const [control, step] of [["previous", -1], ["next", 1]]) {
    id(control).addEventListener("click", () => {
      stopPlayback();
      void selectFrame(pendingFrame + step);
    });
  }
  id("play").addEventListener("click", async () => {
    if (playing) {
      stopPlayback();
      return;
    }
    playing = true;
    const run = ++playbackRun;
    updateTimeline();
    if (pendingFrame === manifest.frames.length - 1) await selectFrame(0, true);
    playNext(run);
  });
  id("motion").addEventListener("click", () => {
    motion = !motion;
    if (!motion) stopPlayback();
    refreshWind();
  });
  reducedMotion.addEventListener("change", () => {
    motion = !reducedMotion.matches;
    if (!motion) stopPlayback();
    refreshWind();
  });
  id("reset").addEventListener("click", () => {
    view.extent = openingExtent();
    setLensFromPoint(stops[stageAt(pendingFrame)].position);
  });
  for (const button of modeButtons) {
    button.addEventListener("click", () => {
      mode = button.dataset.mode;
      refreshWind();
    });
  }
  for (const [index, button] of stopButtons.entries()) {
    button.addEventListener("click", () => {
      stopPlayback();
      setLensFromPoint(stops[index].position);
      void selectFrame(stops[index].frame);
    });
  }
  lens.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const box = stack.getBoundingClientRect();
    dragOffset = { x: event.clientX - box.left - lensPosition.x, y: event.clientY - box.top - lensPosition.y };
    lens.setPointerCapture(event.pointerId);
  });
  lens.addEventListener("pointermove", (event) => {
    if (lens.hasPointerCapture(event.pointerId)) moveLens(event, dragOffset);
  });
  lens.addEventListener("keydown", (event) => {
    const delta = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[event.key];
    if (!delta) return;
    event.preventDefault();
    lensPosition.x += delta[0];
    lensPosition.y += delta[1];
    positionLens();
  });
  view.on("click", (event) => {
    if (mode !== "lens") return;
    lensPosition = { x: event.x, y: event.y };
    positionLens();
  });
}

async function start() {
  if (!globalThis.$arcgis && document.readyState !== "complete") {
    await new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
  }
  if (!globalThis.$arcgis) throw new Error("ArcGIS SDK loader unavailable.");
  await loadMap();
  bindControls();
  setLensFromPoint(stops[0].position);
  await selectFrame(stops[0].frame);
}

start().catch((error) => {
  mapStatus("The historical map could not load. Reload to try again.");
  console.error(error);
});
