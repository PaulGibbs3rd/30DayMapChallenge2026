import { DEFAULT_BEARING, compassDirection, eclipseAt, lightForBearing, projectSun } from "./light.js";
import noirStyle from "./basemap.js";

const stage = document.querySelector(".stage");
const viewport = document.querySelector("#viewport");
const scene = document.querySelector("#scene");
const slider = document.querySelector("#light-direction");
const bearingOutput = document.querySelector("#bearing");
const altitudeOutput = document.querySelector("#altitude");
const reset = document.querySelector("#reset");
const presets = Array.from(document.querySelectorAll("[data-bearing]"));
const status = document.querySelector("#scene-status");
const labels = document.querySelector("#map-labels");
const sky = document.querySelector(".black-sun-sky");
const sun = document.querySelector(".black-sun");
const sunStatus = document.querySelector("#sun-status");
const eclipseSlider = document.querySelector("#eclipse-progress");
const eclipseOutput = document.querySelector("#eclipse-coverage");
const totality = document.querySelector("#show-totality");
const compact = matchMedia("(max-width: 760px)");
let currentLight;

function setControlsEnabled(enabled) {
  for (const control of [slider, eclipseSlider, totality, reset, ...presets]) control.disabled = !enabled;
}

function setLight(bearing) {
  const light = lightForBearing(bearing);
  currentLight = { bearing, elevation: light.elevation };
  scene.environment.lighting.date = light.date;
  const direction = compassDirection(bearing);
  slider.value = String(bearing);
  slider.setAttribute("aria-valuetext", bearing + " degrees " + direction);
  bearingOutput.value = bearing + "° " + direction;
  altitudeOutput.textContent = light.elevation + "° high";
  presets.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.bearing) === bearing)));
  placeSun();
}

function placeSun() {
  const camera = scene.view?.camera;
  if (!camera || !currentLight) return;

  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  const screen = projectSun(currentLight.bearing, currentLight.elevation, camera, width, height);
  const radius = parseFloat(getComputedStyle(sun).width) / 2;
  const visible = screen !== null &&
    screen.x > -radius && screen.x < width + radius &&
    screen.y > -radius && screen.y < height + radius;
  sun.hidden = !visible;
  const caption = visible ? "Illustrative sunlight" : "Sun out of frame";
  if (sunStatus.textContent !== caption) sunStatus.textContent = caption;
  sky.classList.toggle("sun-in-frame", visible);
  if (visible) {
    sky.style.setProperty("--sun-x", screen.x + "px");
    sky.style.setProperty("--sun-y", screen.y + "px");
  }
}

function setEclipse(progress) {
  const { offset, coverage } = eclipseAt(progress);
  const atTotality = progress === 50;
  const covered = Math.round(coverage * 100);

  viewport.style.setProperty("--eclipse-shade", 0.73 * coverage ** 1.32);
  sky.style.setProperty("--sky-shade", 0.75 * coverage);
  sun.style.setProperty("--sun-glow", 1 - coverage);
  sun.style.setProperty("--moon-offset", offset * 100 + "%");
  sun.style.setProperty("--moon-opacity", Math.min(1, coverage * 26));
  sun.style.setProperty("--corona", coverage ** 9);
  eclipseSlider.value = String(progress);
  eclipseSlider.setAttribute("aria-valuetext", atTotality ? "Totality, 100 percent covered" :
    covered + " percent covered, " + (progress < 50 ? "eclipse begins" : "eclipse clears"));
  eclipseOutput.value = atTotality ? "100% · Totality" : covered + "% covered";
  totality.setAttribute("aria-pressed", String(atTotality));
}

function failScene(error) {
  console.error("Seattle in Shadow could not load the 3D scene.", error);
  status.textContent = "Interactive scene unavailable. Showing the opening view.";
  status.hidden = false;
  labels.hidden = true;
  setEclipse(0);
  stage.classList.remove("is-ready");
  stage.classList.add("is-unavailable");
  setControlsEnabled(false);
}

