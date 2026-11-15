import { baseUrl, groups, imagerySources, layers } from "./layers.js";

const stops = {
  city: { center: [-122.331, 47.605], scale: 95000 },
  square: { center: [-122.335, 47.60155], scale: 3500 },
  howe: { center: [-122.3212, 47.63596], scale: 3500 },
};
const denseScale = 2300;
const maxParallelLoads = 5;
const map = document.querySelector("#map");
const stopsButtons = [...document.querySelectorAll("[data-stop]")];
const allButton = document.querySelector("#all-layers");
const aerialButton = document.querySelector("#aerial");
const layerGroups = document.querySelector("#layer-groups");
const inspection = document.querySelector("#inspection");
const inspectionBody = document.querySelector("#inspection-body");
const closeInspection = document.querySelector("#close-inspection");
const mapMessage = document.querySelector("#map-message");
const layerStatus = document.querySelector("#layer-status");
const mapSource = document.querySelector("#map-source");
const scaleText = document.querySelector("#scale");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const smallScreen = matchMedia("(max-width: 650px)");
const enabled = new Set(groups.map(({ id }) => id));
const groupInputs = new Map();
const entries = layers.map((definition) => ({ definition, state: "idle" }));
const entriesByLayer = new Map();
let fullDetail = false;
let sdkReady = false;
let activeLoads = 0;
let inspectRequest = 0;
let activeHighlight;

const make = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

function sourceLink(definition, title = definition.title) {
  const link = make("a", title);
  link.href = definition.source;
  link.target = "_blank";
  link.rel = "noopener";
  return link;
}

function buildLayerList() {
  document.querySelector("#layer-total").textContent = `${entries.length} sources`;
  document.querySelector("#layer-panel").open = !smallScreen.matches;
  for (const group of groups) {
    const section = make("section", "", "layer-group");
    const label = make("label");
    const input = make("input");
    input.type = "checkbox";
    input.checked = true;
    input.disabled = true;
    groupInputs.set(group.id, input);
    const swatch = make("span", "", "swatch");
    swatch.style.setProperty("--swatch", group.color);
    swatch.setAttribute("aria-hidden", "true");
    label.append(input, swatch, group.title);
    const sources = make("details");
    const members = entries.filter(({ definition }) => definition.group === group);
    sources.append(make("summary", `${members.length} ${members.length === 1 ? "source" : "sources"}`));
    const list = make("ul");
    for (const entry of members) {
      const row = make("li");
      entry.status = make("span", "Zoom in", "layer-state");
      row.append(sourceLink(entry.definition), entry.status);
      list.append(row);
    }
    sources.append(list);
    section.append(label, sources);
    layerGroups.append(section);
  }
}

function loadSdk() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://js.arcgis.com/5.2/";
    const timer = setTimeout(() => reject(new Error("The mapping library timed out.")), 25000);
    script.addEventListener("load", () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
    script.addEventListener("error", () => {
      clearTimeout(timer);
      reject(new Error("The mapping library could not load."));
    }, { once: true });
    document.head.append(script);
  });
}

function shouldDisplay({ definition }, scale) {
  const denseView = fullDetail && Math.round(scale) <= denseScale;
  return enabled.has(definition.group.id) && (denseView ||
    (!definition.detailOnly && (!definition.scale || scale <= definition.scale)));
}

