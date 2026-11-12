const stations = [
  {
    name: "Port Townsend",
    slug: "port-townsend",
    location: [-122.760614, 48.135743],
    westLabel: true,
    area: "Admiralty Inlet",
    description: "At the entrance to Puget Sound, listen for whale calls, ships bound for Seattle and Tacoma, and the ferry crossing to Whidbey Island."
  },
  {
    name: "Bush Point",
    slug: "bush-point",
    location: [-122.6040035, 48.0336664],
    area: "Whidbey Island",
    description: "This hydrophone off western Whidbey Island listens into Admiralty Inlet, a passage shared by whales and large vessels."
  },
  {
    name: "Sunset Bay",
    slug: "sunset-bay",
    location: [-122.33393605795372, 47.86497296593844],
    area: "Possession Sound",
    description: "Between Edmonds and Mukilteo, this nearshore hydrophone listens where Possession Sound meets central Puget Sound."
  },
  {
    name: "Point Robinson",
    slug: "point-robinson",
    location: [-122.37267, 47.388383],
    westLabel: true,
    historic: true,
    area: "Maury Island",
    description: "This site off Maury Island has recorded close orca passes. Orcasound’s public listening directory currently omits the feed."
  }
];

const chart = document.querySelector("#chart");
const canvas = chart.querySelector("canvas");
const markers = chart.querySelector(".markers");
const mapMessage = document.querySelector("#map-message");
const stationList = document.querySelector("#station-list");
const detail = document.querySelector("#station-detail");
const stationPosition = document.querySelector("#station-position");
const stationName = document.querySelector("#station-name");
const stationDescription = document.querySelector("#station-description");
const stationLink = document.querySelector("#station-link");

function label(text, className, tag = "span") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function stationButton(station, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-controls", detail.id);
  if (station.historic) button.dataset.historic = "";
  button.addEventListener("click", () => selectStation(station));
  return button;
}

const controls = stations.map(station => {
  const marker = stationButton(station, "marker");
  marker.setAttribute("aria-label", station.name + (station.historic ? ", documented site" : ", feed page"));
  if (station.westLabel) marker.dataset.west = "";
  marker.append(label("", "marker-point"), label(station.name, "marker-label"));
  markers.append(marker);

  const option = stationButton(station, "station-option");
  option.append(label(station.name, "option-name", "strong"), label(station.historic ? "Site info" : "Feed", "option-type"));
  stationList.append(option);
  return { station, marker, option };
});

function selectStation(station) {
  for (const control of controls) {
    const pressed = String(control.station === station);
    control.marker.setAttribute("aria-pressed", pressed);
    control.option.setAttribute("aria-pressed", pressed);
  }

  const [longitude, latitude] = station.location;
  stationPosition.textContent = `${station.area} · ${latitude.toFixed(2)}° N, ${Math.abs(longitude).toFixed(2)}° W`;
  stationName.textContent = station.name;
  stationDescription.textContent = station.description;
  stationLink.href = "https://live.orcasound.net/listen/" + station.slug;
  stationLink.textContent = station.historic ? "View station profile ↗" : "Open Orcasound feed ↗";
  stationLink.setAttribute("aria-label", stationLink.textContent.replace(" ↗", "") + " for " + station.name + " (opens in a new tab)");
  detail.hidden = false;
}

selectStation(stations[0]);

const places = [
  { name: "Everett", location: [-122.202, 47.979], type: "city", desktop: true },
  { name: "Seattle", location: [-122.332, 47.606], type: "city" },
  { name: "Bremerton", location: [-122.632, 47.568], type: "city" },
  { name: "Tacoma", location: [-122.444, 47.253], type: "city" },
  { name: "Whidbey Island", location: [-122.52, 48.15], type: "land" },
  { name: "Olympic Peninsula", location: [-123.04, 47.86], type: "land", desktop: true },
  { name: "Kitsap Peninsula", location: [-122.69, 47.70], type: "land" },
  { name: "Vashon Island", location: [-122.47, 47.457], type: "land", desktop: true },
  { name: "Strait of Juan de Fuca", location: [-123.19, 48.215], type: "water", desktop: true },
  { name: "Hood Canal", location: [-122.90, 47.74], type: "water", angle: 1.03 },
  { name: "Puget Sound", location: [-122.44, 47.72], type: "water", angle: -1.45 }
];

const centerLongitude = -122.63;
const north = 48.33;
const south = 47.19;
const longitudeRatio = Math.cos(47.76 * Math.PI / 180);
let shoreline = [];

