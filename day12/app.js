const select = (selector) => document.querySelector(selector);
const fuelColors = ["#688b37", "#47555c", "#bc482d", "#236798", "#a0458c", "#805532", "#7663a5", "#c88b13", "#168174"];
const special = [
  ["shared", "Shared lead", "#26223f"],
  ["zero", "Zero reported generation", "#929a98"],
  ["unavailable", "Unavailable", "#d2d8d4"]
];
const endpoints = [2000, 2024];
const defaultSource = "8";
const otherLeader = "#9eaaa7";
const changeLabels = [
  ["gained", "Took the lead", "#21784e"],
  ["lost", "Lost the lead", "#bb482e"],
  ["kept", "Led in both years", "#355d99"],
  ["shared", "Shared lead in either year", special[0][2]],
  ["unavailable", "Data missing in either year", special[2][2]]
];
const yearControls = ["a", "b"].map((id) => {
  const base = `#year-${id}`;
  return {
    slider: select(base),
    label: select(`${base}-value`),
    previous: select(`${base}-previous`),
    next: select(`${base}-next`),
    coverage: select(`${base}-coverage`),
    note: select(`${base}-note`)
  };
});
const picker = select("#country-select");
const sourcePicker = select("#source-select");
const changeControl = select("#highlight-changes");
const placesDialog = select("#source-places");
const tablePanel = select("#country-table-panel");
const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
const wholeNumber = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });
const signedPercent = new Intl.NumberFormat("en", { maximumFractionDigits: 1, signDisplay: "exceptZero" });
const stack = window.matchMedia("(max-width: 760px)");
const svgNS = "http://www.w3.org/2000/svg";
const years = [...endpoints];
const mapElements = [select("#map-a"), select("#map-b")];
let dataset;
let selected = "";
let source = defaultSource;
let unknownName = "";
let maps;
let selectionRevision = 0;

function element(tag, value, className) {
  const node = document.createElement(tag);
  if (value !== undefined) node.textContent = value;
  if (className) node.className = className;
  return node;
}

function svg(tag, attributes, value) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, attribute] of Object.entries(attributes)) node.setAttribute(key, attribute);
  if (value !== undefined) node.textContent = value;
  return node;
}

function legendItem(label, color) {
  const item = element("span", undefined, "legend-item");
  const swatch = element("i");
  swatch.style.setProperty("--swatch", color);
  swatch.setAttribute("aria-hidden", "true");
  item.append(swatch, label);
  return item;
}

function message(id, value) {
  const node = select(id);
  node.textContent = value;
  node.hidden = !value;
}

function labels() {
  return dataset.fuels.map((fuel, index) => [String(index), fuel, fuelColors[index]]).concat(special);
}

function mapLabels() {
  if (changeControl.checked) return changeLabels;
  if (source === "all") return labels();
  return [[source, dataset.fuels[Number(source)], fuelColors[Number(source)]], ...special];
}

function refreshYear(index) {
  const year = years[index];
  const { slider, label, previous, next, coverage, note } = yearControls[index];
  slider.value = year;
  label.value = year;
  previous.disabled = year === Number(slider.min);
  next.disabled = year === Number(slider.max);
  note.hidden = year !== 2025;
  const observed = dataset?.coverage[year].observed;
  coverage.textContent = observed === undefined ? "" : `${observed} areas with data`;
  if (observed !== undefined) coverage.setAttribute("aria-label", `${observed} countries and economies with data`);
  const subject = source === "all" ? "Leading electricity sources" : `Where ${dataset?.fuels[Number(source)] ?? "wind"} leads`;
  const description = changeControl.checked ? `${subject}, changes from ${Math.min(...years)} to ${Math.max(...years)}` : `${subject} in ${year}`;
  mapElements[index].setAttribute("aria-label", `${description}, map ${index === 0 ? "A" : "B"}`);
  if (maps) setRenderer(maps[index].layer, year);
}

function changeYear(index, value) {
  const { min, max } = yearControls[index].slider;
  years[index] = Math.max(Number(min), Math.min(Number(max), value));
  renderCountry();
  renderSourceView();
  renderComparisonStats();
}

for (const [index, { slider, previous, next }] of yearControls.entries()) {
  slider.addEventListener("input", () => changeYear(index, slider.valueAsNumber));
  previous.addEventListener("click", () => changeYear(index, years[index] - 1));
  next.addEventListener("click", () => changeYear(index, years[index] + 1));
  refreshYear(index);
}

