const ranges = [
  { name: "Longitude", min: -180, max: 180 },
  { name: "Latitude", min: -90, max: 90 }
];

function parseCoordinate(raw) {
  const value = raw.trim().replace(/^−/, "-");
  if (!value) return null;
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) ? Number(value) : NaN;
}

export function createCoordinateLab(map, changeDefaults, saveGuestLocation) {
  const form = document.querySelector("#coordinate-form");
  const source = document.querySelector("#coordinate-source");
  const fields = [document.querySelector("#plot-longitude"), document.querySelector("#plot-latitude")];
  const defaults = document.querySelector("#plot-default");
  const status = document.querySelector("#plot-status");
  const exportRow = document.querySelector("#plot-export");
  const pair = document.querySelector("#plot-pair");
  const readout = document.querySelector("#map-readout");
  const clear = document.querySelector("#clear-plots");
  const guestActions = document.querySelector("#plot-guest-actions");
  let activeGuest;
  let submitted = false;

  function showResult(message, coordinates, center = false) {
    status.value = message;
    exportRow.hidden = !coordinates;
    readout.hidden = !coordinates;
    if (coordinates) {
      pair.textContent = `[${coordinates.join(", ")}]`;
      readout.value = `${coordinates[0]}° lon, ${coordinates[1]}° lat`;
    }
    map.setSelection(coordinates, center);
  }

  function plot(center, addGraphic = false) {
    submitted = true;
    const original = fields.map(field => parseCoordinate(field.value));
    const errors = [];
    original.forEach((value, index) => {
      const { name, min, max } = ranges[index];
      let error;
      if (value === null && !defaults.checked) error = `${name} is missing.`;
      if (value !== null && !Number.isFinite(value)) error = `Enter ${name.toLowerCase()} as a decimal number.`;
      if (value !== null && (value < min || value > max)) error = `${name} must be between ${min} and ${max} degrees.`;
      fields[index].setAttribute("aria-invalid", String(Boolean(error)));
      if (error) errors.push(error);
    });
    if (errors.length) {
      showResult(errors.join(" "), null);
      return;
    }

    const coordinates = original.map(value => value ?? 0);
    const filled = original.filter(value => value === null).length;
    const atOrigin = coordinates.every(value => value === 0);
    const message = filled === 0 ? "Valid WGS 84 coordinates." : filled === 1
      ? "Filled one missing coordinate with zero."
      : "Filled both missing coordinates with zero.";
    const location = atOrigin ? " This point is at Null Island." : "";
    let confirmation = "";
    if (addGraphic) {
      const number = map.addPlot(coordinates, activeGuest?.id);
      if (activeGuest) {
        saveGuestLocation(activeGuest, coordinates);
        confirmation = ` Saved ${activeGuest.name}’s plotted location in the register.`;
      } else {
        confirmation = ` Point ${number} added to the map.`;
      }
      clear.disabled = false;
    }
    showResult(message + location + confirmation, coordinates, center);
  }

  function loadCoordinates(coordinates, label, center = true) {
    fields.forEach((field, index) => { field.value = coordinates[index] ?? ""; });
    source.textContent = activeGuest?.name ?? label;
    plot(center);
  }

  function setGuest(guest) {
    activeGuest = guest;
    guestActions.hidden = !guest;
  }

  map.onPick(coordinates => {
    if (!coordinates.every(Number.isFinite)) return;
    loadCoordinates(coordinates.map(value => Number(value.toFixed(6))), "Map selection", false);
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    plot(true, true);
  });
  for (const field of fields) {
    field.addEventListener("input", () => {
      source.textContent = activeGuest?.name ?? "Plot a point";
      fields.forEach(input => input.removeAttribute("aria-invalid"));
      submitted = false;
      const instruction = activeGuest ? "Select Plot point to save this guest’s location." : "Select Plot point to add these coordinates to the map.";
      showResult(instruction, null);
    });
  }
  document.querySelector("#deselect-guest").addEventListener("click", () => {
    setGuest(undefined);
    source.textContent = "Plot a point";
    plot(false);
    fields[0].focus();
  });
  defaults.addEventListener("change", () => changeDefaults(defaults.checked));
  document.querySelector("#plot-swap").addEventListener("click", () => {
    [fields[0].value, fields[1].value] = [fields[1].value, fields[0].value];
    plot(true);
  });
  clear.addEventListener("click", () => {
    map.clearPlots();
    submitted = false;
    showResult("Cleared the map pins.", null);
    document.querySelector("#map-home").focus();
    clear.disabled = true;
  });
  document.querySelector("#plot-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pair.textContent);
      status.value = "Copied the GeoJSON coordinate pair.";
    } catch {
      status.value = "Select the coordinate pair to copy it.";
    }
  });

  return {
    loadCoordinates(coordinates, label) {
      setGuest(undefined);
      loadCoordinates(coordinates, label);
    },
    selectGuest(guest, coordinates) {
      setGuest(guest);
      loadCoordinates(coordinates, guest.name);
    },
    resetGuestPlots() {
      clear.disabled = map.clearGuestPlots() === 0;
      if (activeGuest) loadCoordinates(activeGuest.coordinates, activeGuest.name);
    },
    setDefaults(value) {
      if (defaults.checked !== value) defaults.checked = value;
      if (submitted) plot(true);
    }
  };
}
