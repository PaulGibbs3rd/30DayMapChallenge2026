const bounds = { xmin: -24, ymin: -12, xmax: 24, ymax: 18 };
const colors = { sea: "#d6e9df", land: "#d9d6ab", shore: "#7f937c", grid: "#748b7f", ink: "#173734", quiet: "#48675b", red: "#a73327", cream: "#fff9e9", selection: "#0e668d" };
const pinSize = 19;
const pinOffset = 22;
const origin = [0, 0];
const axes = [[[-180, 0], [0, 0], [180, 0]], [[0, -90], [0, 90]]];
const labels = [
  { at: [-8.2, 11.5], text: "West Africa" },
  { at: [-9, -5], text: "Gulf of Guinea" },
  { at: [-17, 2.1], text: "Equator" },
  { at: [1.3, -9.3], text: "Prime Meridian" }
];
const landUrl = new URL("./land.geojson", import.meta.url);

function plotOffset([longitude, latitude]) {
  return longitude === 0 && latitude === 0 ? pinOffset : 0;
}

function canvasFrame(canvas, extent) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = Math.min(width / (extent.xmax - extent.xmin), height / (extent.ymax - extent.ymin));
  const centerX = (extent.xmin + extent.xmax) / 2;
  const centerY = (extent.ymin + extent.ymax) / 2;
  return {
    scale,
    toPixel: ([longitude, latitude]) => [width / 2 + (longitude - centerX) * scale, height / 2 - (latitude - centerY) * scale],
    toCoordinates: ([x, y]) => [(x - width / 2) / scale + centerX, (height / 2 - y) / scale + centerY]
  };
}

function drawCanvas(canvas, features, points, count, extent, selection, plots) {
  const context = canvas.getContext("2d");
  const { clientWidth: width, clientHeight: height } = canvas;
  if (!context || !width || !height) return;

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = colors.sea;
  context.fillRect(0, 0, width, height);

  const { toPixel } = canvasFrame(canvas, extent);

  function trace(path) {
    context.moveTo(...toPixel(path[0]));
    for (const vertex of path.slice(1)) context.lineTo(...toPixel(vertex));
  }

  context.strokeStyle = colors.shore;
  context.fillStyle = colors.land;
  context.lineWidth = 1;
  for (const { geometry } of features) {
    const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
    for (const polygon of polygons) {
      context.beginPath();
      for (const ring of polygon) {
        trace(ring);
        context.closePath();
      }
      context.fill("evenodd");
      context.stroke();
    }
  }

  context.strokeStyle = colors.grid;
  context.setLineDash([3, 3]);
  context.beginPath();
  axes.forEach(trace);
  context.stroke();
  context.setLineDash([]);

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "600 10px system-ui, sans-serif";
  context.fillStyle = colors.quiet;
  for (const label of labels) context.fillText(label.text, ...toPixel(label.at));

  function dot([x, y], radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.strokeStyle = colors.cream;
    context.lineWidth = 1.4;
    context.fill();
    context.stroke();
  }

  for (const point of points) dot(toPixel(point), 3.5, colors.ink);
  const originPixel = toPixel(origin);
  dot(originPixel, count ? 10 : 4, colors.red);
  if (count) {
    context.fillStyle = colors.cream;
    context.fillText(String(count), ...originPixel);
  }
  context.textAlign = "left";
  context.fillStyle = colors.red;
  context.fillText("0°, 0°", originPixel[0] + (count ? 15 : 8), originPixel[1] - 2);
  for (const { coordinates } of plots) {
    const [x, y] = toPixel(coordinates);
    const pinY = y - plotOffset(coordinates);
    const half = pinSize / 2;
    context.beginPath();
    context.moveTo(x, pinY - half);
    context.lineTo(x + half, pinY);
    context.lineTo(x, pinY + half);
    context.lineTo(x - half, pinY);
    context.closePath();
    context.fillStyle = colors.selection;
    context.strokeStyle = colors.cream;
    context.lineWidth = 1.5;
    context.fill();
    context.stroke();
  }
  if (selection) {
    context.beginPath();
    context.arc(...toPixel(selection), 12, 0, 2 * Math.PI);
    context.strokeStyle = colors.selection;
    context.lineWidth = 2;
    context.stroke();
  }
}

