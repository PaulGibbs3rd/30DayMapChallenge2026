import { createLocator } from "./locator.js";
import { createCoordinateLab } from "./coordinate-lab.js";

const attractions = [
  { id: "hotel", name: "Hotel 9999999999", x: 55, y: 24, side: "right" },
  {
    id: "theater", name: "John Nelson Theater", x: 23, y: 54, side: "right",
    quote: "Now projecting. Always projecting.",
    description: "John Nelson’s One Minute Map Hacks. The program repeats until you leave the theater."
  },
  {
    id: "airport", name: "Lat/Long International Airport", x: 84, y: 47, side: "left",
    quote: "Departures have been swapped with arrivals.",
    description: "New York cleared for departure with [−74.0060, 40.7128]. After someone flipped the pair, arrivals got [40.7128, −74.0060]. GeoJSON reads longitude first, so both pairs pass a range check and only one lands in New York.",
    source: ["GeoJSON coordinate order", "https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1"]
  },
  {
    id: "trench", name: "NoData Trench", x: 88, y: 87, side: "left",
    quote: "Depth unmeasured. Printed as −9,999 m anyway.",
    description: "The checkerboard marks missing raster cells. Some rasters store a number such as −9999 as a flag for missing measurements. A chart that reads the flag as a depth gets this remarkably consistent trench.",
    source: ["USGS raster example", "https://pubs.usgs.gov/tm/14/a01/pdf/tm14-a1.pdf"]
  },
  {
    id: "customs", name: "Shapefile Customs", x: 56, y: 81, side: "right",
    quote: "Please declare all accompanying files.",
    description: "The .shp, .shx, and .dbf came through together. Lost property has the .prj, which carries the coordinate-system information. Please collect it before exploring the island.",
    source: ["Esri shapefile components", "https://doc.esri.com/en/arcgis-pro/latest/tool-reference/appendices/geoprocessing-considerations-for-shapefile-output.html"]
  },
  {
    id: "park", name: "Bowtie National Park", x: 26, y: 29, side: "left",
    quote: "The boundary crosses itself at the scenic overlook.",
    description: "The park’s boundary ring crosses itself at the center of the bow tie. A GIS geometry check flags that crossing as an error. The park has installed a bench.",
    source: ["Esri geometry checks", "https://doc.esri.com/en/arcgis-pro/latest/help/data/validating-data/invalid-geometry.html"]
  },
  {
    id: "beach", name: "Buffer Beach", x: 27, y: 75, side: "left",
    quote: "Please stay 0.01 degrees from the lifeguard.",
    description: "The lifeguard wanted a setback in meters and the survey came back in degrees. If the ring looks generous, ask which units the buffer used.",
    source: ["Esri buffer distance units", "https://doc.esri.com/en/arcgis-pro/latest/tool-reference/analysis/buffer.html"]
  }
];

const guests = [
  { id: "parcel-404", name: "Parcel 404", coordinates: [null, null] },
  { id: "unmatched-address", name: "Unmatched Address", coordinates: [null, null] },
  { id: "missing-bus-stop", name: "Missing Bus Stop", coordinates: [null, null] },
  { id: "prime-meridian-survey", name: "Prime Meridian Survey", coordinates: [0, 8] },
  { id: "weather-float", name: "Weather Float", coordinates: [-9, null] }
];
const guestLocations = new Map();

const playlistId = "PLPjPOZQjCWEnsT8RPYluAx3Eqe4ZVxDvS";
const dialog = document.querySelector("#attraction-dialog");
const player = document.querySelector("#theater-player");
const screeningRoom = document.querySelector("#screening-room");
const sourceLink = document.querySelector("#attraction-source");
const nativeSwitch = document.querySelector("#default-checkbox");
const calciteSwitch = document.querySelector("#default-switch");
const nativeLabel = document.querySelector("#native-label");
const calciteLabel = document.querySelector("#calcite-label");
const reset = document.querySelector("#reset-register");
const rows = document.querySelector("#register-rows");
const arrivals = document.querySelector("#arrivals");
const locator = createLocator();
const lab = createCoordinateLab(locator, setDefaults, saveGuestLocation);
const labSection = document.querySelector("#coordinate-lab");
const labHeading = document.querySelector("#lab-heading");
const airportExample = document.querySelector("#airport-example");
let useDefaults = false;
let previousFocus;

function span(className, label) {
  const element = document.createElement("span");
  element.className = className;
  element.textContent = label;
  return element;
}

function openAttraction(attraction, trigger) {
  if (attraction.id === "hotel") {
    document.querySelector("#register-heading").focus({ preventScroll: true });
    document.querySelector("#hotel").scrollIntoView({ block: "start" });
    return;
  }

  previousFocus = trigger;
  document.querySelector("#dialog-title").textContent = attraction.name;
  document.querySelector("#dialog-quote").textContent = attraction.quote;
  document.querySelector("#dialog-description").textContent = attraction.description;
  airportExample.hidden = attraction.id !== "airport";
  sourceLink.hidden = !attraction.source;
  if (attraction.source) {
    const [label, href] = attraction.source;
    sourceLink.href = href;
    sourceLink.textContent = `${label} ↗`;
  }

  screeningRoom.hidden = attraction.id !== "theater";
  if (!screeningRoom.hidden) {
    const video = document.createElement("iframe");
    const embed = new URL("https://www.youtube.com/embed/videoseries");
    embed.search = new URLSearchParams({ list: playlistId, loop: "1", playsinline: "1" });
    video.src = embed.href;
    video.title = "John Nelson’s One Minute Map Hacks";
    video.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    video.allowFullscreen = true;
    video.referrerPolicy = "strict-origin-when-cross-origin";
    player.replaceChildren(video);
  }

  dialog.showModal();
}

