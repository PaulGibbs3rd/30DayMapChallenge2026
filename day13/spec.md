# The Desert Feeds the Forest

Day 13 · Interactions · November 13, 2026 · Draft

The [working preview](readme.md) uses daily satellite imagery and ERA5 winds. The data plan below describes the original dust-specific MERRA-2 design.

## Purpose and scope

Replay a documented Saharan dust crossing from April 4–11, 2014. Readers can follow the plume from the Atlantic to northeastern South America and into the Amazon, then drag a circular lens to see the winds at the selected time. The final stop connects the event to research on how African dust carries phosphorus to Amazon soils. The deliverable is a responsive public map at `day13/` in the existing GitHub Pages project. [Official challenge](https://30daymapchallenge.com/2026/) · [April 2014 event study, Section 3.5 and Figures 9 and 11–13](https://acp.copernicus.org/articles/18/10055/2018/acp-18-10055-2018.pdf) · [NASA phosphorus research summary](https://www.nasa.gov/missions/calipso/nasa-satellite-reveals-how-much-saharan-dust-feeds-amazons-plants/)

## Map and interactions

- **Opening view.** Frame West Africa, the tropical Atlantic, and northern South America in one 2D map. Use a dark ocean, muted land, an ochre dust ramp, and thin pale wind streamlines. Label the Sahara, Atlantic Ocean, Amazon Basin, and Amazon Tall Tower Observatory (ATTO). Open paused on the Atlantic stop with the lens already visible over the crossing. Put the date, timeline, and controls directly below the map.
- **Timeline.** Show the selected date and time in UTC. Offer a scrubber, previous and next frame, and play/pause. Start with 12-hour steps and stop playback at the final frame. Use one frame index for the dust and wind. Update the displayed date when the new frame is ready, and surface loading or unavailable data when it cannot be shown. Panning, zooming, and moving the lens preserve the selected time.
- **Wind lens.** Drag the circular handle to reveal winds over the dust raster. Provide tap-to-place in lens mode and arrow-key movement on the focused handle. Reserve single-finger lens dragging for the handle on touch screens so the rest of the map remains available for panning. Offer labeled **Lens**, **Full wind**, and **Dust only** modes. Keep the circle stationary on screen during ordinary panning and zooming while its contents stay aligned with the base map.
- **Motion.** Offer a motion toggle that pauses timeline playback and replaces animated streamlines with static arrows sampled from the same wind grid. Default to the static treatment for reduced-motion users. Manual frame stepping remains available. Give the scrubber, controls, and lens handle visible keyboard focus. Keep timeline and story controls accessible below the map on small screens.
- **Legend.** Label the ochre ramp **Dust optical depth (550 nm)** and use fixed numeric breaks across frames. Label the moving lines **Wind at [pressure level] hPa**. Explain that the lines show the direction of air movement for the selected frame. The dated dust rasters show the plume changing over time.

### Guided stops

| Stop | Evidence | Map behavior |
| --- | --- | --- |
| Over the Atlantic · April 4–5 | MODIS shows the plume crossing the ocean. An April 5 CALIOP profile samples dust aloft. | Open on the April 5 frame chosen during the data audit and place the lens along the crossing. |
| At the coast · April 6–7 | The study places arrival on the northeastern South American coast on April 6. | Jump to the coastal frame, center the lens offshore, and retain the crossing in view where screen width permits. |
| Into the Amazon · April 8–11 | The study reports plume arrival at ATTO on April 8 and a pronounced dust pulse around April 10. | Jump to an audited inland frame, highlight ATTO, and show a short note about the measurements and the broader phosphorus research. |

Use the event study for the replay dates and NASA's multiyear research for the phosphorus explanation. Keep the nutrient result in the story text. The mapped variable is airborne dust optical depth, a dimensionless measure of extinction through the atmospheric column. [April 2014 event study](https://acp.copernicus.org/articles/18/10055/2018/acp-18-10055-2018.pdf) · [NASA phosphorus research summary](https://www.nasa.gov/missions/calipso/nasa-satellite-reveals-how-much-saharan-dust-feeds-amazons-plants/)

## Data and preparation

| Layer | Source and treatment |
| --- | --- |
| Airborne dust | NASA MERRA-2 M2T1NXAER, `DUEXTTAU`, 550 nm dust extinction optical depth. Render a scalar raster and label it as a reanalysis estimate. [NASA dataset catalog](https://access.earthdata.nasa.gov/collections/C1276812830-GES_DISC) · [MERRA-2 file documentation](https://goldsmr4.gesdisc.eosdis.nasa.gov/data/MERRA2/M2T1NXAER.5.12.4/doc/MERRA2.README.pdf) |
| Wind | NASA MERRA-2 M2I3NPASM, eastward `U` and northward `V` in m/s. Test 700 and 850 hPa for the ocean crossing and 925 hPa for the inland leg, which the event study used to discuss near-coast-to-ATTO winds. Choose and document one level for the initial replay after checking the lidar profiles and wind fields. Use the same level across dates for comparison. [NASA pressure-level winds](https://catalog.data.gov/dataset/merra-2-inst3_3d_asm_np-3d3-hourlyinstantaneouspressure-levelassimilationassimilated-meteo) · [Event study, Figures 12–13](https://acp.copernicus.org/articles/18/10055/2018/acp-18-10055-2018.pdf) |
| Geographic context | Use a lightweight coastline/land layer and a verified ATTO point. Credit the boundary source and link the station marker to the project. [Natural Earth physical vectors](https://www.naturalearthdata.com/downloads/110m-physical-vectors/) · [ATTO project](https://www.attoproject.org/) |

1. Subset the research window and study area before exporting. Start with 75°W–15°E and 12°S–32°N, with enough padding for the raster resampling. Use 00:00 and 12:00 UTC wind samples from April 4 through April 11. MERRA-2 aerosol fields are hourly averages centered on the half-hour. For each wind time, average the two adjacent dust samples to produce a centered two-hour mean. Include April 3 at 23:30 UTC for the first timeline frame. Preserve NoData where either required dust sample is missing. [NASA wind dataset](https://catalog.data.gov/dataset/merra-2-inst3_3d_asm_np-3d3-hourlyinstantaneouspressure-levelassimilationassimilated-meteo) · [NASA aerosol dataset](https://access.earthdata.nasa.gov/collections/C1276812830-GES_DISC)
2. Audit the plume position against the study's Atlantic, coastal, and Amazon stages before selecting stop timestamps. Compare the broad extent and arrival sequence because the study's MODIS maps report total aerosol optical depth and the app uses the MERRA-2 dust component. Record meaningful discrepancies in the methods note. Check wind band order, signs, grid orientation, units, and masks during export and reprojection.
3. Keep a reproducible preparation script and a manifest with source collection versions, granule IDs, UTC timestamps and averaging windows, bounds, pressure level, units, masks, ramp breaks, credits, and asset checksums. Bundle processed frames under `day13/data/` where the source terms permit. Use a manifest entry for each frame so the app can load the current frame and prefetch adjacent frames.

## Rendering and delivery

1. **Prove one frame first.** Use the ArcGIS Maps SDK for JavaScript in 2D. Test an April 5 subset as a client-side `ImageryTileLayer` and confirm that the SDK recognizes it as `Vector-UV` with `FlowRenderer` applied. The documented client-side source option gives us a route to test. Support for this combination with the prepared wind data is an open build question. Check a constant eastward test grid and known westward samples from the event. Confirm that the visible motion follows the vector signs and that dust and wind are aligned. [FlowRenderer reference](https://developers.arcgis.com/javascript/latest/references/core/renderers/FlowRenderer/) · [ImageryTileLayer source options](https://developers.arcgis.com/javascript/latest/references/core/layers/ImageryTileLayer/#source)
2. **Prove the lens.** Test a transparent wind-only view clipped to a circle over the main map, with its viewpoint and dimensions synchronized. Route interactions to the main map and lens controls. Verify transparency and registration during pan, zoom, resize, and touch drag before wiring up the full timeline. If the circular clip has performance or alignment problems on supported devices, use a full-map wind toggle for the initial build and record the gap against the spec.
3. **Choose delivery after the tests.** Prefer a static GitHub Pages app with local processed data and a pinned SDK version. If the client-side raster fails the renderer test, evaluate an approved, anonymously readable ArcGIS imagery service with verified vector raster metadata. If that route is unavailable, static arrows from the same historical winds can support a first preview. Mark FlowRenderer as outstanding in that preview. [Esri flow and blending sample](https://developers.arcgis.com/javascript/latest/sample-code/layers-imagery-afrenderer-blending/)
4. **Handle frame changes as a pair.** Discard superseded requests during rapid scrubbing. Keep date and layers consistent as frames load. If wind is unavailable for a timestamp, show the matching dust raster with a clear wind status. If the dust frame is unavailable, mark the gap and allow navigation to the other frames. Fetch source data during preparation and keep any acquisition credentials outside the site assets.

## Acceptance criteria

1. The signed-out GitHub Pages build opens on the Atlantic stop and shows the ochre dust raster, a labeled UTC time, and wind flowing in the correct direction inside the lens.
2. Dragging or keyboard-moving the lens reveals wind under the circle and leaves the dust map visible. Wind and dust stay registered during pan, zoom, and resize. Lens, full wind, and dust-only modes are usable on desktop and touch screens.
3. Timeline steps and guided stops load the matching wind and dust frame. Fast scrubbing and failed requests never display layers from different dates as a pair. The final stop highlights ATTO and distinguishes the observed event from the multiyear phosphorus estimate.
4. A reviewer can reproduce the first exported frame from the manifest and source records, check vector direction against the numeric input, and trace the published arrival dates to the event study.
5. Keyboard-only navigation, reduced-motion defaults, map and timeline layout on a narrow screen, and the wind and dust failure states pass manual checks. Run `npm run check` and `npm run build` and verify the generated `day13/` route with a signed-out browser.

### ArcGIS requirements handoff summary

- **Work Target:** New application in the existing Day 13 placeholder
- **Project Folder:** `day13/`
- **ArcGIS Product Context:** Standalone ArcGIS Maps SDK for JavaScript, with an ArcGIS imagery service conditional on the one-frame test
- **Target Platform:** Responsive web on GitHub Pages
- **Delivery Scope:** Public challenge entry with one historical event, a wind lens, and a synchronized timeline
- **Identity & Access Model:** Anonymous browser access to the published assets and any selected imagery endpoint
- **Core Features and Operations:** 2D map, scalar dust visualization, atmospheric streamlines, frame playback, and guided stops

#### Remaining assumptions

1. Confirm the wind level, stage timestamps, source access, and display ramp against one exported frame and the event study.
2. Confirm the local vector raster path, SDK version, and clipped view performance before committing to the full timeline.

#### Next agent actions

- [ ] Route to the ArcGIS Maps SDK for JavaScript skill to verify one real frame and the lens.
- [ ] Route to the ArcGIS authentication skill if the selected imagery service introduces protected resources or a publishing dependency.
