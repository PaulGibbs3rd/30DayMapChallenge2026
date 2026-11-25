import {regions, routeFor} from "./catalog.js";

const NS = "http://www.w3.org/2000/svg";
const FONT = "Segoe UI, Arial, sans-serif";
const CHART_WATER = "#142f3a";
const DIAGRAM_WATER = "#173329";
const LAND = "#39574e";
const COAST = "#6c8b76";
const GOLD = "#ffd079";
const WORLD_RADIUS = 6378137;
const GOLD_WHITE = "#fcf4d6";

const chartOffsets = {
  1: [10, 13], 10: [-11, 7], 15: [-12, -14], 18: [15, -1], 13: [12, 12],
  17: [-11, 9], 11: [10, -5], 14: [11, 9], 5: [-10, -8],
  8: [10, 4], 12: [-10, -2], 7: [12, 4], 3: [-12, -7], 4: [-10, 3],
  9: [12, 2], 22: [9, 20], 20: [-13, 9], 16: [13, 10], 21: [-12, -5],
  sidney: [-10, -7],
};

const diagramDocks = {
  1: [505, 120, 13, 3], 10: [187, 102, -13, 3], 15: [287, 61, 0, -13],
  18: [344, 99, 10, -8], 13: [386, 148, 0, 17], sidney: [119, 49, -12, 0],
  17: [224, 222, -10, 3], 11: [447, 211, 10, 3],
  5: [256, 278, -10, 3], 14: [498, 278, 10, 3],
  12: [238, 344, -10, 3], 8: [528, 344, 10, 3],
  3: [262, 414, -10, -6], 7: [534, 423, 11, 3], 4: [248, 475, -11, 3],
  20: [220, 531, -11, 3], 22: [377, 559, 0, 16], 9: [543, 531, 11, 3],
  21: [283, 626, -11, 3], 16: [493, 637, 11, 3],
};

const diagramBends = {
  "1-10": [[470, 93], [209, 93]], "1-13": [[456, 148]], "1-15": [[470, 61]],
  "1-18": [[473, 99]], "10-13": [[258, 148]], "10-18": [[213, 110]],
  "13-15": [[324, 130]], "15-18": [[320, 61]], "3-7": [[503, 414]],
  "4-7": [[454, 475]], "20-22": [[292, 559]], "22-9": [[463, 559]],
};

const context = [
  [-123.55, 48.32, "Strait of Juan de Fuca", "water"],
  [-123.38, 48.8, "Vancouver Island", "land"],
  [-122.72, 48.35, "Whidbey Island", "land"],
  [-123.20, 47.76, "Olympic Peninsula", "land"],
  [-122.93, 47.42, "Kitsap Peninsula", "land"],
  [-122.18, 47.42, "Washington", "land"],
];

function element(name, attributes = {}, content) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (content !== undefined) node.textContent = content;
  return node;
}

function mercator([longitude, latitude]) {
  const angle = Math.PI / 180;
  return [WORLD_RADIUS * longitude * angle, WORLD_RADIUS * Math.log(Math.tan(Math.PI / 4 + latitude * angle / 2))];
}

function extentOf(bounds) {
  const [xmin, ymin] = mercator([bounds[0], bounds[1]]);
  const [xmax, ymax] = mercator([bounds[2], bounds[3]]);
  return {xmin, ymin, xmax, ymax};
}

const HOME = extentOf([-123.5, 47.22, -122.14, 48.76]);
const ISLANDS = extentOf([-123.10, 48.456, -122.60, 48.681]);
const DIAGRAM_HOME = {xmin: 0, ymin: -680, xmax: 740, ymax: 0};
const MAX_ZOOM = 5;
const ZOOM_STEP = 1.45;

function midpoint({xmin, ymin, xmax, ymax}) {
  return [(xmin + xmax) / 2, (ymin + ymax) / 2];
}

function viewport(width, height, bounds, zoom = 1, center = midpoint(bounds), [paddingX, paddingY] = [34, 28]) {
  const scale = Math.min((width - paddingX) / (bounds.xmax - bounds.xmin), (height - paddingY) / (bounds.ymax - bounds.ymin)) * zoom;
  return {
    scale,
    project: (point) => [width / 2 + (point[0] - center[0]) * scale, height / 2 - (point[1] - center[1]) * scale],
    extent: {xmin: center[0] - width / scale / 2, ymin: center[1] - height / scale / 2,
      xmax: center[0] + width / scale / 2, ymax: center[1] + height / scale / 2},
  };
}