function useCalciteButton(id, appearance, icon, action) {
  const native = document.getElementById(id);
  native.addEventListener("click", action);
  customElements.whenDefined("calcite-button").then(() => {
    const button = element("calcite-button", native.textContent);
    button.id = id;
    button.setAttribute("appearance", appearance);
    button.setAttribute("icon-start", icon);
    button.disabled = native.disabled;
    button.addEventListener("click", action);
    const focused = document.activeElement === native;
    native.replaceWith(button);
    if (focused) button.setFocus();
  });
}

useCalciteButton("reset", "outline", "reset", () => {
  source = defaultSource;
  sourcePicker.value = source;
  changeControl.checked = false;
  years.splice(0, years.length, ...endpoints);
  renderCountry();
  renderSourceView();
  renderComparisonStats();
  if (maps) resetMaps().catch(reportMapError);
});

function observation(area, year) {
  return area.series[year - dataset.firstYear];
}

function renderComparisonStats() {
  if (!dataset) return;

  const [start, end] = [...years].sort((a, b) => a - b);
  const matched = Object.values(dataset.areas)
    .map((area) => [observation(area, start), observation(area, end)])
    .filter((pair) => pair.every((record) => record[2] !== "unavailable"));
  const singleLeaders = matched.filter((pair) => pair.every((record) => record[3].length === 1));
  const changes = singleLeaders.filter(([before, after]) => before[3][0] !== after[3][0]).length;
  const wind = dataset.fuels.indexOf("Wind");
  const solar = dataset.fuels.indexOf("Solar");
  const totals = [0, 1].map((index) => matched.reduce((sum, pair) => sum + pair[index][0], 0));
  const windSolarShares = totals.map((total, index) => {
    const reported = matched.reduce((sum, pair) => {
      const sources = pair[index][1];
      return sum + (sources[wind] ?? 0) + (sources[solar] ?? 0);
    }, 0);
    return total > 0 ? 100 * reported / total : null;
  });
  const sameYear = start === end;
  const yearLabel = sameYear ? String(start) : `${start} to ${end}`;
  const formatPair = (values, format) => sameYear ? format(values[0]) : values.map(format).join(" → ");
  const formatShare = (value) => value === null ? "Unavailable" : `${formatAmount(value, percent, .1)}%`;
  const totalChange = totals[0] > 0 ? 100 * (totals[1] - totals[0]) / totals[0] : null;
  const coverage = matched.length
    ? `${yearLabel} · ${matched.length} countries and economies with comparable data${sameYear ? "." : " in both years."}`
    : `${yearLabel} · No countries or economies have comparable data for this selection.`;

  message("#stats-coverage", coverage);
  message("#stats-total", matched.length ? `${formatPair(totals, (value) => wholeNumber.format(value))} TWh` : "Unavailable");
  message("#stats-total-note", sameYear || totalChange === null ? "" : `${signedPercent.format(totalChange)}% in total generation`);
  message("#stats-leaders", singleLeaders.length ? `${changes} of ${singleLeaders.length}` : "Unavailable");
  message("#stats-leaders-note", sameYear ? "Both maps show the same year." : "Among places with one leader in both years.");
  message("#stats-wind-solar", formatPair(windSolarShares, formatShare));
  message("#stats-wind-solar-note", "Combined share of reported generation.");
  renderSourceStats(matched, formatPair, formatShare);
  select("#comparison-stats").hidden = false;
  select("#stats-link").hidden = false;
}

function renderSourceStats(matched, formatPair, formatShare) {
  select("#stats-source").hidden = source === "all";
  if (source === "all") return;

  const fuel = Number(source);
  const reportedOutput = ([, values, status]) => status === "zero" ? 0 : values[fuel];
  const withSource = matched.filter((pair) => pair.every((record) => reportedOutput(record) !== null));
  const output = [0, 1].map((index) => withSource.reduce((sum, pair) => sum + reportedOutput(pair[index]), 0));
  const shares = output.map((value, index) => {
    const total = withSource.reduce((sum, pair) => sum + pair[index][0], 0);
    return total > 0 ? 100 * value / total : null;
  });
  message("#stats-source-title", `${dataset.fuels[fuel]} generation`);
  message("#stats-source-output", withSource.length
    ? `${formatPair(output, (value) => formatAmount(value, number, .01))} TWh` : "Unavailable");
  message("#stats-source-share", `${formatPair(shares, formatShare)} of electricity generated`);
  message("#stats-source-coverage", `${withSource.length} places with comparable source data.`);
}