async function createArcGISLocator(mapElement) {
  await customElements.whenDefined("arcgis-map");
  const [Map, Extent, Graphic, GraphicsLayer, GeoJSONLayer, { whenOnce }] = await globalThis.$arcgis.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/geometry/Extent.js",
    "@arcgis/core/Graphic.js",
    "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/layers/GeoJSONLayer.js",
    "@arcgis/core/core/reactiveUtils.js"
  ]);

  const spatialReference = { wkid: 4326 };
  const land = new GeoJSONLayer({
    url: landUrl.href,
    title: "Natural Earth land",
    renderer: {
      type: "simple",
      symbol: { type: "simple-fill", color: colors.land, outline: { color: colors.shore, width: 0.7 } }
    }
  });
  const graticule = new GraphicsLayer({ title: "Equator and Prime Meridian" });
  const guests = new GraphicsLayer({ title: "Sample guest locations" });
  const plots = new GraphicsLayer({ title: "Plotted points" });
  const selected = new GraphicsLayer({ title: "Inspected point" });
  const point = ([x, y]) => ({ type: "point", x, y, spatialReference });
  const text = (location, label, color, options = {}) => new Graphic({
    geometry: point(location),
    symbol: { type: "text", text: label, color, font: { family: "sans-serif", size: 7.5, weight: "bold" }, ...options }
  });

  graticule.addMany(axes.map(path => new Graphic({
    geometry: { type: "polyline", paths: [path], spatialReference },
    symbol: { type: "simple-line", color: colors.grid, width: 0.7, style: "short-dash" }
  })));
  graticule.addMany(labels.map(label => text(label.at, label.text, colors.quiet)));

  mapElement.spatialReference = spatialReference;
  mapElement.background = { color: colors.sea };
  mapElement.constraints = { snapToZoom: false, rotationEnabled: false };
  mapElement.extent = new Extent({ ...bounds, spatialReference });
  mapElement.map = new Map({ layers: [land, graticule, guests, plots, selected] });
  await mapElement.viewOnReady();
  const landView = await mapElement.view.whenLayerView(land);
  await whenOnce(() => !landView.updating);

  function marker(location, size, color, options = {}) {
    return new Graphic({
      geometry: point(location),
      symbol: { type: "simple-marker", size, color, outline: { color: colors.cream, width: 1 }, ...options }
    });
  }

  return {
    getExtent: () => mapElement.extent,
    moveTo(extent) {
      mapElement.goTo(new Extent({ ...extent, spatialReference }), { animate: false }).catch(error => {
        if (error.name !== "AbortError") console.warn("Could not move the coordinate map", error);
      });
    },
    draw(points, count) {
      guests.removeAll();
      guests.addMany(points.map(location => marker(location, 5, colors.ink)));
      guests.add(marker(origin, count ? 15 : 6, colors.red));
      if (count) guests.add(text(origin, String(count), colors.cream));
      guests.add(text(origin, "0°, 0°", colors.red, { horizontalAlignment: "left", xoffset: count ? 12 : 6 }));
    },
    select(coordinates) {
      selected.removeAll();
      if (coordinates) {
        selected.add(marker(coordinates, 18, [0, 0, 0, 0], { outline: { color: colors.selection, width: 1.5 } }));
      }
    },
    addPlot({ coordinates, number, guestId }) {
      const [longitude, latitude] = coordinates;
      const graphic = marker(coordinates, `${pinSize}px`, colors.selection, {
        style: "diamond",
        yoffset: `${plotOffset(coordinates)}px`,
        outline: { color: colors.cream, width: 1.5 }
      });
      graphic.attributes = { number, longitude, latitude, guestId };
      const existing = plots.graphics.find(point => point.attributes.number === number);
      if (existing) plots.remove(existing);
      plots.add(graphic);
    },
    clearPlots() {
      plots.removeAll();
    },
    clearGuestPlots() {
      plots.removeMany(plots.graphics.filter(point => point.attributes.guestId).toArray());
    },
    pick(callback) {
      mapElement.addEventListener("arcgisViewClick", async ({ detail }) => {
        if (!detail.mapPoint) return;
        const result = await mapElement.hitTest(detail, { include: [plots, guests] }).catch(() => null);
        const location = result?.results.find(item => item.type === "graphic")?.graphic.geometry ?? detail.mapPoint;
        callback([location.longitude, location.latitude]);
      });
    }
  };
}