function pathData(points, closed = false) {
  return points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("") + (closed ? "Z" : "");
}

function addText(parent, value, x, y, options = {}) {
  const text = element("text", {x, y, "font-family": FONT, "font-size": options.size ?? 12,
    "font-weight": options.weight ?? 650, "text-anchor": options.anchor ?? "middle",
    "dominant-baseline": "central", fill: options.color ?? "#f0f4e9", stroke: options.halo ?? "none",
    "stroke-width": options.strokeWidth ?? 3, "paint-order": "stroke", "stroke-linejoin": "round",
    "letter-spacing": options.spacing ?? 0}, value);
  parent.append(text);
  return text;
}

function drawLine(parent, points, stroke, width, opacity = 1, dash = "") {
  const path = element("path", {d: pathData(points), fill: "none", stroke, "stroke-width": width,
    opacity, "stroke-dasharray": dash, "stroke-linejoin": "round", "stroke-linecap": "round"});
  parent.append(path);
  return path;
}

function chartLayers(svg, land, chart, ground) {
  if (ground) {
    svg.append(element("rect", {width: "100%", height: "100%", fill: CHART_WATER}));
    const rings = land.flatMap((polygon) => polygon.map((ring) => pathData(ring.map(chart.project), true)));
    svg.append(element("path", {d: rings.join(""), fill: LAND, stroke: COAST, "stroke-width": .68, "fill-rule": "evenodd"}));
  } else svg.append(element("rect", {width: "100%", height: "100%", fill: "transparent", "aria-hidden": "true"}));
}