function isRanked(status) {
  return status !== "unavailable" && status !== "zero";
}

function formatAmount(value, format, threshold) {
  return value > 0 && value < threshold ? `<${threshold}` : format.format(value);
}

function share(observation, value) {
  const [total, , status] = observation;
  return isRanked(status) && value !== null ? 100 * value / total : null;
}

function yearSummary(area, year) {
  const current = observation(area, year);
  const [, values, status, leaders] = current;
  if (status === "zero") return ["Zero reported generation", "0 TWh total"];
  if (status === "unavailable") return ["Unavailable", "Insufficient generation data"];
  const value = values[leaders[0]];
  const amount = `${formatAmount(value, number, .01)} TWh · ${formatAmount(share(current, value), percent, .1)}%`;
  const names = leaders.map((fuel) => dataset.fuels[fuel]).join(" and ");
  return status === "shared" ? [`${names} shared the lead`, `${amount} each`] : [names, amount];
}

function summarizeChanges(area) {
  const changes = [];
  for (const [index, [, , status, leaders]] of area.series.entries()) {
    const year = dataset.firstYear + index;
    const previous = area.series[index - 1]?.[3];
    if (status === "shared") {
      const fuels = leaders.map((fuel) => dataset.fuels[fuel]).join(" and ");
      changes.push({ year, shared: true, description: `Shared lead: ${fuels}` });
    } else if (previous?.length === 1 && leaders.length === 1 && previous[0] !== leaders[0]) {
      const from = dataset.fuels[previous[0]];
      const to = dataset.fuels[leaders[0]];
      changes.push({ year, shared: false, description: `${from} → ${to}` });
    }
  }
  return changes;
}

function renderCountry() {
  const area = dataset?.areas[selected];
  select("#country-detail").hidden = !selected;
  select("#country-prompt").hidden = Boolean(selected);
  select("#country-clear").disabled = !selected;
  if (!selected) return;

  select("#country-name").textContent = area?.name ?? unknownName;
  select(".country-grid").hidden = !area;
  tablePanel.hidden = !area;
  const note = !area ? "No Ember series for this map unit. Ember may use a different reporting geography."
    : area.mapped ? "" : "No mapped boundary. Generation history is available below.";
  message("#country-geography-note", note);
  if (!area) return;

  select("#country-comparison").replaceChildren(...years.map((year, index) => {
    const [label, value] = yearSummary(area, year);
    const summary = element("section", undefined, "country-summary");
    summary.append(element("p", `Year ${index === 0 ? "A" : "B"} · ${year}`), element("h4", label), element("p", value));
    const [total] = observation(area, year);
    if (total !== null && total > 0) {
      summary.append(element("p", `${formatAmount(total, number, .01)} TWh total`, "country-total"));
    }
    return summary;
  }));
  const changes = summarizeChanges(area).map(({ year, description }) => element("li", `${year} · ${description}`));
  select("#country-changes").replaceChildren(...(changes.length ? changes : [element("li", "No lead change recorded between adjacent years.")]));
  renderChart(area);
}

function renderSourceSnapshot() {
  if (!dataset) return;
  const showAll = source === "all";
  const fuel = dataset.fuels[Number(source)];
  select("#snapshot-title").textContent = showAll ? "All sources" : `Where ${fuel.toLowerCase()} leads`;
  const items = years.map((year) => {
    const item = element("p");
    const places = Object.entries(dataset.areas).filter(([, area]) => {
      const record = observation(area, year);
      return area.mapped && (showAll ? isRanked(record[2]) : record[2] === source);
    });
    if (!showAll) item.style.setProperty("--snapshot-color", fuelColors[Number(source)]);
    const count = element("button", places.length);
    count.type = "button";
    count.setAttribute("aria-haspopup", "dialog");
    count.setAttribute("aria-label", `Show ${places.length} places for ${showAll ? "all sources" : fuel} in ${year}`);
    count.addEventListener("click", () => openSourcePlaces(places, year, showAll ? "All sources" : fuel));
    item.append(element("span", year), count);
    return item;
  });
  select("#snapshot-years").replaceChildren(...items);
  message("#snapshot-note", showAll ? "Mapped countries and economies with a leading source, including ties."
    : `Mapped countries and economies with ${fuel.toLowerCase()} as their sole leading source.`);
}