async function start() {
  await customElements.whenDefined("arcgis-scene");
  const [ArcGISMap, Basemap, VectorTileLayer, SceneLayer, Camera, Point, Environment, reactiveUtils] = await window.$arcgis.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/Basemap.js",
    "@arcgis/core/layers/VectorTileLayer.js",
    "@arcgis/core/layers/SceneLayer.js",
    "@arcgis/core/Camera.js",
    "@arcgis/core/geometry/Point.js",
    "@arcgis/core/views/3d/environment/Environment.js",
    "@arcgis/core/core/reactiveUtils.js",
  ]);
  const point = (longitude, latitude, z) => new Point({ longitude, latitude, z, spatialReference: { wkid: 4326 } });
  const camera = () => compact.matches
    ? new Camera({ position: point(-122.3498, 47.5955, 240), heading: 58, tilt: 86, fov: 63 })
    : new Camera({ position: point(-122.3513, 47.5944, 265), heading: 55, tilt: 86, fov: 64 });
  const buildings = new SceneLayer({
    portalItem: { id: "fd343811bb604dafa58f23a00e5c0fd0" },
    title: "Seattle 3D Buildings · 2015–16",
    popupEnabled: false,
    renderer: {
      type: "simple",
      symbol: {
        type: "mesh-3d",
        symbolLayers: [{
          type: "fill",
          material: { color: [185, 185, 185], colorMixMode: "replace" },
          edges: { type: "solid", color: [22, 22, 22, 0.29], size: 0.5 },
        }],
      },
    },
  });

  const base = new VectorTileLayer({ style: noirStyle, title: "Esri World Basemap" });
  const basemap = new Basemap({ baseLayers: [base], title: "Seattle in Shadow" });
  scene.map = new ArcGISMap({ basemap, ground: "world-elevation", layers: [buildings] });
  scene.environment = new Environment({
    atmosphereEnabled: false,
    starsEnabled: false,
    background: { type: "color", color: [0, 0, 0, 0] },
    lighting: {
      type: "sun",
      date: lightForBearing(DEFAULT_BEARING).date,
      directShadowsEnabled: true,
      cameraTrackingEnabled: false,
    },
  });
  scene.camera = camera();

  await Promise.all([scene.viewOnReady(), buildings.load(), base.load()]);
  const view = scene.view;
  view.constraints.altitude.min = 80;
  view.constraints.altitude.max = 2600;
  view.constraints.tilt.max = 88;
  await view.whenLayerView(buildings);

  setLight(DEFAULT_BEARING);
  setEclipse(0);
  setControlsEnabled(true);
  stage.classList.remove("is-unavailable");
  stage.classList.add("is-ready");
  status.hidden = true;
  labels.hidden = false;

  const anchors = [
    { element: document.querySelector("#smith-label"), point: point(-122.33151, 47.60186, 158) },
    { element: document.querySelector("#bay-label"), point: point(-122.3426, 47.5988, 0) },
  ];
  function placeLabels() {
    for (const anchor of anchors) {
      const screen = view.toScreen(anchor.point);
      anchor.element.hidden = !screen || screen.x < 50 || screen.y < 44 ||
        screen.x > viewport.clientWidth - 60 || screen.y > viewport.clientHeight - 32;
      if (anchor.element.hidden) continue;
      anchor.element.style.left = screen.x + "px";
      anchor.element.style.top = screen.y + "px";
    }
  }
  reactiveUtils.watch(() => [view.camera, view.width, view.height], () => {
    placeLabels();
    placeSun();
  }, { initial: true });
  slider.addEventListener("input", () => setLight(slider.valueAsNumber));
  eclipseSlider.addEventListener("input", () => setEclipse(eclipseSlider.valueAsNumber));
  totality.addEventListener("click", () => setEclipse(50));
  presets.forEach((button) => button.addEventListener("click", () => setLight(Number(button.dataset.bearing))));
  reset.addEventListener("click", () => {
    scene.camera = camera();
    setLight(DEFAULT_BEARING);
    setEclipse(0);
  });
  compact.addEventListener("change", () => { scene.camera = camera(); });
  reactiveUtils.watch(() => view.fatalError, (error) => { if (error) failScene(error); });
}

let timer;
const setupLimit = new Promise((_, reject) => {
  timer = setTimeout(() => reject(new Error("Timed out while opening the scene")), 45_000);
});
Promise.race([start(), setupLimit]).catch(failScene).finally(() => clearTimeout(timer));
