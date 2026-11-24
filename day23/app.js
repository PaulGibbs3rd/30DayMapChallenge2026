import { compareCoffees, filterCoffees, flavors, jasminePair } from "./catalog.js";
import { initializeMap } from "./map.js";

const filters = document.querySelector("#filters");
const menu = document.querySelector("#menu");
const menuCount = document.querySelector("#menu-count");
const flight = document.querySelector("#flight-content");
const flightStatus = document.querySelector("#flight-status");
const starterFlight = document.querySelector("#starting-flight");
const mapStatus = document.querySelector("#map-status");
const mapStage = document.querySelector("#map-stage");
const resetMap = document.querySelector("#reset-map");

let coffees = [];
let activeFlavor = "all";
let selectedCoffee = null;
let pinnedCoffees = [];
let originMap;

start().catch((error) => {
  console.error(error);
  menu.setAttribute("aria-busy", "false");
  menu.replaceChildren(element("p", "menu-message", "The coffee profiles could not load. Try reloading the page."));
  showMapError("The world map could not load.");
});

async function start() {
  const response = await fetch(new URL("./data/coffees.geojson", import.meta.url));
  if (!response.ok) throw new Error(`Coffee catalog returned HTTP ${response.status}.`);
  const catalog = await response.json();
  coffees = catalog.features;
  menu.setAttribute("aria-busy", "false");
  buildFilterButtons();
  refreshMenu();

  starterFlight.disabled = false;
  starterFlight.addEventListener("click", () => {
    pinnedCoffees = jasminePair.map((id) => coffees.find((coffee) => coffee.id === id));
    activeFlavor = "all";
    selectedCoffee = null;
    refreshMenu();
    refreshFlight();
    originMap?.reset();
    document.querySelector("#flight-heading").focus();
  });

  try {
    originMap = await initializeMap(coffees, selectCoffee);
    resetMap.disabled = false;
    resetMap.addEventListener("click", originMap.reset);
    mapStage.dataset.state = "ready";
    mapStatus.hidden = true;
    updateMap();
  } catch (error) {
    console.error(error);
    showMapError("The world map is unavailable. You can still browse all coffees in the tasting menu.");
  }
}

function buildFilterButtons() {
  for (const { id, label, color } of [{ id: "all", label: "All coffees" }, ...flavors]) {
    const button = element("button", "flavor-filter");
    button.type = "button";
    button.dataset.flavor = id;
    if (color) {
      const swatch = element("span", "swatch");
      swatch.style.setProperty("--flavor-color", color);
      swatch.setAttribute("aria-hidden", "true");
      button.append(swatch);
    }
    button.append(label);
    button.addEventListener("click", () => {
      activeFlavor = id;
      selectedCoffee = null;
      refreshMenu();
    });
    filters.append(button);
  }
}

function refreshMenu() {
  const visibleCoffees = filterCoffees(coffees, activeFlavor);
  menuCount.textContent = `${visibleCoffees.length} ${visibleCoffees.length === 1 ? "coffee" : "coffees"}`;
  for (const button of filters.children) {
    button.setAttribute("aria-pressed", String(button.dataset.flavor === activeFlavor));
  }
  if (selectedCoffee) {
    menu.replaceChildren(createCoffeeCard(selectedCoffee));
  } else {
    const list = element("ul", "menu-list");
    for (const coffee of visibleCoffees) list.append(createMenuItem(coffee));
    menu.replaceChildren(list);
  }
  menu.scrollTop = 0;
  updateMap(visibleCoffees);
}

function updateMap(visibleCoffees = filterCoffees(coffees, activeFlavor)) {
  originMap?.render(visibleCoffees, selectedCoffee, pinnedCoffees);
}

function createMenuItem(coffee) {
  const { region, country, notes } = coffee.properties;
  const item = element("li");
  const button = element("button", "menu-item");
  button.type = "button";
  button.dataset.coffeeId = coffee.id;
  button.append(
    element("span", "origin-name", region),
    element("span", "origin-country", country),
    element("span", "origin-notes", notes.join(" · ")),
  );
  button.addEventListener("click", () => selectCoffee(coffee));
  item.append(button);
  return item;
}

function selectCoffee(coffee) {
  selectedCoffee = coffee;
  refreshMenu();
  originMap?.ensureVisible(coffee);
  menu.querySelector("h3").focus({ preventScroll: !matchMedia("(max-width: 680px)").matches });
}

