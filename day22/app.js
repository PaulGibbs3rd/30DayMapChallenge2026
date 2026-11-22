const projections = {
  3857: { name: "Web Mercator", caption: "Scale increases toward the poles." },
  54090: { name: "Peirce Quincuncial", caption: "A square world with the North Pole at its center." },
  54035: { name: "Equal Earth", caption: "Preserves relative area, even where shapes stretch or flatten." },
  102299: { name: "Berghaus Star", caption: "Five lobes surround the Northern Hemisphere in Esri’s AAG variant." },
  54050: { name: "Fuller / Dymaxion", caption: "An unfolded icosahedron cuts across the oceans." },
};

const places = {
  reykjavik: { name: "Reykjavík", longitude: -21.8827, latitude: 64.079 },
  quito: { name: "Quito", longitude: -78.538, latitude: -0.2113 },
  pacific: { name: "Pacific seam", longitude: 179.8, latitude: -18 },
};

const mercatorLatitude = 85.05112878;
const byId = (id) => document.getElementById(id);
const radiusInput = byId("radius");
const latitudeInput = byId("latitude");
const longitudeInput = byId("longitude");
const projectionInput = byId("projection");
const placeButtons = [...document.querySelectorAll("[data-place]")];
const status = byId("map-status");
const symbols = {
  water: { type: "simple-fill", color: "#d9e8e4", outline: null },
  grid: { type: "simple-line", color: [72, 108, 103, 0.32], width: 0.65 },
  land: { type: "simple-fill", color: "#92ada4", outline: { color: "#527a70", width: 0.55 } },
  reference: { type: "simple-line", color: "#265d58", width: 1.45, style: "short-dash" },
  bufferFill: { type: "simple-fill", color: [213, 94, 62, 0.25], outline: null },
  bufferEdge: { type: "simple-line", color: "#a53223", width: 1.85 },
  point: { type: "simple-marker", color: "#a53223", size: 4.75, outline: { color: "#fcfaf4", width: 0.9 } },
};

start().catch((error) => {
  console.error(error);
  status.textContent = "Maps unavailable";
  const message = byId("map-error");
  message.textContent = "The maps could not load. Check your connection and reload the page.";
  message.hidden = false;
});