function openSourcePlaces(places, year, label) {
  select("#source-places-title").textContent = `${label} in ${year}`;
  select("#source-places-empty").hidden = Boolean(places.length);
  places.sort(([, a], [, b]) => a.name.localeCompare(b.name, "en"));
  select("#source-places-list").replaceChildren(...places.map(([key, area]) => {
    const item = element("li");
    const button = element("button", area.name);
    button.type = "button";
    button.addEventListener("click", () => {
      placesDialog.close();
      setSelection(key);
      select("#country-title").focus();
      locateCountry(key).catch((error) => {
        if (error.name !== "AbortError") console.error("Country location failed", error);
      });
    });
    item.append(button);
    return item;
  }));
  placesDialog.showModal();
}

async function locateCountry(key) {
  if (!maps) return;
  const revision = selectionRevision;
  const layer = maps[0].layer;
  const id = maps[0].ids.get(key);
  if (id === undefined) return;
  const { extent } = await layer.queryExtent({ objectIds: [id] });
  if (!extent || revision !== selectionRevision) return;
  const target = extent.width > 180 ? { target: extent.center, zoom: 3 } : extent.expand(1.35);
  await Promise.all(maps.map(({ component }) => component.goTo(target, { animate: false })));
}

function renderSourceView() {
  if (!dataset) return;
  const changing = changeControl.checked;
  const all = source === "all";
  const fuel = dataset.fuels[Number(source)]?.toLowerCase();
  const entries = mapLabels();
  const legend = entries.map(([, label, color]) => legendItem(label, color));
  if (changing) legend.push(legendItem("No lead in either year", otherLeader));
  else if (!all) legend.splice(1, 0, legendItem("Another source leads", otherLeader));
  select("#map-legend").replaceChildren(...legend);
  let caption = "Each color shows the leading source.";
  if (changing) caption = `Both maps show where ${fuel} gained, lost, or kept the lead from ${Math.min(...years)} to ${Math.max(...years)}.`;
  else if (!all) caption = `The maps highlight places where ${fuel} generated more electricity than any other source.`;
  message("#map-caption", caption);
  changeControl.disabled = all;
  yearControls.forEach((_, index) => refreshYear(index));
  renderSourceSnapshot();
  updateHighlights();
}

function renderChart(area) {
  const chart = select("#country-chart");
  const left = 49;
  const right = 628;
  const top = 29;
  const bottom = 200;
  const lastIndex = dataset.lastYear - dataset.firstYear;
  const x = (index) => left + index / lastIndex * (right - left);
  const y = (amount) => bottom - amount / 100 * (bottom - top);
  chart.replaceChildren();
  for (const tick of [0, 25, 50, 75, 100]) {
    const at = y(tick);
    chart.append(svg("line", { x1: left, x2: right, y1: at, y2: at, stroke: "#ccd3d0" }),
      svg("text", { x: left - 7, y: at + 4, "text-anchor": "end" }, `${tick}%`));
  }
  for (const year of [2000, 2005, 2010, 2015, 2020, 2025]) {
    chart.append(svg("text", { x: x(year - dataset.firstYear), y: 222, "text-anchor": "middle" }, year));
  }
  const fuelsShown = [];
  for (const [fuel, color] of fuelColors.entries()) {
    const values = area.series.map((point) => share(point, point[1][fuel]));
    if (!values.some((value) => value > 0)) continue;
    fuelsShown.push(legendItem(dataset.fuels[fuel], color));
    let path = "";
    for (const [index, value] of values.entries()) {
      if (value === null) continue;
      const followsGap = index === 0 || values[index - 1] === null;
      path += `${followsGap ? "M" : "L"}${x(index)} ${y(value)} `;
      if (followsGap && (index === lastIndex || values[index + 1] === null)) {
        chart.append(svg("circle", { cx: x(index), cy: y(value), r: 3, fill: color }));
      }
    }
    chart.append(svg("path", { d: path, fill: "none", stroke: color, "stroke-width": 2.35, "stroke-linejoin": "round" }));
  }
  for (const [index, year] of years.entries()) {
    const at = x(year - dataset.firstYear);
    const anchor = years[0] === years[1] ? (index === 0 ? "end" : "start") : "middle";
    chart.append(svg("line", { x1: at, x2: at, y1: top, y2: bottom, stroke: "#172731", "stroke-dasharray": "4 3" }),
      svg("text", { x: at, y: index === 0 ? 12 : 25, "text-anchor": anchor }, index === 0 ? "A" : "B"));
  }
  select("#chart-legend").replaceChildren(...fuelsShown);
  const summaries = years.map((year) => `${year}: ${yearSummary(area, year).join(", ")}`);
  const history = fuelsShown.length ? "Lines break where source observations are unavailable." : "No positive comparable generation observations.";
  select("#chart-summary").textContent = `${summaries.join(". ")}. ${history}`;
}

