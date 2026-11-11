# Day 10 · Waterfront Flight

**November 10, 2026 · Prompting only**

Fly a simulated drone above Portland's Willamette waterfront. The main scene shows the aircraft and the city; a live inset shows what the drone sees. Both cameras render the same terrain, imagery, and buildings. Pause to explore the main scene, then resume from the same flight position.

## Fly

Choose **Take off**. Hold **W / S** to fly forward or backward, **A / D** to strafe, and **Q / E** to turn. Hold **Space** to accelerate upward and release it to descend under gravity. Combine **Space** with **WASD** to move while climbing. The drone keeps at least 3 m of terrain clearance and can move along gentle slopes at that height. Use **↑ / ↓** to tilt the camera. **Esc** pauses and releases keyboard control. **Reset to launch** returns the aircraft to its starting position and pauses the flight. **End flight** removes the inset and the aircraft.

Try flying north from Tom McCall Waterfront Park, then turn left toward the downtown buildings and climb for a wider view. The inset reports heading, height above terrain, and horizontal speed. This is assisted virtual flight for a desktop keyboard. There is terrain clearance, but buildings and bridges are visual references rather than collision surfaces. The camera horizon stays level.

The main map follows the drone during flight. The amber nose points in the direction of the FPV camera and tilts with it. Press **C** to toggle tracking, or use **Follow drone** and **Stop following** in the panel. Pause to move the map independently. The drone can reach 32 m/s horizontally, about 115 km/h.

## Reuse the component

Import `scene-fpv-drone.ts` and its adjacent `flight.ts` and `drone.css` in a Vite project with the ArcGIS Maps SDK and Calcite versions in this demo's lockfile. The module registers `<scene-fpv-drone>` automatically. Put it directly inside an existing global Earth scene that has an elevation layer:

```html
<arcgis-scene item-id="YOUR_WEBSCENE_ITEM_ID">
  <scene-fpv-drone slot="top-end"></scene-fpv-drone>
</arcgis-scene>
```

Omit `launch-position` to launch from the host view's center, or set it to decimal `longitude,latitude`. Add the `follow-drone` attribute to start with tracking enabled, as in this demo. Only one drone can bind to a scene. The component uses the host's existing scene access and emits local `drone-state-change` and `drone-telemetry` events. See the [original specification](specification.md) for the event payloads and design decisions.

## Data and credits

- [Buildings, City of Portland Bureau of Planning and Sustainability](https://www.portlandmaps.com/metadata/index.cfm?action=DisplayLayer&LayerID=52412): 3,314 footprint polygons with positive average heights near the flight area. Heights were converted from US survey feet to meters and used to extrude the footprints. The result shows building massing, with neither detailed architecture nor a live inventory. See [snapshot metadata](data/sources.json) for the query, coverage, and retrieval date.
- [Esri World Imagery](https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer) and [World Elevation](https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer) load at runtime. The observer view shows contributor attribution. No ArcGIS credentials or camera permissions are needed.
- ArcGIS Maps SDK for JavaScript 5.2.1 and Calcite 5.2.1 retain their respective licenses: [ArcGIS Core](vendor/arcgis-core-LICENSE.md), [ArcGIS Map Components](vendor/arcgis-map-components-LICENSE.md), and [Calcite](vendor/calcite-LICENSE.md).

The public Portland WebScene originally considered for the demo references layers that require sign-in. The demo therefore constructs its own `WebScene` with public services and the bundled city data. This choice is specific to the demo; the component can still be added to an existing compatible scene.

## Develop

The demo was scaffolded with `npx --yes @arcgis/create --name app --template js-maps-sdk-vite`. The TypeScript source is in `scripts/app/src`, and `index.html` and `assets/` in this day folder are its static export.

From the repository root with Node.js 24:

```powershell
npm --prefix day10/scripts/app ci
npm --prefix day10/scripts/app run dev
npm --prefix day10/scripts/app test
npm --prefix day10/scripts/app run export
npm run check
```

To refresh the footprint snapshot, run `node day10/scripts/prepare-buildings.mjs` before exporting. A normal build uses the checked-in snapshot. To preview the production path, run `npm run dev` at the repository root and open `http://127.0.0.1:4174/30DayMapChallenge2026/day10/`.

The dev server also serves `/verify.html`, which exercises takeoff, flight telemetry, pause and reset, removal and reattachment of the element, and preservation of host scene ownership in a WebGL browser. It can also measure browser frame cadence for a minute with both views rendering.

The flight tests, Chrome lifecycle check, and static site validation passed. The built page also rendered the observer scene and FPV inset from the Day 10 publishing path. The one-minute performance target remains unverified: Chrome throttled the background automation tab during profiling.

The [challenge directory](../directory/index.html) lists all 30 days. Exporting prepares the demo for the existing static site publisher.