async function start() {
  const [sdk, landData] = await Promise.all([loadSDK(), loadLand()]);
  const [
    Map, MapView, Graphic, GraphicsLayer, SpatialReference, Extent, Point, Polygon, Polyline,
    { projectExecute, projectLoad },
    { shapePreservingProjectExecute, shapePreservingProjectLoad },
    { geodesicBufferExecute, geodesicBufferLoad },
    { clipExecute },
  ] = await sdk.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/views/MapView.js",
    "@arcgis/core/Graphic.js",
    "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/geometry/SpatialReference.js",
    "@arcgis/core/geometry/Extent.js",
    "@arcgis/core/geometry/Point.js",
    "@arcgis/core/geometry/Polygon.js",
    "@arcgis/core/geometry/Polyline.js",
    "@arcgis/core/geometry/operators/projectOperator.js",
    "@arcgis/core/geometry/operators/shapePreservingProjectOperator.js",
    "@arcgis/core/geometry/operators/geodesicBufferOperator.js",
    "@arcgis/core/geometry/operators/clipOperator.js",
  ]);

  await Promise.all([projectLoad(), shapePreservingProjectLoad(), geodesicBufferLoad()]);
  const geographic = SpatialReference.WGS84;
  const mercatorWindow = new Extent({
    xmin: -180, ymin: -mercatorLatitude, xmax: 180, ymax: mercatorLatitude, spatialReference: geographic,
  });
  const land = landData.features.flatMap(({ geometry }) => {
    const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    return polygons.map((rings) => new Polygon({ rings, spatialReference: geographic }));
  });
  const referencePoint = new Point({ longitude: 30, latitude: 0, spatialReference: geographic });
  const mapFrames = {};
  let selection = places.reykjavik;
  let radius = radiusInput.valueAsNumber;
  let referenceBuffer = bufferAround(referencePoint);

  const [baseline, comparison] = await Promise.all([
    createMap(byId("baseline-map"), 3857),
    createMap(byId("comparison-map"), Number(projectionInput.value)),
  ]);
  const panels = [baseline, comparison];
  renderBuffers();

  for (const panel of panels) {
    panel.view.on("click", (event) => {
      const coordinate = event.mapPoint && projectExecute(event.mapPoint, geographic);
      const projected = coordinate && projectExecute(coordinate, panel.frame.spatialReference);
      if (!projected || Math.hypot(event.mapPoint.x - projected.x, event.mapPoint.y - projected.y) > panel.view.resolution * 2) {
        return;
      }
      const latitude = Math.min(89.9999, Math.max(-89.9999, coordinate.latitude));
      setSelection({ longitude: coordinate.longitude, latitude });
    });
  }
  for (const button of placeButtons) {
    button.addEventListener("click", () => setSelection(places[button.dataset.place]));
  }
  byId("coordinate-form").addEventListener("submit", (event) => {
    event.preventDefault();
    setSelection({ latitude: latitudeInput.valueAsNumber, longitude: longitudeInput.valueAsNumber });
  });
  radiusInput.addEventListener("input", () => {
    radius = radiusInput.valueAsNumber;
    referenceBuffer = bufferAround(referencePoint);
    renderBuffers();
  });
  projectionInput.addEventListener("change", () => {
    const wkid = Number(projectionInput.value);
    comparison.view.map.layers.remove(comparison.frame.layer);
    comparison.frame = getMapFrame(wkid);
    comparison.view.spatialReference = comparison.frame.spatialReference;
    comparison.view.map.layers.add(comparison.frame.layer, 0);
    fitWorld(comparison);
    byId("projection-wkid").textContent = `WKID ${wkid}`;
    byId("projection-caption").textContent = projections[wkid].caption;
    byId("equal-earth-source").hidden = wkid !== 54035;
    comparison.view.container.setAttribute("aria-label", `${projections[wkid].name} world map`);
    renderBuffers();
  });
  for (const id of ["places", "radius-controls", "coordinate-controls", "projection"]) {
    byId(id).disabled = false;
  }

  function bufferAround(point) {
    const area = geodesicBufferExecute(point, radius, { unit: "kilometers", maxDeviation: 0.15 });
    const paths = area.rings.flatMap(visibleRingPaths);
    return { area, outline: new Polyline({ paths, spatialReference: geographic }) };
  }

  function projectShape(geometry, spatialReference) {
    const source = spatialReference.wkid === 3857 ? clipExecute(geometry, mercatorWindow) : geometry;
    return source && shapePreservingProjectExecute(source, spatialReference, {
      maxDeviationInSrTo: 2500,
      minSegmentLengthInDegrees: 0.02,
    });
  }

  function getMapFrame(wkid) {
    if (mapFrames[wkid]) return mapFrames[wkid];
    const spatialReference = new SpatialReference({ wkid });
    const worldLimit = wkid === 3857 ? mercatorLatitude : 89.99999;
    const grid = new Polyline({ paths: graticule(worldLimit), spatialReference: geographic });
    const world = oceanTiles(worldLimit).map((ring) => new Polygon({ rings: [ring], spatialReference: geographic }));
    const waterGraphics = projectGraphics(world, symbols.water);
    const extent = waterGraphics.reduce((bounds, { geometry }) => (
      bounds ? bounds.union(geometry.extent) : geometry.extent.clone()
    ), null);
    const layer = new GraphicsLayer({
      title: "Natural Earth land and geographic grid",
      graphics: [...waterGraphics, ...projectGraphics([grid], symbols.grid), ...projectGraphics(land, symbols.land)],
    });
    const frame = { spatialReference, extent, layer };
    mapFrames[wkid] = frame;
    return frame;

    function projectGraphics(source, symbol) {
      return source.flatMap((geometry) => {
        const projected = projectShape(geometry, spatialReference);
        return projected?.extent ? [new Graphic({ geometry: projected, symbol })] : [];
      });
    }
  }

  async function createMap(container, wkid) {
    const frame = getMapFrame(wkid);
    const overlay = new GraphicsLayer({ title: "Geodesic buffers" });
    const view = new MapView({
      container,
      map: new Map({ layers: [frame.layer, overlay] }),
      spatialReference: frame.spatialReference,
      extent: frame.extent.clone().expand(1.08),
      background: { color: "#f2f0e6" },
      constraints: { snapToZoom: false, rotationEnabled: false },
      padding: { bottom: 16 },
      popupEnabled: false,
      ui: { components: [] },
    });
    await view.when();
    const panel = { view, frame, overlay };
    fitWorld(panel);
    new ResizeObserver(() => fitWorld(panel)).observe(container);
    view.on(["drag", "mouse-wheel", "double-click"], (event) => event.stopPropagation());
    view.on("key-down", (event) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-", "="].includes(event.key)) event.stopPropagation();
    });
    return panel;
  }

  function fitWorld(panel) {
    panel.view.extent = panel.frame.extent.clone().expand(1.08);
  }

  function setSelection(next) {
    if (!Number.isFinite(next.longitude) || !Number.isFinite(next.latitude)) return;
    selection = next;
    latitudeInput.value = Number(selection.latitude.toFixed(4));
    longitudeInput.value = Number(selection.longitude.toFixed(4));
    for (const button of placeButtons) {
      button.setAttribute("aria-pressed", String(places[button.dataset.place] === selection));
    }
    renderBuffers();
  }

  function renderBuffers() {
    const point = new Point({ longitude: selection.longitude, latitude: selection.latitude, spatialReference: geographic });
    const buffer = bufferAround(point);
    for (const { frame, overlay } of panels) {
      const sr = frame.spatialReference;
      const center = sr.wkid === 3857 && Math.abs(selection.latitude) > mercatorLatitude
        ? null : projectExecute(point, sr);
      const graphics = [
        [projectShape(referenceBuffer.outline, sr), symbols.reference],
        [projectShape(buffer.area, sr), symbols.bufferFill],
        [projectShape(buffer.outline, sr), symbols.bufferEdge],
        [center, symbols.point],
      ].flatMap(([geometry, symbol]) => geometry ? [new Graphic({ geometry, symbol })] : []);
      overlay.removeAll();
      overlay.addMany(graphics);
    }
    const distance = radius.toLocaleString("en-US");
    byId("radius-value").textContent = `${distance} km`;
    radiusInput.setAttribute("aria-valuetext", `${distance} kilometers`);
    status.textContent = [
      selection.name,
      `${formatCoordinate(selection.latitude, "N", "S")}, ${formatCoordinate(selection.longitude, "E", "W")}`,
    ].filter(Boolean).join(" · ");
    const { ymin, ymax } = buffer.area.extent;
    let baselineCaption = projections[3857].caption;
    if (ymin > mercatorLatitude || ymax < -mercatorLatitude) {
      baselineCaption = "The selected buffer is beyond Web Mercator’s latitude limit.";
    } else if (ymax > mercatorLatitude || ymin < -mercatorLatitude) {
      baselineCaption = "Web Mercator clips the ring at 85.05° north or south.";
    }
    byId("baseline-caption").textContent = baselineCaption;
  }
}