function renderTable() {
  const root = select("#country-table");
  const area = dataset?.areas[selected];
  root.replaceChildren();
  if (!area || !tablePanel.open) return;
  const table = element("table");
  table.append(element("caption", `Annual electricity generation in ${area.name}`, "visually-hidden"));
  const header = table.createTHead().insertRow();
  for (const label of ["Year", "Source", "TWh", "Share", "Status"]) {
    const cell = element("th", label);
    cell.scope = "col";
    header.append(cell);
  }
  const body = table.createTBody();
  for (const [index, point] of area.series.entries()) {
    const [, , status, leaders] = point;
    for (const [fuel, value] of point[1].entries()) {
      const amount = share(point, value);
      const sourceStatus = sourceStatusLabel(status, leaders, fuel, value);
      const row = body.insertRow();
      for (const cell of [dataset.firstYear + index, dataset.fuels[fuel], value === null ? "Unavailable" : formatAmount(value, number, .01),
        amount === null ? "Unavailable" : `${formatAmount(amount, percent, .1)}%`, sourceStatus]) {
        row.insertCell().textContent = cell;
      }
    }
  }
  root.append(table);
}

function sourceStatusLabel(status, leaders, fuel, value) {
  if (status === "zero") return "Zero reported generation";
  if (status === "unavailable") return "Year unavailable";
  if (leaders.includes(fuel)) return status === "shared" ? "Shared lead" : "Leading source";
  return value === null ? "Source unavailable" : "";
}

function setSelection(key, fallbackName = "") {
  selected = key;
  unknownName = fallbackName;
  selectionRevision += 1;
  picker.value = dataset.areas[key] ? key : "";
  renderCountry();
  renderTable();
  select("#selection-status").textContent = key ? `Selected ${dataset.areas[key]?.name ?? fallbackName}` : "Country selection cleared";
  updateHighlights();
}

picker.addEventListener("change", () => setSelection(picker.value));
useCalciteButton("country-clear", "transparent", "x", () => {
  setSelection("");
  picker.focus();
});
sourcePicker.addEventListener("change", () => {
  source = sourcePicker.value;
  if (source === "all") changeControl.checked = false;
  renderSourceView();
  renderComparisonStats();
});
changeControl.addEventListener("change", renderSourceView);
tablePanel.addEventListener("toggle", renderTable);

function setRenderer(layer, year) {
  const [start, end] = [...years].sort((a, b) => a - b);
  const classification = changeControl.checked ? {
    valueExpression: `
      var earlier = $feature.y${start};
      var later = $feature.y${end};
      if (earlier == "unavailable" || later == "unavailable") return "unavailable";
      if (earlier == "shared" || later == "shared") return "shared";
      var ledEarlier = earlier == "${source}";
      var ledLater = later == "${source}";
      return When(ledEarlier && ledLater, "kept", ledLater, "gained", ledEarlier, "lost", "other");
    `
  } : { field: `y${year}` };
  layer.renderer = {
    type: "unique-value",
    ...classification,
    defaultSymbol: fill(source === "all" ? special[2][2] : otherLeader),
    uniqueValueInfos: mapLabels().map(([value, label, color]) => ({ value, label, symbol: fill(color) }))
  };
}

function fill(color) {
  return { type: "simple-fill", color, outline: { color: "#fcfaf1", width: .6 } };
}

function updateHighlights() {
  for (const map of maps ?? []) {
    map.highlight?.remove();
    const id = map.ids.get(selected);
    map.highlight = id === undefined ? undefined : map.layerView.highlight(id);
  }
}

function loadSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://js.arcgis.com/5.2/";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });
}

function worldExtent() {
  return { xmin: -179.9, ymin: -70, xmax: 179.9, ymax: 84, spatialReference: { wkid: 4326 } };
}

async function resetMaps() {
  await Promise.all(maps.map(({ component }) => component.goTo(worldExtent(), { animate: false })));
}

