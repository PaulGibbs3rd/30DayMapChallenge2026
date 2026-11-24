const projectedWorld = { wkid: 54035 };
const geographic = { wkid: 4326 };
const longitudeLimit = 179.9999;
const latitudeLimit = 89.9999;

export async function initializeMap(coffees, onSelect) {
  const [sdk, land] = await Promise.all([loadSdk(), loadLand()]);
  const [
    ArcGISMap, Graphic, GraphicsLayer, Point, Polygon, Polyline,
    project, shapePreservingProject, reactiveUtils,
  ] = await sdk.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/Graphic.js",
    "@arcgis/core/layers/GraphicsLayer.js",
    "@arcgis/core/geometry/Point.js",
    "@arcgis/core/geometry/Polygon.js",
    "@arcgis/core/geometry/Polyline.js",
    "@arcgis/core/geometry/operators/projectOperator.js",
    "@arcgis/core/geometry/operators/shapePreservingProjectOperator.js",
    "@arcgis/core/core/reactiveUtils.js",
  ]);
  await Promise.all([project.load(), shapePreservingProject.load()]);

  function projectPoint([longitude, latitude]) {
    return project.execute(new Point({ longitude, latitude, spatialReference: geographic }), projectedWorld);
  }

  const longitudeSteps = steps(-longitudeLimit, longitudeLimit, 3);
  const latitudeSteps = steps(-latitudeLimit, latitudeLimit, 2);
  const worldRing = [
    ...latitudeSteps.map((latitude) => [-longitudeLimit, latitude]),
    ...longitudeSteps.slice(1).map((longitude) => [longitude, latitudeLimit]),
    ...latitudeSteps.slice(0, -1).reverse().map((latitude) => [longitudeLimit, latitude]),
    ...longitudeSteps.slice(0, -1).reverse().map((longitude) => [longitude, -latitudeLimit]),
  ];
  const water = new Polygon({
    rings: [worldRing.map((coordinate) => {
      const point = projectPoint(coordinate);
      return [point.x, point.y];
    })],
    spatialReference: projectedWorld,
  });
  const worldExtent = water.extent.clone().expand(1.085);
  const mapLayer = new GraphicsLayer({ title: "Natural Earth land and reference lines" });
  const landSymbol = fill("#b68b65", "#79563c", 0.55);
  mapLayer.add(new Graphic({ geometry: water, symbol: fill("#dfc09a", "#9e7653", 0.8) }));

  for (const { geometry } of land.features) {
    const parts = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
    for (const rings of parts) {
      const polygon = new Polygon({ rings, spatialReference: geographic });
      const projected = shapePreservingProject.execute(polygon, projectedWorld);
      if (projected) mapLayer.add(new Graphic({ geometry: projected, symbol: landSymbol }));
    }
  }

  const gridPaths = [
    ...[-60, -30, 30, 60].map((latitude) => longitudeSteps.map((longitude) => [longitude, latitude])),
    ...steps(-150, 150, 30).map((longitude) => latitudeSteps.map((latitude) => [longitude, latitude])),
  ];
  const tropicPaths = [-23.436, 0, 23.436].map((latitude) => longitudeSteps.map((longitude) => [longitude, latitude]));
  mapLayer.addMany([
    gridGraphic(gridPaths, [116, 87, 61, 0.18], "solid"),
    gridGraphic(tropicPaths, [116, 87, 61, 0.62], "short-dash"),
  ]);

  function gridGraphic(paths, color, style) {
    const coordinates = paths.map((path) => path.map((coordinate) => {
      const point = projectPoint(coordinate);
      return [point.x, point.y];
    }));
    return new Graphic({
      geometry: new Polyline({ paths: coordinates, spatialReference: projectedWorld }),
      symbol: { type: "simple-line", color, width: 0.65, style },
    });
  }

  const positions = new Map(coffees.map((coffee) => [coffee.id, projectPoint(coffee.geometry.coordinates)]));
  const mapElement = document.createElement("arcgis-map");
  const zoom = document.createElement("arcgis-zoom");
  zoom.slot = "top-left";
  mapElement.append(zoom);
  mapElement.setAttribute("aria-label", "Equal Earth map of coffee origins");
  mapElement.spatialReference = projectedWorld;
  mapElement.map = new ArcGISMap({ layers: [mapLayer] });
  mapElement.extent = worldExtent;
  document.querySelector("#map-mount").append(mapElement);
  await mapElement.viewOnReady();

  const view = mapElement.view;
  view.background = { color: getComputedStyle(mapElement).getPropertyValue("--map").trim() };
  view.constraints = { snapToZoom: false, rotationEnabled: false, minScale: 0, maxScale: 5000 };
  view.extent = worldExtent;

  const pinLayer = document.querySelector("#map-pins");
  const pinButtons = new Map();
  let visibleCoffees = [];
  let activeCoffee = null;
  let pinnedCoffees = [];
  let frame;

  reactiveUtils.watch(() => [view.extent, view.width, view.height], schedulePins);

  function schedulePins() {
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      drawPins();
    });
  }

  function drawPins() {
    const groups = [];
    for (const coffee of visibleCoffees) {
      const point = view.toScreen(positions.get(coffee.id));
      if (!point || !inside(point)) continue;
      const nearby = groups.find((group) => Math.hypot(group.x - point.x, group.y - point.y) < 28);
      if (nearby) {
        nearby.coffees.push(coffee);
      } else {
        groups.push({ x: point.x, y: point.y, coffees: [coffee] });
      }
    }

    const current = new Set();
    for (const group of groups) {
      const id = group.coffees.map((coffee) => coffee.id).join("|");
      current.add(id);
      let button = pinButtons.get(id);
      if (!button) {
        button = createPin(group.coffees);
        pinButtons.set(id, button);
        pinLayer.append(button);
      }
      const selected = group.coffees.includes(activeCoffee);
      const pinned = group.coffees.filter((coffee) => pinnedCoffees.includes(coffee));
      const label = selected ? activeCoffee.properties.region : pinned.length === 1 ? pinned[0].properties.region : "";
      const names = group.coffees.map(({ properties }) => `${properties.region}, ${properties.country}`);
      button.setAttribute("aria-label", names.length > 1 ? `Zoom to ${names.length} coffees. ${names.join("; ")}` : names[0]);
      button.title = names.join(" · ");
      button.classList.toggle("is-active", selected);
      button.classList.toggle("is-pinned", pinned.length > 0);
      button.classList.toggle("label-left", group.x > view.width - 150);
      button.style.left = `${group.x}px`;
      button.style.top = `${group.y}px`;
      const labelElement = button.querySelector(".pin-label");
      labelElement.hidden = !label;
      labelElement.textContent = label;
    }
    for (const [id, button] of pinButtons) {
      if (current.has(id)) continue;
      button.remove();
      pinButtons.delete(id);
    }
  }

  function createPin(group) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-pin";
    if (group.length > 1) {
      button.classList.add("is-cluster");
      button.textContent = String(group.length);
      button.addEventListener("click", () => {
        const center = group.map(({ id }) => positions.get(id));
        const x = center.reduce((sum, point) => sum + point.x, 0) / center.length;
        const y = center.reduce((sum, point) => sum + point.y, 0) / center.length;
        goTo({ target: new Point({ x, y, spatialReference: projectedWorld }), scale: view.scale / 3 });
      });
    } else {
      const bean = document.createElement("span");
      bean.className = "bean";
      bean.setAttribute("aria-hidden", "true");
      button.append(bean);
      button.addEventListener("click", () => onSelect(group[0]));
    }
    const label = document.createElement("span");
    label.className = "pin-label";
    label.setAttribute("aria-hidden", "true");
    button.append(label);
    return button;
  }

  function inside(point) {
    return point.x >= 13 && point.x <= view.width - 13 && point.y >= 13 && point.y <= view.height - 13;
  }

  function goTo(target) {
    view.goTo(target, { animate: !matchMedia("(prefers-reduced-motion: reduce)").matches }).catch((error) => {
      if (error.name !== "AbortError") console.error(error);
    });
  }

  return {
    render(visible, selected, pinned) {
      visibleCoffees = visible;
      activeCoffee = selected;
      pinnedCoffees = pinned;
      schedulePins();
    },
    ensureVisible(coffee) {
      const position = positions.get(coffee.id);
      const screen = view.toScreen(position);
      if (screen && !inside(screen)) goTo({ target: position, scale: view.scale });
    },
    reset() {
      goTo(worldExtent);
    },
  };
}

function fill(color, border, width) {
  return { type: "simple-fill", color, outline: { color: border, width } };
}

function steps(minimum, maximum, step) {
  const values = [];
  for (let value = minimum; value < maximum; value += step) values.push(value);
  return [...values, maximum];
}

async function loadLand() {
  const response = await fetch(new URL("./data/land.geojson", import.meta.url));
  if (!response.ok) throw new Error(`Natural Earth land returned HTTP ${response.status}.`);
  return response.json();
}

async function loadSdk() {
  const script = document.createElement("script");
  script.type = "module";
  script.async = true;
  script.src = "https://js.arcgis.com/5.2/";
  let timer;
  let rejectLoad;
  const failure = new Promise((resolve, reject) => {
    rejectLoad = () => reject(new Error("The ArcGIS SDK could not load."));
    timer = setTimeout(rejectLoad, 18000);
    script.addEventListener("error", rejectLoad, { once: true });
  });
  document.head.append(script);
  try {
    await Promise.race([customElements.whenDefined("arcgis-map"), failure]);
    return globalThis.$arcgis;
  } finally {
    clearTimeout(timer);
    script.removeEventListener("error", rejectLoad);
  }
}