function symbolFor(definition, geometryType, aerial = false) {
  const { id, group } = definition;
  const color = definition.color ?? (aerial && group.aerialColor ? group.aerialColor : group.color);
  if (geometryType === "point" || geometryType === "multipoint") {
    return {
      type: "simple-marker",
      style: id === "observations" ? "diamond" : "circle",
      size: id === "observations" ? 6 : 4.5,
      color,
      outline: { color: "#fffcf4", width: .55 },
    };
  }
  if (geometryType === "polyline") {
    const width = id === "stairways" ? 2.6 : group.id === "paint" ? .9 : 1.2;
    return {
      type: "simple-line",
      color,
      width,
      style: id === "sidewalks" || id === "areaways" || id === "parking-archive" ? "dash" : "solid",
    };
  }
  const fill = {
    buildings: aerial ? [61, 135, 163, .14] : [66, 103, 123, .12],
    "tree-crowns": [82, 133, 64, .12],
    "park-boundaries": [71, 113, 70, .16],
    areaways: [38, 96, 145, .12],
  }[id];
  return {
    type: "simple-fill",
    color: fill ?? [0, 0, 0, 0],
    outline: {
      color: id === "park-boundaries" ? "#66865d" : color,
      width: id === "buildings" ? 1.15 : .9,
      style: id === "areaways" ? "dash" : "solid",
    },
  };
}

function configureFeature(entry, aerial) {
  const { definition, layer } = entry;
  if (layer.isTable || !layer.geometryType) throw new Error("The source has no map geometry.");
  // Visibility is driven by the map's detail controls, including the citywide stairways.
  layer.minScale = 0;
  layer.maxScale = 0;
  layer.renderer = { type: "simple", symbol: symbolFor(definition, layer.geometryType, aerial) };
  layer.opacity = definition.id === "parking-archive" ? .3 : definition.id === "right-of-way" ? .5 : .95;
  const byName = new Map(layer.fields.map((field) => [field.name.toUpperCase(), field]));
  entry.fields = definition.fields.map((name) => byName.get(name)).filter(Boolean);
  if (entry.fields.length === 0 && definition.id !== "addresses") {
    const field = byName.get(layer.displayField?.toUpperCase());
    if (field && field.type !== "oid" && !/email|phone|owner|contact/i.test(field.name)) entry.fields = [field];
  }
  if (definition.inService && byName.has("CURRENT_STATUS")) {
    const current = byName.get("CURRENT_STATUS").name;
    const filter = `${current} = 'INSVC' OR ${current} IS NULL OR ${current} = ''`;
    layer.definitionExpression = layer.definitionExpression ? `(${layer.definitionExpression}) AND (${filter})` : filter;
  }
  if (definition.where) {
    layer.definitionExpression = layer.definitionExpression ?
      `(${layer.definitionExpression}) AND (${definition.where})` : definition.where;
  }
  const activeBench = byName.get("LIFECYCLESTATUSTXT");
  if (definition.id === "benches" && activeBench) {
    const filter = `${activeBench.name} = 'Active'`;
    layer.definitionExpression = layer.definitionExpression ? `(${layer.definitionExpression}) AND (${filter})` : filter;
  }
  layer.outFields = [...new Set([layer.objectIdField, ...entry.fields.map(({ name }) => name)].filter(Boolean))];
  layer.popupEnabled = false;

  const field = entry.fields[0];
  if (field && definition.fields.length && definition.id !== "buildings") {
    const ref = `$feature[${JSON.stringify(field.name)}]`;
    const value = field.domain?.type === "coded-value" ? `DomainName($feature, "${field.name}")` : ref;
    layer.labelingInfo = [{
      labelExpressionInfo: {
        expression: `IIf(IsEmpty(${ref}), '', Left(Text(${value}), 42)${definition.id === "stairways" ? " + ' risers'" : ""})`,
      },
      symbol: {
        type: "text",
        color: definition.group.color,
        haloColor: "#fffdf4",
        haloSize: 1,
        font: { family: "sans-serif", size: 8 },
      },
      deconflictionStrategy: definition.id === "streets" ? "static" : "none",
    }];
    layer.labelsVisible = definition.id === "streets";
  } else {
    layer.labelsVisible = false;
  }
}