function createCoffeeCard(coffee) {
  const info = coffee.properties;
  const article = element("article", "coffee-card");
  const back = element("button", "back-button", "← Back to tasting menu");
  back.type = "button";
  back.addEventListener("click", () => {
    selectedCoffee = null;
    refreshMenu();
    menu.querySelector(`[data-coffee-id="${CSS.escape(coffee.id)}"]`)?.focus();
  });

  const title = element("h3", "", info.region);
  title.tabIndex = -1;
  const source = element("p", "source", "Notes reported by ");
  source.append(link(info.sourceUrl, info.sourceName));
  const location = element("p", "location-note", `${info.locationType} · ${info.locationNote} `);
  location.append(link(info.locationUrl, "Location source"));

  const pinned = pinnedCoffees.includes(coffee);
  const full = pinnedCoffees.length === 2;
  const add = element("button", "add-coffee", pinned ? "Remove from flight" : "Add to flight");
  add.type = "button";
  add.dataset.addCoffee = coffee.id;
  add.disabled = full && !pinned;
  add.addEventListener("click", () => {
    changeFlight(coffee);
    menu.querySelector(".add-coffee")?.focus({ preventScroll: true });
  });
  const actions = element("div", "coffee-card-actions");
  actions.append(add);
  if (add.disabled) actions.append(element("span", "source", "Remove a coffee to add another."));

  article.append(
    back, title, element("p", "country", info.country), element("p", "coffee-name", info.coffee),
    noteList(info.notes), metadata([info.process, info.species, info.variety, info.elevation, info.acidity, info.body]),
    source, location, actions,
  );
  return article;
}

function changeFlight(coffee) {
  if (pinnedCoffees.includes(coffee)) {
    pinnedCoffees = pinnedCoffees.filter((item) => item !== coffee);
  } else if (pinnedCoffees.length < 2) {
    pinnedCoffees = [...pinnedCoffees, coffee];
  }
  const scroll = menu.scrollTop;
  refreshMenu();
  menu.scrollTop = scroll;
  refreshFlight();
}

function refreshFlight() {
  flight.replaceChildren();
  flightStatus.textContent = `${pinnedCoffees.length} of 2 coffees in the tasting flight.`;
  if (!pinnedCoffees.length) return;

  const comparison = pinnedCoffees.length === 2 ? compareCoffees(...pinnedCoffees) : null;
  if (comparison) {
    const shared = [
      comparison.notes.length && `Shared notes · ${comparison.notes.join(", ")}`,
      comparison.families.length && `Shared families · ${comparison.families.map(({ label }) => label).join(", ")}`,
    ].filter(Boolean).join("  /  ");
    flight.append(element("p", "flight-summary", shared || "These two coffees have distinct flavor notes."));
  }

  const cups = element("div", "flight-cups");
  for (const coffee of pinnedCoffees) {
    const info = coffee.properties;
    const remove = element("button", "remove-coffee", "Remove");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${info.region} from tasting flight`);
    remove.addEventListener("click", () => {
      changeFlight(coffee);
      (flight.querySelector("button") ?? starterFlight).focus();
    });
    const header = element("header");
    header.append(element("h3", "", info.region), remove);
    const cup = element("article", "flight-cup");
    cup.append(header, metadata([info.country, info.process, info.species]), noteList(info.notes, comparison?.notes));
    cups.append(cup);
  }
  if (pinnedCoffees.length === 1) {
    cups.append(element("p", "flight-cup empty", "Pick a second coffee from the tasting menu."));
  }
  flight.append(cups);
}

function element(tag, className = "", text = "") {
  const item = document.createElement(tag);
  item.className = className;
  item.textContent = text;
  return item;
}

function link(href, text) {
  const anchor = element("a", "", text);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  return anchor;
}

function noteList(notes, shared = []) {
  const list = element("ul", "note-list");
  const sharedNotes = shared.map((note) => note.toLowerCase());
  for (const note of notes) {
    list.append(element("li", sharedNotes.includes(note.toLowerCase()) ? "shared-note" : "", note));
  }
  return list;
}

function metadata(values) {
  const line = element("p", "coffee-meta");
  for (const value of values.filter(Boolean)) line.append(element("span", "", value));
  return line;
}

function showMapError(message) {
  mapStage.dataset.state = "error";
  mapStatus.hidden = false;
  mapStatus.textContent = message;
}