export function makeAtlas(data, shoreline, onDock, onRoute) {
  const stage = document.querySelector("#map-stage");
  const svg = document.querySelector("#map-art");
  const polygons = shoreline.type === "Polygon" ? [shoreline.coordinates] : shoreline.coordinates;
  const localLand = polygons.map((polygon) => polygon.map((ring) => ring.map(mercator)));
  const projectedDocks = Object.fromEntries(Object.entries(data.terminals).map(([id, dock]) => [id, mercator(dock.point)]));
  const projectedLegs = Object.entries(data.legs).map(([id, coordinates]) => {
    const [a, b] = id.split("-");
    return {id, a, b, route: routeFor(a, b), points: coordinates.map(mercator)};
  });
  const sidneyLines = data.suspended.map((path) => path.map(mercator));
  let viewState = {mode: "chart", sidney: false, legs: null, docks: null, origin: null};
  const cameras = {
    chart: {bounds: HOME, zoom: 1, center: midpoint(HOME)},
    diagram: {bounds: DIAGRAM_HOME, zoom: 1, center: midpoint(DIAGRAM_HOME), padding: [6, 18]},
  };
  let chart;
  let diagram;
  let sdk = null;
  let frame = 0;

  function draw(target, width, height, options = {}) {
    const {mode, sidney, legs, docks, origin} = options.state ?? viewState;
    const isChart = mode === "chart";
    const narrow = width < 520;
    const area = options.chart ?? chart;
    const activeLabels = options.only ?? Object.keys(data.terminals);
    const layout = ([x, y]) => diagram.project([x, -y]);
    const point = (dock) => isChart ? area.project(projectedDocks[dock]) : layout(diagramDocks[dock]);
    const background = isChart ? CHART_WATER : DIAGRAM_WATER;
    const ground = options.forceGround || !sdk;
    const vectorGeometry = !isChart || ground;

    if (isChart) {
      chartLayers(target, localLand, area, ground);
      if (!options.only) for (const [lon, lat, name, kind] of context) {
        const [x, y] = area.project(mercator([lon, lat]));
        if (x > 50 && x < width - 50 && y > 13 && y < height - 13) addText(target, name.toUpperCase(), x, y, {
          color: kind === "water" ? "#91b6bb" : "#c0cdb4", size: narrow ? 9 : 10, spacing: 1.55, weight: 600,
        });
      }
    } else {
      target.append(element("rect", {width: "100%", height: "100%", fill: background}));
      for (const [name, row] of [["SAN JUAN ISLANDS", 26], ["WHIDBEY", 192], ["CENTRAL SOUND", 322], ["SOUTH SOUND", 509]]) {
        const [, y] = layout([0, row]);
        if (width > 410) drawLine(target, [[16, y], [width - 16, y]], "#9db9a2", .75, .26);
        addText(target, name, 17, y + (width > 410 ? 8 : -2), {anchor: "start", color: "#b4c5ae", size: narrow ? 8 : 10, spacing: 1.25, halo: background});
      }
    }

    if (sidney && vectorGeometry) {
      const paths = isChart ? sidneyLines.map((line) => line.map(area.project)) : [[point("sidney"), layout([143, 102]), point("10")]];
      for (const path of paths) drawLine(target, path, "#c9cbc7", 1.7, .85, "5 5");
    }

    if (vectorGeometry) for (const activePass of [false, true]) for (const leg of projectedLegs) {
      const active = legs?.has(leg.id) ?? false;
      if (activePass !== active || (options.only && leg.route.id !== "islands")) continue;
      const color = active ? GOLD : regions[leg.route.region].color;
      const points = isChart ? leg.points.map(area.project) : [point(leg.a), ...(diagramBends[leg.id] ?? []).map(layout), point(leg.b)];
      drawLine(target, points, background, active ? 6.5 : 4.8, legs && !active ? .4 : .83);
      drawLine(target, points, color, active ? 3.6 : isChart ? 2.2 : 3, legs && !active ? .45 : .94);
      if (options.interactive) {
        const hit = drawLine(target, points, "transparent", 12);
        hit.style.cursor = "pointer";
        hit.addEventListener("click", () => onRoute(leg.route.id));
      }
    }

    for (const id of activeLabels) {
      if (id === "sidney" && !sidney) continue;
      const [x, y] = point(id);
      const [dx, dy] = isChart ? chartOffsets[id] : diagramDocks[id].slice(2);
      const isOrigin = id === origin;
      const selected = docks?.has(id) ?? false;
      const pen = id === "sidney" ? "#c9cbc7" : selected ? GOLD : "#f0f4e9";
      const label = id === "sidney" ? "Sidney, B.C. · suspended" : data.terminals[id].name;
      const size = narrow ? 10 : 12;
      const dock = element("g", {"data-dock": id, opacity: docks && !selected && id !== "sidney" ? .73 : 1});
      if (options.interactive && id !== "sidney") {
        dock.setAttribute("tabindex", "0");
        dock.setAttribute("role", "button");
        dock.setAttribute("aria-label", `Explore ${label}`);
        dock.setAttribute("aria-pressed", String(isOrigin));
        dock.style.cursor = "pointer";
        dock.append(element("circle", {cx: x, cy: y, r: 12, fill: "transparent"}));
        dock.addEventListener("click", () => onDock(id));
        dock.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onDock(id);
        });
      }
      if (Math.hypot(dx, dy) > 14) drawLine(dock, [[x, y], [x + dx * .78, y + dy * .74]], pen, .72, .8);
      if (vectorGeometry) {
        if (isOrigin) dock.append(element("circle", {cx: x, cy: y, r: 9, fill: "none", stroke: GOLD, "stroke-width": 1.4}));
        dock.append(element("circle", {cx: x, cy: y, r: isOrigin ? 5.4 : selected ? 4.7 : 3.4,
          fill: isOrigin ? GOLD : background, stroke: pen, "stroke-width": selected ? 2 : 1.55}));
      }
      addText(dock, label, x + dx, y + dy, {anchor: dx < 0 ? "end" : dx ? "start" : "middle",
        size, weight: selected ? 740 : 650, color: selected ? GOLD_WHITE : pen, halo: background, strokeWidth: 2.8});
      target.append(dock);
    }
  }

  function render() {
    const {clientWidth: width, clientHeight: height} = stage;
    if (width < 35 || height < 35) return;
    const focusedDock = svg.contains(document.activeElement) && document.activeElement.dataset.dock;
    const camera = cameras[viewState.mode];
    chart = viewport(width, height, HOME, cameras.chart.zoom, cameras.chart.center);
    diagram = viewport(width, height, DIAGRAM_HOME, cameras.diagram.zoom, cameras.diagram.center, cameras.diagram.padding);
    stage.dataset.mode = viewState.mode;
    stage.dataset.sdk = String(Boolean(sdk));
    stage.dataset.zoomed = String(camera.zoom > 1);
    document.querySelector("#compass").hidden = viewState.mode !== "chart";
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("aria-label", `Washington State Ferries ${viewState.mode}`);
    if (sdk && viewState.mode === "chart") {
      sdk.setExtent(chart.extent);
      sdk.setSelection(viewState);
    }
    svg.replaceChildren();
    draw(svg, width, height, {interactive: true});
    if (focusedDock) svg.querySelector(`[data-dock="${focusedDock}"]`)?.focus({preventScroll: true});
    document.querySelector("#zoom-in").disabled = camera.zoom >= MAX_ZOOM;
    document.querySelector("#zoom-out").disabled = camera.zoom <= 1;
  }

  function queueRender() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  }

  function setCenter(camera, x, y) {
    const {xmin, ymin, xmax, ymax} = camera.bounds;
    camera.center = [Math.max(xmin, Math.min(xmax, x)), Math.max(ymin, Math.min(ymax, y))];
  }

  function setZoom(next, from = [0, 0], to = from) {
    const camera = cameras[viewState.mode];
    const zoom = Math.min(MAX_ZOOM, Math.max(1, next));
    if (zoom === camera.zoom && (zoom === 1 || (from[0] === to[0] && from[1] === to[1]))) return false;
    const baseScale = viewport(stage.clientWidth, stage.clientHeight, camera.bounds, 1, camera.center, camera.padding).scale;
    if (zoom === 1) camera.center = midpoint(camera.bounds);
    else setCenter(camera,
      camera.center[0] + (from[0] / camera.zoom - to[0] / zoom) / baseScale,
      camera.center[1] + (from[1] / camera.zoom - to[1] / zoom) / baseScale);
    camera.zoom = zoom;
    queueRender();
    return true;
  }

  function fit() {
    const camera = cameras[viewState.mode];
    camera.center = midpoint(camera.bounds);
    camera.zoom = 1;
    queueRender();
  }

  function offsetFromCenter(clientX, clientY) {
    const bounds = svg.getBoundingClientRect();
    return [clientX - bounds.left - bounds.width / 2, bounds.top + bounds.height / 2 - clientY];
  }

  let drag;
  let dragMoved = false;
  let pinch;
  const touchPointers = new Map();

  function updatePinch() {
    const [a, b] = touchPointers.values();
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const anchor = offsetFromCenter((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
    if (pinch && pinch.distance > 0) setZoom(cameras[viewState.mode].zoom * distance / pinch.distance, pinch.anchor, anchor);
    pinch = {distance, anchor};
  }

  svg.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      touchPointers.set(event.pointerId, event);
      if (touchPointers.size === 2) {
        for (const id of touchPointers.keys()) svg.setPointerCapture(id);
        drag = undefined;
        dragMoved = true;
        updatePinch();
        return;
      }
    }
    if (!event.isPrimary) return;
    dragMoved = false;
    const camera = cameras[viewState.mode];
    if (event.target.closest("[data-dock]") || event.button !== 0 || camera.zoom <= 1) return;
    const scale = viewState.mode === "chart" ? chart.scale : diagram.scale;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, center: camera.center, camera, scale};
  });
  svg.addEventListener("pointermove", (event) => {
    if (touchPointers.has(event.pointerId)) {
      touchPointers.set(event.pointerId, event);
      if (touchPointers.size === 2) {
        updatePinch();
        return;
      }
    }
    if (!drag || event.pointerId !== drag.id) return;
    if (!event.buttons) { drag = undefined; return; }
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 4 && !dragMoved) return;
    dragMoved = true;
    if (!svg.hasPointerCapture(event.pointerId)) svg.setPointerCapture(event.pointerId);
    setCenter(drag.camera, drag.center[0] - (event.clientX - drag.x) / drag.scale,
      drag.center[1] + (event.clientY - drag.y) / drag.scale);
    queueRender();
  });
  for (const type of ["pointerup", "pointercancel"]) {
    svg.addEventListener(type, (event) => {
      if (touchPointers.delete(event.pointerId)) pinch = undefined;
      if (drag?.id === event.pointerId) drag = undefined;
    });
  }
  svg.addEventListener("lostpointercapture", (event) => { if (drag?.id === event.pointerId) drag = undefined; });
  for (const type of ["touchstart", "touchmove"]) {
    svg.addEventListener(type, (event) => { if (event.touches.length > 1) event.preventDefault(); }, {passive: false});
  }

  svg.addEventListener("wheel", (event) => {
    if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
    const delta = Math.max(-150, Math.min(150, event.deltaY * unit));
    const factor = Math.exp(-delta * (event.ctrlKey ? .012 : .003));
    const changed = setZoom(cameras[viewState.mode].zoom * factor, offsetFromCenter(event.clientX, event.clientY));
    if (changed || event.ctrlKey) event.preventDefault();
  }, {passive: false});
  svg.addEventListener("dblclick", (event) => {
    if (event.target.closest("[data-dock]")) return;
    const factor = event.shiftKey ? 1 / ZOOM_STEP : ZOOM_STEP;
    setZoom(cameras[viewState.mode].zoom * factor, offsetFromCenter(event.clientX, event.clientY));
  });

  svg.addEventListener("click", async (event) => {
    if (!sdk || viewState.mode !== "chart" || dragMoved || event.target.closest("[data-dock]")) return;
    const bounds = svg.getBoundingClientRect();
    const clickedState = viewState;
    const result = await sdk.hit(event.clientX - bounds.left, event.clientY - bounds.top).catch(() => null);
    if (!result || clickedState !== viewState) return;
    if (result.dock) onDock(result.dock);
    else if (result.route) onRoute(result.route);
  });

  document.querySelector("#zoom-in").addEventListener("click", () => setZoom(cameras[viewState.mode].zoom * ZOOM_STEP));
  document.querySelector("#zoom-out").addEventListener("click", () => setZoom(cameras[viewState.mode].zoom / ZOOM_STEP));
  document.querySelector("#reset-camera").addEventListener("click", fit);
  new ResizeObserver(queueRender).observe(stage);
  render();

  if (window.WebGL2RenderingContext) import("./sdk-chart.js").then(({startSdk}) => startSdk({
    polygons, extent: chart.extent, land: LAND, outline: COAST, network: data, selection: viewState,
  }))
    .then((controller) => { if (controller) { sdk = controller; render(); } })
    .catch(() => { document.querySelector("#sdk-map").replaceChildren(); });

  return {
    update(next) { viewState = next; render(); },
    fit,
    focusIslands() {
      if (viewState.mode !== "chart") return;
      const {clientWidth, clientHeight} = stage;
      cameras.chart.center = midpoint(ISLANDS);
      cameras.chart.zoom = Math.min(3.3, viewport(clientWidth, clientHeight, ISLANDS).scale / viewport(clientWidth, clientHeight, HOME).scale);
      queueRender();
    },
    download() {
      const width = 1120;
      const height = 830;
      const output = element("svg", {xmlns: NS, width, height, viewBox: `0 0 ${width} ${height}`});
      const full = {mode: "chart", sidney: viewState.sidney, legs: null, docks: null};
      draw(output, width, height, {state: full, chart: viewport(width, height, HOME), forceGround: true});
      output.append(element("rect", {x: 20, y: 23, width: 370, height: 107, rx: 4, fill: "#0f2931", opacity: .95}));
      addText(output, "Washington State Ferries", 34, 58, {size: 28, anchor: "start"});
      addText(output, "19 Washington terminals · Nov 24–Dec 6, 2026", 34, 92, {size: 14, anchor: "start"});
      addText(output, "30 Day Map Challenge · WSDOT / U.S. Census / Natural Earth", 18, height - 20, {size: 12, anchor: "start", halo: CHART_WATER});
      Object.values(regions).forEach(({name, color}, index) => {
        const y = 107 + index * 26;
        drawLine(output, [[924, y], [951, y]], color, 3);
        addText(output, name, 962, y, {anchor: "start", size: 14, halo: CHART_WATER});
      });
      const inset = element("svg", {x: 746, y: 590, width: 354, height: 207, viewBox: "0 0 354 207"});
      draw(inset, 354, 207, {state: full, chart: viewport(354, 207, ISLANDS), forceGround: true, only: ["1", "10", "15", "18", "13"]});
      inset.append(element("rect", {x: .5, y: .5, width: 353, height: 206, fill: "none", stroke: "#b6cabb", "stroke-width": 1}));
      addText(inset, "SAN JUAN ISLANDS", 13, 17, {size: 11, anchor: "start", spacing: 1.2, halo: CHART_WATER});
      output.append(inset);
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(output)], {type: "image/svg+xml"}));
      const link = document.createElement("a");
      link.href = url;
      link.download = "washington-state-ferries-chart.svg";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
}