async function loadLand() {
  const response = await fetch(new URL("./land.geojson", import.meta.url));
  if (!response.ok) throw new Error(`Natural Earth land failed to load (HTTP ${response.status}).`);
  return response.json();
}

function loadSDK() {
  if (globalThis.$arcgis) return Promise.resolve(globalThis.$arcgis);
  const script = byId("arcgis-cdn");
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => fail(), 25000);
    function fail() {
      clearTimeout(timeout);
      reject(new Error("ArcGIS Maps SDK failed to load."));
    }
    script.addEventListener("error", fail, { once: true });
    script.addEventListener("load", () => {
      clearTimeout(timeout);
      if (globalThis.$arcgis) resolve(globalThis.$arcgis);
      else fail();
    }, { once: true });
  });
}

function oceanTiles(limit) {
  const tiles = [];
  for (let x = -180; x < 180; x += 30) {
    for (let y = -90; y < 90; y += 30) {
      const left = Math.max(x, -179.99999);
      const right = Math.min(x + 30, 179.99999);
      const bottom = Math.max(y, -limit);
      const top = Math.min(y + 30, limit);
      tiles.push([[left, bottom], [left, top], [right, top], [right, bottom], [left, bottom]]);
    }
  }
  return tiles;
}

function graticule(limit) {
  const paths = [];
  for (let longitude = -180; longitude < 180; longitude += 30) {
    const x = Math.max(-179.99999, longitude);
    paths.push([[x, -limit], [x, -60], [x, 0], [x, 60], [x, limit]]);
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    paths.push([[-179.99999, latitude], [-90, latitude], [0, latitude], [90, latitude], [179.99999, latitude]]);
  }
  return paths;
}

function visibleRingPaths(ring) {
  // The buffer operator closes its polygons along the antimeridian.
  // Those closure segments bound the fill but are not part of the circle.
  const onAntimeridian = ([longitude]) => Math.abs(longitude) >= 179.999999;
  const paths = [];
  let path = [ring[0]];
  for (let index = 1; index < ring.length; index++) {
    const coordinate = ring[index];
    if (onAntimeridian(ring[index - 1]) && onAntimeridian(coordinate)) {
      if (path.length > 1) paths.push(path);
      path = [coordinate];
    } else {
      path.push(coordinate);
    }
  }
  if (path.length > 1) paths.push(path);
  return paths;
}

function formatCoordinate(value, positive, negative) {
  return `${Math.abs(value).toFixed(2)}° ${value < 0 ? negative : positive}`;
}