function renderAttractions() {
  const markers = document.querySelector("#map-markers");
  const list = document.querySelector("#attraction-list");

  attractions.forEach((attraction, index) => {
    const number = String(index + 1);
    const pin = document.createElement("button");
    pin.className = `map-pin label-${attraction.side}`;
    pin.style.left = `${attraction.x}%`;
    pin.style.top = `${attraction.y}%`;
    pin.type = "button";
    pin.setAttribute("aria-label", `Visit ${attraction.name}`);
    pin.append(span("pin-number", number), span("pin-name", attraction.name));
    pin.addEventListener("click", () => openAttraction(attraction, pin));
    markers.append(pin);

    const item = document.createElement("li");
    const button = document.createElement("button");
    const arrow = span("attraction-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    button.className = "attraction-link";
    button.type = "button";
    button.append(span("attraction-number", number), span("attraction-name", attraction.name), arrow);
    button.addEventListener("click", () => openAttraction(attraction, button));
    item.append(button);
    list.append(item);
  });
}

function formatPair(coordinates) {
  return coordinates.map(value => value === null ? "NULL" : `${value}°`).join(", ");
}

function openLab() {
  const hash = `#${labSection.id}`;
  if (location.hash !== hash) history.pushState(null, "", hash);
  labHeading.focus({ preventScroll: true });
  labSection.scrollIntoView({ block: "start" });
}

function renderRegister() {
  const plotted = [];
  let islandCount = 0;
  rows.replaceChildren();

  for (const guest of guests) {
    const saved = guestLocations.get(guest.id);
    const coordinates = saved ?? (useDefaults ? guest.coordinates.map(value => value ?? 0) : guest.coordinates);
    const located = coordinates.every(value => value !== null);
    const checkedIn = located && coordinates.every(value => value === 0);
    if (checkedIn) islandCount++;
    if (located && !checkedIn) plotted.push(coordinates);

    const row = rows.insertRow();
    row.classList.toggle("checked-in", checkedIn);
    const name = document.createElement("th");
    name.scope = "row";
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.className = "guest-link";
    inspect.textContent = guest.name;
    inspect.addEventListener("click", () => {
      lab.selectGuest(guest, saved ?? guest.coordinates);
      openLab();
    });
    name.append(inspect);
    row.append(name);
    row.insertCell().textContent = formatPair(guest.coordinates);
    const plottedCell = row.insertCell();
    plottedCell.textContent = located ? formatPair(coordinates) : "—";
    if (saved) plottedCell.append(" ", span("saved-location", "Saved"));
    row.insertCell().textContent = checkedIn ? "At Null Island" : located ? "Elsewhere" : "Awaiting location";
  }

  arrivals.value = `${islandCount} ${islandCount === 1 ? "arrival" : "arrivals"} at 0°, 0°`;
  reset.disabled = !useDefaults && guestLocations.size === 0;
  locator.setArrivals(plotted, islandCount);
}

function saveGuestLocation(guest, coordinates) {
  guestLocations.set(guest.id, coordinates);
  renderRegister();
}

function setDefaults(value) {
  useDefaults = value;
  nativeSwitch.checked = value;
  calciteSwitch.checked = value;
  renderRegister();
  lab.setDefaults(value);
}

document.querySelector("#watch-on-youtube").href = `https://www.youtube.com/playlist?list=${playlistId}`;
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  player.replaceChildren();
  previousFocus?.focus();
});
airportExample.addEventListener("click", () => {
  previousFocus = null;
  dialog.close();
  lab.loadCoordinates([-74.006, 40.7128], "New York example");
  openLab();
});

nativeSwitch.addEventListener("change", () => setDefaults(nativeSwitch.checked));
calciteSwitch.addEventListener("calciteSwitchChange", () => setDefaults(calciteSwitch.checked));
document.querySelector("#show-guests").addEventListener("click", event => {
  if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  locator.resetView();
  openLab();
});
reset.addEventListener("click", () => {
  guestLocations.clear();
  setDefaults(false);
  lab.resetGuestPlots();
  if (calciteLabel.hidden) nativeSwitch.focus();
  else calciteSwitch.setFocus();
});

Promise.all([customElements.whenDefined("calcite-switch"), customElements.whenDefined("calcite-label")]).then(() => {
  const hadFocus = document.activeElement === nativeSwitch;
  calciteLabel.hidden = false;
  nativeLabel.hidden = true;
  if (hadFocus) calciteSwitch.setFocus();
});

renderAttractions();
setDefaults(false);