export function createLocator() {
  const canvas = document.querySelector("#lab-canvas");
  const stage = document.querySelector("#lab-stage");
  const mapElement = document.querySelector("#lab-map");
  let features = [];
  let points = [];
  let count = 0;
  let selection;
  const plottedPoints = new Map();
  let nextPlotNumber = 1;
  let focus = bounds;
  let live;
  let onPick;
  let drag;

  const drawFallback = () => drawCanvas(canvas, features, points, count, focus, selection, plottedPoints.values());
  new ResizeObserver(drawFallback).observe(stage);
  fetch(landUrl).then(response => {
    if (!response.ok) throw Error(`Locator data returned ${response.status}`);
    return response.json();
  }).then(collection => {
    features = collection.features;
    drawFallback();
  }).catch(error => console.warn("Locator data unavailable", error));

  function loadLive() {
    createArcGISLocator(mapElement).then(arcgis => {
      live = arcgis;
      live.pick(coordinates => onPick?.(coordinates));
      if (focus !== bounds) live.moveTo(focus);
      live.draw(points, count);
      plottedPoints.forEach(plot => live.addPlot(plot));
      live.select(selection);
      stage.classList.add("is-live");
    }).catch(error => console.warn("Using the local locator", error));
  }

  if (globalThis.$arcgis) loadLive();
  else document.querySelector("#arcgis-cdn").addEventListener("load", loadLive, { once: true });

  function moveTo(extent) {
    focus = extent;
    drawFallback();
    live?.moveTo(extent);
  }

  function zoom(factor) {
    const extent = live?.getExtent() ?? focus;
    const centerX = (extent.xmin + extent.xmax) / 2;
    const centerY = (extent.ymin + extent.ymax) / 2;
    const width = extent.xmax - extent.xmin;
    const height = extent.ymax - extent.ymin;
    const adjusted = Math.max(0.02 / width, Math.min(360 / width, factor));
    moveTo({ xmin: centerX - width * adjusted / 2, xmax: centerX + width * adjusted / 2, ymin: centerY - height * adjusted / 2, ymax: centerY + height * adjusted / 2 });
  }

  canvas.addEventListener("pointerdown", event => {
    if (event.button !== 0 || drag) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, extent: focus };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    if (event.pointerId !== drag?.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    const { extent } = drag;
    const { scale } = canvasFrame(canvas, extent);
    drag.moved = true;
    focus = { xmin: extent.xmin - dx / scale, xmax: extent.xmax - dx / scale, ymin: extent.ymin + dy / scale, ymax: extent.ymax + dy / scale };
    drawFallback();
  });
  canvas.addEventListener("pointerup", event => {
    if (event.pointerId !== drag?.id) return;
    const moved = drag.moved;
    drag = null;
    if (moved) return;
    const rect = canvas.getBoundingClientRect();
    const position = [event.clientX - rect.left, event.clientY - rect.top];
    const frame = canvasFrame(canvas, focus);
    const plotted = Array.from(plottedPoints.values()).find(({ coordinates }) => {
      const [x, y] = frame.toPixel(coordinates);
      return Math.hypot(x - position[0], y - plotOffset(coordinates) - position[1]) < 10;
    });
    const pin = plotted?.coordinates ?? [origin, ...points].find(coordinates => {
      const [x, y] = frame.toPixel(coordinates);
      return Math.hypot(x - position[0], y - position[1]) < 9;
    });
    onPick?.(pin ?? frame.toCoordinates(position));
  });
  canvas.addEventListener("lostpointercapture", () => { drag = null; });

  document.querySelector("#map-zoom-in").addEventListener("click", () => zoom(0.5));
  document.querySelector("#map-zoom-out").addEventListener("click", () => zoom(2));
  document.querySelector("#map-home").addEventListener("click", () => moveTo(bounds));

  return {
    onPick(callback) { onPick = callback; },
    resetView() { moveTo(bounds); },
    addPlot(coordinates, guestId) {
      const number = plottedPoints.get(guestId)?.number ?? nextPlotNumber++;
      const plot = { coordinates, number, guestId };
      plottedPoints.set(guestId ?? number, plot);
      drawFallback();
      live?.addPlot(plot);
      return number;
    },
    clearPlots() {
      plottedPoints.clear();
      nextPlotNumber = 1;
      drawFallback();
      live?.clearPlots();
    },
    clearGuestPlots() {
      for (const [key, plot] of plottedPoints) {
        if (plot.guestId) plottedPoints.delete(key);
      }
      drawFallback();
      live?.clearGuestPlots();
      return plottedPoints.size;
    },
    setSelection(coordinates, center) {
      selection = coordinates;
      if (coordinates && center) {
        const [x, y] = coordinates;
        const extent = live?.getExtent() ?? focus;
        const padding = Math.min(extent.xmax - extent.xmin, extent.ymax - extent.ymin) * 0.08;
        const outside = x < extent.xmin + padding || x > extent.xmax - padding || y < extent.ymin + padding || y > extent.ymax - padding;
        if (outside) moveTo({ xmin: x - 18, ymin: y - 12, xmax: x + 18, ymax: y + 12 });
      }
      drawFallback();
      live?.select(coordinates);
    },
    setArrivals(locations, arrivals) {
      points = locations;
      count = arrivals;
      drawFallback();
      live?.draw(points, count);
    }
  };
}
