# Day 7 plan: Seven Days of Shaking

Status: implemented November 7, 2026. See readme.md for actual timing and verification. The original planning decisions below are preserved as the pre-build record.

Build a public, anonymous 2D map of USGS-reported M2.5+ earthquakes from the past seven days. The question is simple: **Where has the Earth been shaking this week?**

## The finished map

- A world map centered on the Pacific, showing the pattern around its margins.
- Muted gray geography with orange circles sized by magnitude. Symbol size is a visual guide to magnitude, not a measure of energy or affected area.
- A short title and subtitle: “Seven Days of Shaking / USGS-reported M2.5+ earthquakes · past 7 days.”
- Click an earthquake for its magnitude, reported location, event time with an explicit time zone, and a link to its USGS event page.
- Built-in zoom, home, popup, and legend components, plus a link back to the collection. A compact Calcite header keeps the map dominant on phones and desktops.
- Visible USGS and basemap attribution. Data loads when the page opens; describe that behavior accurately rather than promising continuous updates.

One layer, one size variable, one popup. Extra filters, animation, custom artwork, 3D, and additional datasets are deferred.

## Data and access

Use the [USGS GeoJSON summary feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), specifically [M2.5+ events from the past seven days](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson). USGS documents the `mag`, `place`, `time`, `url`, and `type` properties. Only display earthquake events. State that this is the USGS-reported feed, not a complete global inventory at a uniform detection threshold.

Adapt Esri's [official GeoJSONLayer earthquake sample](https://developers.arcgis.com/javascript/latest/sample-code/layers-geojson/), which already demonstrates the layer, magnitude sizing, and event popups. Begin with its `gray-vector` basemap. A dark gray variant is optional only if it loads anonymously without additional setup.

The audience and no-sign-in behavior are confirmed. The proposed resources are public and read-only. Omit ArcGIS authentication only after confirming the selected basemap and its dependencies load anonymously; the [ArcGIS setup guide](https://developers.arcgis.com/javascript/latest/get-started/) allows this for public resources. The developer's ArcGIS account/product entitlement is still unconfirmed and should be checked before implementation. Do not add a key-dependent location service to this ten-minute scope.

## Scaffold and project layout

Recommendation: Vite + TypeScript with ArcGIS Maps SDK for JavaScript, Map Components, and Calcite. Keep the template's compatible dependency versions. Use ESM imports and import each component actually used.

Proposed source folder: `day7/scripts/app/`, matching the source/runtime separation used by recent days. Confirm that new source folder before scaffolding. The existing `day7/` is the Day 7 publishing target.

From the repository root, the planned PowerShell commands are:

```powershell
Set-Location day7
New-Item -ItemType Directory -Path scripts -Force
Set-Location scripts
npx @arcgis/create --name app --template vite
Set-Location app
npm install
npm run dev
```

The current [official CLI instructions](https://developers.arcgis.com/javascript/latest/get-started/) document `--name`, `--template`, and the `vite` template shorthand. At build time, inspect the interactive CLI options if the installed CLI rejects that template name. This plan has not executed the scaffold or installed dependencies. Node v24.22.1 and npm 11.19.1 are available locally.

Set Vite's base to `./` for the static export. Keep source and dependencies under `day7/scripts/`; export only the built `index.html` and runtime assets into `day7/`. The repository's Pages packager excludes `scripts/` and `dist/`, so a Vite build alone does not publish the map.

## Ten-minute working window

Research and concept selection happen before the clock. Start the clock immediately before scaffolding; scaffolding, downloads, implementation, build, and local verification all count. Do not pause the clock for installations. Ten minutes is a target, not a guarantee.

| Elapsed | Work and checkpoint |
| --- | --- |
| 0:00–2:00 | Scaffold, install, start Vite; get the template map visible. |
| 2:00–4:00 | Add the USGS GeoJSONLayer and show the seven-day events. |
| 4:00–6:00 | Apply orange magnitude sizing, event popups, and the component legend. |
| 6:00–7:00 | Add the Calcite title, source/period text, collection link, and simple loading/error feedback. |
| 7:00–8:00 | Run the template build/type check; export the static runtime into Day 7. |
| 8:00–10:00 | Open the exported map through the repository preview; check data, popups, controls, phone layout, and take a screenshot. |

If setup runs long, drop decorative polish and the home control first. Preserve the map, readable symbols, event details, source, time window, and attribution. At ten minutes, stop editing and record the actual result. Any later fixes or publication work must be recorded separately.

## Completion checks and follow-up

Within the timed session, confirm anonymous loading, visible basemap and events, a legend matching magnitude sizing, a popup matching its source event, a correctly formatted time, and no blocking mobile layout issue. Check both a pointer interaction and keyboard access to the controls. Record any checks that do not fit within the time limit.

After the timed session, document elapsed time, decisions, source access date, limitations, screenshot, and verification in `day7/readme.md`. Update the Day 7 directory entry only once the map works, run the repository checks, and preview the collection. Publication is a separate follow-up. Keep the public placeholder and planned status until implementation exists.

### ArcGIS requirements handoff summary

- **Work Target:** New application; planning only in this session.
- **Project Folder:** Existing `day7/` publishing folder; proposed `day7/scripts/app/` source folder awaits confirmation before creation.
- **ArcGIS Product Context:** Proposed ArcGIS Online public basemap resources plus USGS GeoJSON; developer account/product entitlement unconfirmed.
- **Target Platform:** Web; local preview followed by the existing GitHub Pages static collection.
- **Delivery Scope:** Ten-minute prototype; one earthquake layer, magnitude sizing, popups, legend, and compact header.
- **Identity & Access Model:** Confirmed public audience, no sign-in; proposed anonymous access to verified public resources only.
- **Core Features and Operations:** Read-only 2D mapping, GeoJSON display, navigation, legend, event details; no editing or server-side analysis.

#### Remaining assumptions

1. “Seven Days of Shaking” is the recommended subject, pending the user's choice.
2. The proposed source folder and developer account context will be confirmed before scaffolding.
3. USGS cross-origin feed access and the basemap's anonymous access will be verified in the actual browser during implementation.

#### Next agent actions

- [ ] Continue with `build-with-arcgis-maps-sdk-for-javascript` for implementation, using its package-managed guidance.
- [ ] Apply `build-with-calcite-design-system` to the minimal header and responsive layout.
- [ ] Continue with `follow-arcgis-authentication-patterns` to verify the proposed public resources and resolve the developer product/account context before coding.

Planning used the installed `gather-arcgis-application-requirements`, `follow-arcgis-authentication-patterns`, `build-with-arcgis-maps-sdk-for-javascript`, and `build-with-calcite-design-system` skills, with the Esri Developer Documentation MCP and official documentation. ArcGIS REST JS is unnecessary for this scope.