function drawChart() {
  const { width, height } = chart.getBoundingClientRect();
  if (!width || !height) return;

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const scale = Math.max(height / (north - south), width / (2.60 * longitudeRatio));
  const centerLatitude = (north + south) / 2;
  const project = ([longitude, latitude]) => [
    width / 2 + (longitude - centerLongitude) * scale * longitudeRatio,
    height / 2 + (centerLatitude - latitude) * scale
  ];

  for (const { station, marker } of controls) {
    const [x, y] = project(station.location);
    marker.style.left = x + "px";
    marker.style.top = y + "px";
  }

  const context = canvas.getContext("2d");
  if (!context) return;
  context.scale(pixelRatio, pixelRatio);
  const water = context.createLinearGradient(0, 0, width, height);
  water.addColorStop(0, "#153e49");
  water.addColorStop(1, "#0b2d39");
  context.fillStyle = water;
  context.fillRect(0, 0, width, height);

  const land = context.createLinearGradient(0, 0, width, height);
  land.addColorStop(0, "#58756a");
  land.addColorStop(1, "#385e55");
  context.fillStyle = land;
  context.strokeStyle = "#8db29d75";
  context.lineWidth = 0.8;
  for (const county of shoreline) {
    context.beginPath();
    for (const ring of county) {
      for (const [index, coordinate] of ring.entries()) {
        const [x, y] = project(coordinate);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    }
    context.fill("evenodd");
    context.stroke();
  }

  drawGrid(context, width, height, project);
  drawPlaces(context, width, height, project);
  drawScale(context, width, height, scale);
}

function drawGrid(context, width, height, project) {
  context.strokeStyle = "#cfe7d62b";
  context.lineWidth = 0.7;
  context.setLineDash([3, 5]);
  context.beginPath();
  for (let longitude = -124; longitude <= -121; longitude += 0.25) {
    const [x] = project([longitude, north]);
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let latitude = 47; latitude <= 48.5; latitude += 0.25) {
    const [, y] = project([centerLongitude, latitude]);
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();
  context.setLineDash([]);
}

function drawPlaces(context, width, height, project) {
  for (const place of places) {
    if (place.desktop && width < 570) continue;
    const [x, y] = project(place.location);
    if (x < 25 || x > width - 25 || y < 18 || y > height - 26) continue;
    context.save();
    context.translate(x, y);
    context.rotate(place.angle ?? 0);
    context.lineWidth = 3;
    context.lineJoin = "round";
    if (place.type === "city") {
      context.fillStyle = "#fff0d5";
      context.strokeStyle = "#254b47";
      context.font = "600 12px system-ui";
      context.beginPath();
      context.arc(0, 0, 2.2, 0, 2 * Math.PI);
      context.fill();
      context.strokeText(place.name, 6, 4);
      context.fillText(place.name, 6, 4);
    } else {
      context.fillStyle = place.type === "water" ? "#c4e1df" : "#e1eddb";
      context.strokeStyle = place.type === "water" ? "#153d43" : "#44675a";
      context.font = place.type === "water" ? "italic 16px Georgia" : "500 11px system-ui";
      context.textAlign = "center";
      context.strokeText(place.name, 0, 0);
      context.fillText(place.name, 0, 0);
    }
    context.restore();
  }
}

function drawScale(context, width, height, scale) {
  const x = width - 22;
  const y = height - 22;
  const length = 10 * scale / 111.2;
  context.fillStyle = "#eef6e9";
  context.strokeStyle = "#eef6e9";
  context.lineWidth = 1;
  context.font = "11px system-ui";
  context.textAlign = "center";
  context.fillText("10 km", x - length / 2, y - 7);
  context.beginPath();
  context.moveTo(x - length, y - 4);
  context.lineTo(x - length, y);
  context.lineTo(x, y);
  context.lineTo(x, y - 4);
  context.stroke();

  context.fillText("N", x - 3, 25);
  context.beginPath();
  context.moveTo(x - 3, 30);
  context.lineTo(x + 2, 43);
  context.lineTo(x - 3, 40);
  context.lineTo(x - 8, 43);
  context.closePath();
  context.fill();
}

const audioPlayers = [...document.querySelectorAll(".recordings audio")];
for (const player of audioPlayers) {
  player.addEventListener("play", () => {
    for (const other of audioPlayers) {
      if (other !== player) other.pause();
    }
  });
  player.addEventListener("error", () => {
    player.nextElementSibling.hidden = false;
  });
}

new ResizeObserver(drawChart).observe(chart);

try {
  const response = await fetch(new URL("./shoreline.json", import.meta.url));
  if (!response.ok) throw new Error("Shoreline response " + response.status);
  shoreline = await response.json();
  drawChart();
} catch {
  mapMessage.textContent = "Shoreline unavailable. You can still select a listening station.";
  mapMessage.hidden = false;
}
