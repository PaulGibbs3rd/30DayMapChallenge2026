import {makeAtlas} from "./atlas.js";
import {patternLegs, regions, routeById, routeFor, routes, scheduleLinks} from "./catalog.js";

const $ = (id) => document.getElementById(id);
const panel = $("explorer-body");
const select = $("terminal-select");
const announce = $("announcement");
const state = {mode: "chart", sidney: false, route: null, origin: null, pattern: null, islands: "mainland"};

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function button(label, handler, className, pressed) {
  const control = node("button", label, className);
  control.type = "button";
  if (pressed !== undefined) control.setAttribute("aria-pressed", String(pressed));
  control.addEventListener("click", handler);
  return control;
}

async function read(file) {
  const response = await fetch(new URL(`./data/${file}`, import.meta.url));
  if (!response.ok) throw new Error(`Unable to load ${file}`);
  return response.json();
}

const dateFormat = new Intl.DateTimeFormat("en-US", {month: "short", day: "numeric", timeZone: "UTC"});

function start(data, shoreline) {
  const docks = data.terminals;
  const names = (ids) => ids.map((id) => docks[id].name);
  const byOrigin = new Map();
  for (const connection of data.connections) {
    connection.route = routeFor(connection.from, connection.to);
    const list = byOrigin.get(connection.from) ?? [];
    list.push(connection);
    byOrigin.set(connection.from, list);
  }
  const atlas = makeAtlas(data, shoreline, selectDock, selectRoute);

  for (const [id, dock] of Object.entries(docks).sort(([, a], [, b]) => a.name.localeCompare(b.name))) {
    if (id !== "sidney") select.add(new Option(dock.name, id));
  }
  const [first, last] = data.dates.map((day) => new Date(day));
  $("snapshot").textContent = `${Object.keys(docks).length - 1} Washington terminals · ${dateFormat.format(first)}–${dateFormat.format(last)}, ${last.getUTCFullYear()} schedule`;

  for (const {name, color} of Object.values(regions)) {
    const item = node("li");
    const rule = node("span", "", "legend-line");
    rule.style.setProperty("--region-color", color);
    item.append(rule, name);
    $("legend").append(item);
  }

  function connections() {
    const available = state.origin ? byOrigin.get(state.origin) ?? [] : data.connections;
    if (!state.route) return state.origin ? available : [];
    return available.filter(({route, from, to}) => {
      if (route.id !== state.route) return false;
      if (route.id !== "islands") return true;
      const fromMainland = from === "1" || to === "1";
      return fromMainland === (state.islands === "mainland");
    });
  }

  function updateMap() {
    const selection = state.pattern ? [state.pattern] : connections().flatMap(({from, to, via}) => via.map((stops) => [from, ...stops, to]));
    const hasSelection = Boolean(state.origin || state.route);
    atlas.update({mode: state.mode, sidney: state.sidney, origin: state.origin,
      legs: hasSelection ? new Set(selection.flatMap(patternLegs)) : null,
      docks: hasSelection ? new Set(selection.flat()) : null});
  }

  function panelHeading(title, note) {
    const heading = node("h3", title, "panel-heading");
    heading.tabIndex = -1;
    panel.append(heading);
    if (note) panel.append(node("p", note, "panel-meta"));
    return heading;
  }

  function linksFor(routeOptions) {
    const links = node("ul", "", "route-links");
    routeOptions.flatMap((route) => routeOptions.length > 1
      ? scheduleLinks(route).map((item) => ({...item, label: item.label === "Route schedule" ? route.name : item.label}))
      : scheduleLinks(route)).forEach(({label, href}) => {
      const item = node("li");
      const link = node("a", label);
      link.href = href;
      item.append(link);
      links.append(item);
    });
    panel.append(links);
  }

  function routeList() {
    panelHeading("Browse routes");
    const list = node("ul", "", "route-list");
    for (const route of routes) {
      const item = node("li");
      const entry = button("", () => selectRoute(route.id, true), "route-row");
      const label = node("span");
      const dot = node("i", "", "route-dot");
      dot.setAttribute("aria-hidden", "true");
      dot.style.setProperty("--region-color", regions[route.region].color);
      label.append(dot, route.name);
      entry.append(label);
      item.append(entry);
      list.append(item);
    }
    panel.append(list);
  }

  function destinations(list) {
    const results = node("ul", "", "destination-list");
    for (const connection of [...list].sort((a, b) => docks[a.to].name.localeCompare(docks[b.to].name))) {
      const item = node("li");
      item.append(node("h4", docks[connection.to].name, "destination-name"));
      for (const via of connection.via) {
        const sequence = [connection.from, ...via, connection.to];
        const direct = connection.route.id === "islands" && !["1-10", "10-1"].includes(`${connection.from}-${connection.to}`)
          ? "No intermediate stop listed" : "Direct sailing";
        const label = via.length ? `Via ${names(via).join(", then ")}` : direct;
        const control = button(label, () => {
          state.pattern = control.getAttribute("aria-pressed") === "true" ? null : sequence;
          for (const item of results.querySelectorAll("button")) item.setAttribute("aria-pressed", String(item === control && Boolean(state.pattern)));
          announce.textContent = state.pattern ? names(sequence).join(" to ") : `All destinations from ${docks[state.origin].name}`;
          updateMap();
        }, "pattern", false);
        control.setAttribute("aria-label", `${docks[connection.to].name}. ${label}`);
        item.append(control);
      }
      results.append(item);
    }
    panel.append(results);
  }

  function showRoute() {
    const route = routeById.get(state.route);
    const heading = panelHeading(route.name, route.id === "islands" ? "Choose a dock to see its ordered stops." : "Choose a dock to see sailing patterns.");
    if (route.id === "islands") {
      const keys = node("div", "", "direction");
      for (const [mode, label] of [["mainland", "Anacortes sailings"], ["interisland", "Interisland sailings"]]) {
        const control = button(label, () => {
          state.islands = mode;
          state.origin = null;
          state.pattern = null;
          render(`[data-islands="${mode}"]`);
        }, "", state.islands === mode);
        control.dataset.islands = mode;
        keys.append(control);
      }
      panel.append(keys);
    }
    const from = node("div", "", "direction");
    from.setAttribute("role", "group");
    from.setAttribute("aria-label", "Departure direction");
    const ids = state.islands === "interisland" && route.id === "islands" ? route.docks.filter((id) => id !== "1") : route.docks;
    for (const id of ids) {
      const control = button(docks[id].name, () => selectDock(id, true, true), "", state.origin === id);
      control.dataset.from = id;
      from.append(control);
    }
    panel.append(from);
    if (state.origin) destinations(connections());
    linksFor([route]);
    panel.append(button("Browse all routes", () => clearSelection(true), "text-button"));
    return heading;
  }

  function render(focus) {
    $("chart-button").setAttribute("aria-pressed", String(state.mode === "chart"));
    $("diagram-button").setAttribute("aria-pressed", String(state.mode === "diagram"));
    select.value = state.origin ?? "";
    panel.replaceChildren();
    if (state.route) showRoute();
    else if (state.origin) {
      const list = connections();
      panelHeading(docks[state.origin].name, `${list.length} ${list.length === 1 ? "destination" : "destinations"} on one sailing`);
      destinations(list);
      linksFor([...new Set(list.map(({route}) => route))]);
    } else routeList();
    panel.setAttribute("aria-busy", "false");
    panel.scrollTop = 0;
    updateMap();
    if (focus) panel.querySelector(focus)?.focus({preventScroll: true});
  }

  function selectDock(id, keepRoute = false, focus = false) {
    state.origin = id;
    state.pattern = null;
    if (!keepRoute) state.route = null;
    const count = connections().length;
    announce.textContent = `${docks[id].name}. ${count} ${count === 1 ? "destination" : "destinations"} on one sailing.`;
    render(focus ? `[data-from="${id}"]` : null);
  }

  function selectRoute(id, focus = false) {
    state.route = id;
    state.islands = "mainland";
    state.origin = null;
    state.pattern = null;
    announce.textContent = `${routeById.get(id).name} selected.`;
    render(focus ? ".panel-heading" : null);
  }

  function clearSelection(focus = false) {
    state.route = null;
    state.origin = null;
    state.pattern = null;
    announce.textContent = "Showing the full ferry network.";
    render(focus ? ".panel-heading" : null);
  }

  for (const mode of ["chart", "diagram"]) $(`${mode}-button`).addEventListener("click", () => {
    state.mode = mode;
    $("chart-button").setAttribute("aria-pressed", String(mode === "chart"));
    $("diagram-button").setAttribute("aria-pressed", String(mode === "diagram"));
    updateMap();
  });
  $("sidney-toggle").addEventListener("change", (event) => { state.sidney = event.target.checked; updateMap(); });
  $("reset-button").addEventListener("click", () => { clearSelection(); atlas.fit(); });
  $("islands-button").addEventListener("click", () => { selectRoute("islands", true); atlas.focusIslands(); });
  $("download").addEventListener("click", atlas.download);
  select.addEventListener("change", () => { if (select.value) selectDock(select.value); else clearSelection(); });
  render();
}

Promise.all([read("network.json"), read("shoreline.geojson")]).then(([data, shoreline]) => start(data, shoreline)).catch((error) => {
  console.error(error);
  panel.setAttribute("aria-busy", "false");
  panel.replaceChildren(node("p", "The ferry data could not load. Reload the page or open the official WSDOT schedules.", "panel-message"));
});
