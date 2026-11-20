import { previewPoint, previewSize } from "./cartography.js";

const itinerary = Array.from(document.querySelectorAll("[data-stop]"));
const previous = document.querySelector("#previous-stop");
const next = document.querySelector("#next-stop");
const previewPins = document.querySelector("#preview-pins");
const mapStage = document.querySelector("#map-stage");
const scentLinks = Array.from(document.querySelectorAll("[data-jump-stop]"));
let selectedStop = 1;
let liveMap;

function selectStop(stop, reveal = false) {
  selectedStop = stop;
  for (const item of itinerary) {
    item.open = Number(item.dataset.stop) === stop;
  }
  for (const pin of previewPins.querySelectorAll("button")) {
    pin.setAttribute("aria-pressed", String(Number(pin.dataset.pin) === stop));
  }
  previous.disabled = stop === 1;
  next.disabled = stop === itinerary.length;
  liveMap?.select(stop);
  if (reveal) {
    itinerary[stop - 1].scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

for (const item of itinerary) {
  item.querySelector("summary").addEventListener("click", (event) => {
    if (item.open) return;
    event.preventDefault();
    selectStop(Number(item.dataset.stop));
  });
}

function selectLinkedStop() {
  const link = scentLinks.find((item) => item.hash === location.hash);
  if (link) selectStop(Number(link.dataset.jumpStop));
}

for (const link of scentLinks) {
  link.addEventListener("click", () => selectStop(Number(link.dataset.jumpStop)));
}
window.addEventListener("hashchange", selectLinkedStop);
previous.addEventListener("click", () => selectStop(selectedStop - 1, true));
next.addEventListener("click", () => selectStop(selectedStop + 1, true));
document.querySelector("#stop-navigation").hidden = false;
selectStop(selectedStop);
selectLinkedStop();

async function loadFeatures(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not read ${path} (${response.status})`);
  return (await response.json()).features;
}

const walkFeatures = loadFeatures("walk.geojson");
walkFeatures.then((features) => {
  for (const { geometry, properties } of features.filter((item) => item.properties.kind === "stop")) {
    const { stop, name } = properties;
    const [x, y] = previewPoint(geometry.coordinates, stop);
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.pin = stop;
    button.style.left = `${x * 100 / previewSize.width}%`;
    button.style.top = `${y * 100 / previewSize.height}%`;
    button.setAttribute("aria-label", `Stop ${stop}, ${name}`);
    button.setAttribute("aria-pressed", String(stop === selectedStop));
    button.addEventListener("click", () => selectStop(stop, true));
    previewPins.append(button);
  }
}).catch((error) => console.warn("Using the static route overview", error));

async function useLiveMap() {
  try {
    const [{ createMap }, base, walk] = await Promise.all([
      import("./map.js"), loadFeatures("basemap.geojson"), walkFeatures
    ]);
    const map = await createMap(document.querySelector("#walk-map"), base, walk, (stop) => {
      selectStop(stop, matchMedia("(max-width: 825px)").matches);
    });
    liveMap = map;
    liveMap.select(selectedStop);
    const fallback = document.querySelector("#map-fallback");
    const mapElement = document.querySelector("#walk-map");
    if (fallback.contains(document.activeElement)) mapElement.focus();
    fallback.inert = true;
    mapElement.inert = false;
    mapStage.classList.add("is-live");
    document.querySelector("#map-tools").hidden = false;
    document.querySelector("#reset-map").hidden = false;
  } catch (error) {
    console.warn("Using the route overview because the interactive map could not load", error);
  }
}

document.querySelector("#reset-map").addEventListener("click", () => liveMap.reset());
document.querySelector("#zoom-in").addEventListener("click", () => liveMap.zoom(1));
document.querySelector("#zoom-out").addEventListener("click", () => liveMap.zoom(-1));
if (globalThis.$arcgis) useLiveMap();
else document.querySelector("#arcgis-cdn").addEventListener("load", useLiveMap, { once: true });