async function initMaps() {
  await loadSDK();
  await customElements.whenDefined("arcgis-map");
  const [ArcGISMap, GeoJSONLayer, reactiveUtils] = await globalThis.$arcgis.import([
    "@arcgis/core/Map.js", "@arcgis/core/layers/GeoJSONLayer.js", "@arcgis/core/core/reactiveUtils.js"
  ]);
  const url = new URL("data/countries.geojson", document.baseURI).href;
  const fields = [{ name: "key", type: "string" }, { name: "name", type: "string" }];
  for (let year = dataset.firstYear; year <= dataset.lastYear; year += 1) {
    fields.push({ name: `y${year}`, type: "string" });
  }
  const ready = await Promise.all(mapElements.map(async (component, index) => {
    const layer = new GeoJSONLayer({ url, fields, outFields: ["key", "name"], title: "Leading electricity source" });
    setRenderer(layer, years[index]);
    component.spatialReference = { wkid: 4326 };
    component.constraints = { rotationEnabled: false, snapToZoom: false };
    component.navigation = { browserTouchPanEnabled: !stack.matches, actionMap: { mouseWheel: "none" } };
    component.map = new ArcGISMap({ layers: [layer], background: { color: "#dfecea" } });
    await component.viewOnReady();
    const layerView = await component.whenLayerView(layer);
    const query = layer.createQuery();
    query.outFields = ["key", "name", layer.objectIdField];
    query.returnGeometry = false;
    const features = (await layer.queryFeatures(query)).features;
    const ids = new Map(features.map((feature) => [feature.attributes.key, feature.getObjectId()]));
    const attributesById = new Map(features.map((feature) => [feature.getObjectId(), feature.attributes]));
    component.addEventListener("arcgisViewClick", async ({ detail }) => {
      const revision = ++selectionRevision;
      try {
        const result = await component.hitTest(detail, { include: layer });
        const hit = result.results.find((item) => item.type === "graphic");
        const attributes = hit && attributesById.get(hit.graphic.getObjectId());
        if (attributes && revision === selectionRevision) setSelection(attributes.key, attributes.name);
      } catch (error) {
        console.error("Country selection failed", error);
      }
    });
    return { component, layer, layerView, ids };
  }));
  await Promise.all(ready.map(({ component }) => component.goTo(worldExtent(), { animate: false })));
  maps = ready;
  for (const [index, { component }] of maps.entries()) {
    const other = maps[1 - index].component;
    reactiveUtils.watch(() => [component.interacting, component.animation, component.viewpoint], ([interacting, animation, viewpoint]) => {
      if (!stack.matches && (interacting || animation) && !other.interacting && viewpoint) {
        other.viewpoint = viewpoint.clone();
      }
    });
    refreshYear(index);
  }
  stack.addEventListener("change", () => {
    for (const { component } of maps) {
      component.navigation.browserTouchPanEnabled = !stack.matches;
    }
  });
  updateHighlights();
  message("#map-message", "");
}

function reportMapError(error) {
  console.error("Day 12 map", error);
  message("#map-message", "The maps are unavailable. You can still explore the data with the country picker.");
}

async function init() {
  const response = await fetch("data/generation.json");
  if (!response.ok) throw new Error(`Generation data returned ${response.status}`);
  dataset = await response.json();
  const areas = Object.entries(dataset.areas).sort((a, b) => a[1].name.localeCompare(b[1].name, "en"));
  for (const [code, area] of areas) {
    const option = element("option", area.name);
    option.value = code;
    picker.append(option);
  }
  picker.disabled = false;
  const sourceOptions = dataset.fuels.map((fuel, index) => {
    const option = element("option", fuel);
    option.value = String(index);
    return option;
  });
  const allSources = element("option", "All sources");
  allSources.value = "all";
  sourcePicker.replaceChildren(...sourceOptions, allSources);
  sourcePicker.value = source;
  sourcePicker.disabled = false;
  renderSourceView();
  renderComparisonStats();
  message("#map-message", "Loading maps…");
  const timeout = setTimeout(() => {
    if (!maps) message("#map-message", "The maps are taking longer than expected. The country picker is ready to use.");
  }, 12000);
  initMaps().catch(reportMapError).finally(() => clearTimeout(timeout));
}

init().catch((error) => {
  console.error("Day 12 data", error);
  message("#data-message", "The local generation data could not be loaded. Reload this page or use the Ember source linked below.");
});