function showRecords(records) {
  inspectionBody.replaceChildren();
  inspection.hidden = false;
  document.querySelector("#inspection-title").textContent = records.length ?
    `${records.length} map ${records.length === 1 ? "record" : "records"}` : "Map records";
  if (!records.length) {
    inspectionBody.append(make("p", "No visible records here. Try a nearby symbol or zoom in.", "inspection-note"));
    return;
  }
  records.forEach(({ entry, graphic }, index) => {
    const details = make("details");
    details.open = index === 0;
    details.append(make("summary", entry.definition.title));
    if (entry.fields.length) {
      const fields = make("dl");
      for (const field of entry.fields) {
        const raw = graphic.attributes?.[field.name];
        const label = field.domain?.codedValues?.find(({ code }) => code === raw)?.name;
        fields.append(make("dt", field.alias || field.name), make("dd", String(label ?? (raw === "" || raw == null ? "Unknown" : raw))));
      }
      details.append(fields);
    }
    details.append(sourceLink(entry.definition, "Source record layer ↗"));
    inspectionBody.append(details);
  });
}

function dismissInspection() {
  inspectRequest += 1;
  inspection.hidden = true;
  activeHighlight?.remove();
  activeHighlight = null;
}

async function start() {
  await loadSdk();
  const [ArcGISMap, TileLayer, MapImageLayer, FeatureLayer, VectorTileLayer, reactiveUtils, config] = await globalThis.$arcgis.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/layers/TileLayer.js",
    "@arcgis/core/layers/MapImageLayer.js",
    "@arcgis/core/layers/FeatureLayer.js",
    "@arcgis/core/layers/VectorTileLayer.js",
    "@arcgis/core/core/reactiveUtils.js",
    "@arcgis/core/config.js",
  ]);
  config.request.useIdentity = false;
  await customElements.whenDefined("arcgis-map");

  const base = new TileLayer({ url: baseUrl, title: "Light Gray Canvas" });
  const model = new ArcGISMap({ basemap: { baseLayers: [base] } });
  const { baseLayers } = model.basemap;
  map.popupDisabled = true;
  map.center = stops.city.center;
  map.scale = smallScreen.matches ? 112000 : stops.city.scale;
  map.constraints = { minScale: 175000, maxScale: 400, snapToZoom: false, rotationEnabled: false };
  map.map = model;
  await map.viewOnReady();
  const { view } = map;
  sdkReady = true;
  mapMessage.hidden = true;
  let aerial;
  const citySource = mapSource.href;
  const zoomScale = () => view.scale || stops.city.scale;

  function renderLayerState() {
    const scale = zoomScale();
    const relevant = entries.filter((entry) => shouldDisplay(entry, scale));
    for (const entry of entries) {
      const wanted = shouldDisplay(entry, scale);
      if (entry.state === "ready") {
        entry.layer.visible = wanted;
        if (entry.definition.fields.length && entry.layer.labelingInfo?.length) {
          entry.layer.labelsVisible = wanted && (entry.definition.id === "streets" || fullDetail);
        }
      }
      const state = entry.state;
      entry.status.dataset.state = state;
      entry.status.textContent = state === "error" ? "Unavailable" :
        !enabled.has(entry.definition.group.id) ? "Hidden" :
        !wanted ? entry.definition.detailOnly && !fullDetail ? "Full detail" : "Zoom in" :
        state === "ready" ? "On map" : state === "loading" ? "Loading" : "Queued";
      entry.status.title = state === "error" ? entry.error : "";
    }
    const ready = relevant.filter(({ state }) => state === "ready").length;
    const pending = relevant.filter(({ state }) => state === "loading" || state === "idle").length;
    const unavailable = relevant.length - ready - pending;
    const badge = [
      aerial?.visible && aerial.title,
      `${ready} ${ready === 1 ? "layer" : "layers"} active`,
      pending && `${pending} loading`,
      unavailable && `${unavailable} unavailable`,
    ].filter(Boolean).join(" · ");
    if (layerStatus.textContent !== badge) layerStatus.textContent = badge;
    scaleText.textContent = `1:${Math.round(scale).toLocaleString("en-US")}`;
  }

  async function addLayer(entry) {
    const { definition } = entry;
    const { url, portalItem, id, title, type } = definition;
    entry.state = "loading";
    activeLoads += 1;
    try {
      const options = { id, title, ...(url ? { url } : { portalItem }) };
      entry.layer = type === "vector-tile" ? new VectorTileLayer(options) : new FeatureLayer(options);
      await entry.layer.load({ signal: AbortSignal.timeout(18000) });
      if (type === "feature") configureFeature(entry, aerial?.visible);
      entry.layer.visible = shouldDisplay(entry, zoomScale());
      const drawOrder = entries.indexOf(entry);
      const insertAt = model.layers.filter((layer) => entries.findIndex(({ layer: other }) => layer === other) < drawOrder).length;
      model.add(entry.layer, insertAt);
      entriesByLayer.set(entry.layer, entry);
      entry.state = "ready";
    } catch (error) {
      entry.layer?.destroy();
      entry.state = "error";
      entry.error = error?.message || "The public service did not respond.";
    } finally {
      activeLoads -= 1;
      refresh();
    }
  }

  function refresh() {
    const scale = zoomScale();
    if (view.stationary || view.interacting === false && activeLoads === 0) {
      const queued = entries.filter((entry) => entry.state === "idle" && shouldDisplay(entry, scale));
      for (const entry of queued.slice(0, maxParallelLoads - activeLoads)) void addLayer(entry);
    }
    renderLayerState();
  }

  function setDetail(value) {
    fullDetail = value;
    allButton.setAttribute("aria-pressed", String(value));
    allButton.textContent = value ? "Readable view" : "Show everything";
  }

  function setAerial(value) {
    aerial.visible = value;
    for (const group of groups) {
      if (!group.aerialColor) continue;
      groupInputs.get(group.id).nextElementSibling.style.setProperty("--swatch", value ? group.aerialColor : group.color);
    }
    for (const { definition, layer, state } of entries) {
      if (state === "ready" && definition.group.aerialColor) {
        layer.renderer = { type: "simple", symbol: symbolFor(definition, layer.geometryType, value) };
      }
    }
    aerialButton.setAttribute("aria-pressed", String(value));
    mapSource.textContent = value ? "Imagery source ↗" : "City of Seattle GeoData ↗";
    mapSource.href = value ? aerial.url : citySource;
    renderLayerState();
  }

  async function loadAerial() {
    for (const { url, title, type } of imagerySources) {
      const Layer = type === "tile" ? TileLayer : MapImageLayer;
      const candidate = new Layer({ url, title, visible: false });
      try {
        await candidate.load({ signal: AbortSignal.timeout(5000) });
        baseLayers.add(candidate);
        await view.whenLayerView(candidate);
        return candidate;
      } catch {
        baseLayers.remove(candidate);
        candidate.destroy();
      }
    }
    throw new Error("No imagery service responded.");
  }

  async function goTo(target) {
    try {
      await view.goTo(target, { animate: !reducedMotion.matches, duration: 650 });
    } catch (error) {
      if (error.name !== "AbortError") {
        mapMessage.textContent = "Could not move to that location.";
        mapMessage.hidden = false;
      }
    }
  }

  function selectStop(name) {
    stopsButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stop === name)));
  }

  for (const button of stopsButtons) {
    button.addEventListener("click", () => {
      const name = button.dataset.stop;
      if (name === "city") setDetail(false);
      selectStop(name);
      dismissInspection();
      const { center, scale } = stops[name];
      const targetScale = name === "city" && smallScreen.matches ? 112000 : scale;
      void goTo({ center, scale: fullDetail && name !== "city" ? denseScale : targetScale });
      refresh();
    });
  }

  allButton.addEventListener("click", () => {
    const value = !fullDetail;
    setDetail(value);
    if (value) {
      for (const [id, input] of groupInputs) {
        input.checked = true;
        enabled.add(id);
      }
      if (zoomScale() > 12000) {
        selectStop("square");
        void goTo({ center: stops.square.center, scale: denseScale });
      } else if (zoomScale() > denseScale) {
        void goTo({ center: view.center, scale: denseScale });
      }
    }
    refresh();
  });

  aerialButton.addEventListener("click", async () => {
    if (aerial?.visible) {
      setAerial(false);
      return;
    }
    aerialButton.disabled = true;
    mapMessage.textContent = "Opening aerial imagery…";
    mapMessage.hidden = false;
    try {
      aerial ??= await loadAerial();
      setAerial(true);
      mapMessage.hidden = true;
    } catch {
      mapMessage.textContent = "Aerial imagery is unavailable. The map layers are still available.";
    } finally {
      aerialButton.disabled = false;
    }
  });

  for (const [id, input] of groupInputs) {
    input.addEventListener("change", () => {
      if (input.checked) enabled.add(id);
      else enabled.delete(id);
      setDetail(false);
      dismissInspection();
      refresh();
    });
  }

  closeInspection.addEventListener("click", () => {
    dismissInspection();
    view.focus();
  });
  inspection.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeInspection.click();
  });
  async function inspectAt(screenPoint, moveFocus = false) {
    const request = ++inspectRequest;
    const include = entries.filter(({ state, layer }) => state === "ready" && layer.visible && layer.type === "feature")
      .map(({ layer }) => layer);
    if (!include.length) return;
    try {
      const hit = await view.hitTest(screenPoint, { include });
      if (request !== inspectRequest) return;
      const records = hit.results.filter(({ type }) => type === "graphic").map(({ graphic }) => ({
        entry: entriesByLayer.get(graphic.layer),
        graphic,
      })).filter(({ entry }) => entry);
      activeHighlight?.remove();
      activeHighlight = null;
      showRecords(records);
      if (moveFocus) closeInspection.focus();
      for (const [index, detail] of [...inspectionBody.querySelectorAll("details")].entries()) {
        const { entry, graphic } = records[index];
        const emphasize = async () => {
          if (request !== inspectRequest || !detail.open) return;
          const layerView = await view.whenLayerView(entry.layer).catch(() => null);
          if (!layerView || request !== inspectRequest || !detail.open) return;
          activeHighlight?.remove();
          activeHighlight = layerView.highlight(graphic);
        };
        detail.addEventListener("toggle", emphasize);
        if (detail.open) void emphasize();
      }
    } catch {
      if (request === inspectRequest) dismissInspection();
    }
  }
  view.on("click", (event) => void inspectAt(event));
  view.on("key-down", (event) => {
    if (event.key === "Escape") dismissInspection();
    if (event.key === "Enter") {
      event.stopPropagation();
      void inspectAt({ x: view.width / 2, y: view.height / 2 }, true);
    }
  });
  view.on("drag", (event) => {
    if (event.action === "start") {
      selectStop(null);
      dismissInspection();
    }
  });
  view.on("layerview-create-error", ({ layer, error }) => {
    const entry = entriesByLayer.get(layer);
    if (entry) {
      entry.state = "error";
      entry.error = error?.message || "The layer could not be drawn.";
      model.remove(layer);
      entriesByLayer.delete(layer);
      layer.destroy();
      refresh();
    }
  });
  reactiveUtils.watch(() => [view.stationary, Math.round(view.scale || 0)], refresh);
  [...stopsButtons, allButton, aerialButton, ...groupInputs.values()].forEach((control) => { control.disabled = false; });
  refresh();
}

buildLayerList();
const startupTimer = setTimeout(() => {
  if (!sdkReady) mapMessage.textContent = "Seattle’s map is taking longer to open. The layer sources are available in the list.";
}, 15000);
start().catch((error) => {
  mapMessage.textContent = "The map could not open. You can still browse the layer sources.";
  layerStatus.textContent = "Map unavailable";
  console.error(error);
}).finally(() => clearTimeout(startupTimer));
