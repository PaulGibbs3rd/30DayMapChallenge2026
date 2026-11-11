# Day 10 specification: FPV Drone for ArcGIS Scene

**30DayMapChallenge 2026 · November 10 · Prompting only**

**Status:** Original design brief. See the [Day 10 project notes](readme.md) for the implementation, selected demo data, and build commands.

## Goal

Build a reusable `<scene-fpv-drone>` web component that a developer can add to an existing `<arcgis-scene>`. A visitor pilots a simulated drone with the keyboard, sees the aircraft move in the main 3D scene, and watches its live first-person camera in an inset. Both views show the same terrain and layers from different viewpoints. The main scene keeps its own camera so the visitor can pause flying and inspect the area normally.

For the Day 10 demo, choose one authored scene with a clear takeoff area and a short route that makes the two views useful: fly from open ground toward a visible landmark, turn to inspect it, climb, and reset to launch. The location and WebScene item are still to be chosen. Default to a desktop keyboard, one drone per scene, and assisted flight. Touch, gamepads, acrobatics, collisions with buildings or trees, recording, and streaming are outside this release. The feed is generated in the browser from the virtual scene.

## Drop-in contract

After the host imports the ArcGIS Scene component and registers the drone element from its own module, the only required markup change is one child element. The item ID below stands for the host's existing scene.

```html
<arcgis-scene item-id="WEBSCENE_ITEM_ID">
  <scene-fpv-drone slot="top-end"></scene-fpv-drone>
</arcgis-scene>
```

| Surface | Proposed contract |
| --- | --- |
| Placement | Direct child of `<arcgis-scene>`. Supports the scene's normal corner slots; `top-end` is recommended. With no slot, the integrator can place it using the scene's default slot and host CSS. |
| `launch-position` | Optional `longitude,latitude` in WGS84, decimal degrees. If omitted, use the main scene's center at the moment of takeoff. Use ground elevation for launch height. Show a clear message if the coordinates or terrain are unavailable. |
| `state` | Read-only: `loading`, `ready`, `starting`, `flying`, `paused`, or `error`. `ready` means the host can accept a takeoff request; `flying` requires a valid launch and a usable feed. |
| `drone-state-change` | Bubbling, composed DOM event with `{ state, reason }`. Emit on transitions only. Reasons distinguish user actions, focus loss, lost feed, scene replacement, and setup failure. |
| `drone-telemetry` | Bubbling, composed DOM event with `{ longitude, latitude, heightAboveGroundM, headingDeg, groundSpeedMps }`. Emit at most four times per second during flight, plus a final snapshot on pause or reset when a valid pose exists. No network telemetry. |

The element takes the host scene as its data source. The initial support target is a global Earth scene in Web Mercator or WGS84 with usable terrain around the launch point. The component can consume a compatible scene regardless of how the host loads it. Other scene types, a missing parent, or a duplicate drone in the same scene should display a concise setup message and leave the host usable.

## Pilot experience

1. The panel starts idle with **Take off**, a brief control guide, and a label that identifies the feed as simulated. Nothing moves or captures keys until the visitor starts a flight.
2. **Take off** resolves the launch point and initializes the inset. The drone starts in a hover 8 m above terrain, facing the host camera's current compass heading. Move focus to the labeled flight control surface once it is ready.
3. During flight, show the live FPV view with a small reticle, compass heading, ground speed, and height above terrain. The main scene shows a small directional 3D drone graphic. Update both from the same flight pose.
4. **Pause** or **Esc** stops movement immediately and leaves the feed at the last flight pose. Leaving the control surface, switching tabs, or losing window focus also pauses. **Resume** explicitly reclaims focus and starts from zero velocity. The main scene remains independently navigable.
5. **Reset to launch** returns to the original hover pose and heading, clears input and momentum, and leaves the drone paused. **End flight** clears the drone and feed, returns to `ready`, and restores focus to **Take off**. A new flight can use a new scene center if no launch position is configured.

| Key | Action |
| --- | --- |
| W / S | Fly forward / backward relative to current heading |
| A / D | Strafe left / right |
| Q / E | Yaw left / right |
| R / F | Climb / descend |
| ↑ / ↓ | Look up / down within the FPV camera's tilt range |
| Space | Brake and hover while held |
| Esc | Pause and return focus to the panel |

Handle only mapped keys while the flight surface has focus. Let Tab and browser shortcuts work normally. Clear held keys on pause, blur, visibility change, and teardown, even if a keyup event never arrives. Keep Pause and Resume as distinct actions so a focus change during a click on Pause cannot resume the flight. Opposing inputs cancel; diagonal movement has the same speed cap as straight flight. Use gentle acceleration and braking to give the aircraft weight; it should settle into a hover after the keys are released. Starting limits: 18 m/s horizontal speed, 6 m/s climb or descent, 90°/s yaw, and a 750 m horizontal radius from launch. At the boundary, reject outward motion and permit movement back toward launch. These values are prototype tuning targets.

Use Calcite for the compact panel, labeled controls, control guide, and persistent error notices. Keep keyboard focus visible; announce state changes and errors without announcing every telemetry update. Use text alongside color for status, and honor reduced-motion preferences by removing decorative motion. Keep the feed within the scene bounds and leave the host's attribution and other controls reachable. At narrow sizes, compact the panel and keep flight actions visible; touch piloting is not part of the prototype. Follow [Calcite accessibility guidance](https://developers.arcgis.com/calcite-design-system/foundations/accessibility/).

## Rendering and flight model

**Host binding.** Wait for the parent `<arcgis-scene>` to be defined and for `viewOnReady()` to resolve. Use its public `view` and `map` properties. Keep the host's camera, navigation, layers, and popups under host control. Put the drone graphic in the host `SceneView.graphics` collection so it does not appear in the FPV feed or become part of the shared WebScene. Verify altitude and heading of the graphic in the selected SDK. See the [Scene component reference](https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-scene/) and [slot placement guide](https://developers.arcgis.com/javascript/latest/building-your-ui/).

**Live FPV feed.** Create a second `SceneView` in a measured, nonzero inset container on takeoff. Start with a responsive 16:9 inset, about 320 × 180 CSS pixels on desktop. Give it the same `Map` or `WebScene` object and a compatible viewing mode and spatial reference. Drive only the feed camera with the drone pose. The feed is a viewing surface; its own default pan, zoom, and keyboard controls must not compete with flight controls. Preserve applicable data attribution. Both views share scene data and layer visibility, while each renderer can load different levels of detail. Host-only overlays, lighting overrides, and analyses are outside the parity requirement. Esri documents that [multiple views can share a map](https://developers.arcgis.com/javascript/latest/references/core/views/View/).

**Camera.** Mount the feed camera at the drone's position, use its yaw for heading, and start with a wide 85° diagonal field of view and a slight downward tilt. Offer look adjustment from approximately 35° below the horizon to level, subject to validation against the selected SDK. Assign `SceneView.camera` directly on render updates; avoid repeated animated `goTo()` calls. The documented [`Camera`](https://developers.arcgis.com/javascript/latest/references/core/Camera/) API supports position, heading, tilt, and field of view, with no roll property. V1 keeps a level horizon. A visible bank cue or aircraft lean is optional polish; neither is required for flight.

**Simulation and terrain.** Keep flight state in meters using a launch-relative east/north frame and a separate height in the scene's vertical reference. Convert to scene coordinates at the rendering boundary; do not treat longitude degrees or raw Web Mercator units as physical flight meters. Step the simulation at a fixed interval with capped catch-up and render from its latest pose. Preload terrain for the bounded flight area with [`Ground.createElevationSampler()`](https://developers.arcgis.com/javascript/latest/references/core/Ground/#createElevationSampler). Query locally while flying and use the same terrain sample for clearance and the altitude readout. Reject moves that would cross the 3 m terrain clearance floor, while allowing climb and retreat. Stop at the last valid pose and pause on unavailable terrain; distinguish no-data from a valid zero elevation. Validate terrain height and camera Z against the same vertical reference in the demo. This is sampled terrain protection; buildings, trees, and integrated mesh geometry can still be intersected.

**Recovery and ownership.** Pause and clear input on feed failure. Offer retry from the last valid pose when the same host scene remains usable. If the host replaces its scene, end the flight and rebind before permitting takeoff. On removal or flight end, cancel pending work, stop frame callbacks, remove listeners and watchers, and remove only the drone's own graphic. Detach the shared map from the inset view before destroying that view so the SDK does not destroy host data. Test reattachment and stale asynchronous completions. See the [SceneView lifecycle reference](https://developers.arcgis.com/javascript/latest/references/core/views/SceneView/#destroy).

## Build handoff and feasibility gate

- Use `@arcgis/create` for a Vite and TypeScript demo, then author the reusable element as a framework-independent module. Use `@arcgis/map-components`, `@arcgis/core`, and `@esri/calcite-components`. Confirm the current scaffold options when building and pin compatible SDK and Calcite versions in the demo lockfile. The repository's [Day 9 scaffold](../day9/readme.md#development) provides the local precedent for isolating a day app from the site publisher. Follow the ArcGIS Maps SDK for JavaScript and Calcite build skills. No scaffold or dependency changes are part of this specification.
- First verify two live 3D views sharing a scene, direct camera updates at low altitude, independent main-view navigation, terrain clearance, and safe destruction of the inset. Run the test on the intended demo scene in a current, SDK-supported desktop browser. If the inset is too expensive, reduce its size or quality first. If the reference device still cannot support both views, report the limitation. A single-view cockpit can be an explicitly labeled fallback, but does not satisfy the inset requirement.
- Keep identity and resource configuration with the host. For the challenge demo, prefer an ArcGIS Online WebScene whose item, terrain, basemap, and operational layers all load anonymously. This is a demo assumption to verify with a clean browser session. Record the chosen item, services, and credits. The element does not manage sign-in, store credentials, edit portal items, or change sharing. If the demo uses protected resources, resolve audience and sign-in with the ArcGIS authentication skill before building.
- Once the feasibility gate passes, implement the flight loop and input, then the Calcite panel, recovery states, and demo route. Verify the production demo under the existing Day 10 site path before publication.

## Acceptance criteria

| Check | Pass condition |
| --- | --- |
| Drop-in | Adding the imported child element to a compatible scene exposes an idle control panel. Removing it during flight and adding it again leaves the scene and its layers usable and creates only one new inset on the next takeoff. |
| Two live views | Fly past the demo landmark, yaw, and climb. The drone graphic moves in the main view while the inset shows matching first-person movement, with no drone model in front of the feed camera. Reorient the main camera while paused; the FPV pose stays fixed. |
| Predictable flight | Verify cardinal headings, diagonal speed, braking, turning, ascent, descent, and reset. Repeat the same inputs under different render rates; final positions should agree within 1 m on a flat test surface. |
| Terrain and bounds | On a route with changing elevation, the simulator rejects motion below the 3 m clearance floor or outside the launch radius. Missing terrain visibly pauses the flight and produces no position jump. Test both valid zero elevation and missing data. |
| Focus and keyboard | Fly, pause, resume, reset, and end by keyboard alone. Holding a key while switching tabs, moving focus, or leaving the browser window never causes movement on return until explicitly resumed. Arrow keys and Space keep their normal behavior outside active flight controls. |
| Failure and recovery | Denied data access, unsupported scenes, and a failed feed produce readable status without trapping input. Simulate feed loss, host scene replacement, and removal during load; none destroys or leaves stale controls on the host. |
| Performance | After initial scene loading, record a 60-second flight on the reference machine. Target at least 30 FPS median with both views visible. Record browser, hardware, item, feed size, and any quality tradeoffs alongside the result. |

### ArcGIS requirements handoff summary

- **Work Target:** New reusable web component and a Day 10 demonstration app.
- **Project Folder:** `day10/` for the specification and future demo; isolate app source following the repository's day-level pattern.
- **ArcGIS Product Context:** ArcGIS Online proposed for the public demo; the component inherits its host's scene context.
- **Target Platform:** Web, desktop keyboard, ArcGIS-supported browser with 3D rendering.
- **Delivery Scope:** Prototype; assisted virtual flight, a host-view drone graphic, and a simultaneous live FPV inset.
- **Identity & Access Model:** Host-managed; assume anonymously accessible resources for the Day 10 demo and verify the item and services before selecting them.
- **Core Features and Operations:** Read and render a WebScene in two views, sample ground elevation, and update local flight state and graphics.

#### Remaining assumptions

1. A suitable scene with a clear launch point and a lightweight 3D landmark can be selected for the reference device.
2. The selected SDK and target hardware can sustain the dual-view design near the ground; validate this first.

#### Next agent actions

- [ ] Use `build-with-arcgis-maps-sdk-for-javascript` and `build-with-calcite-design-system` for the implementation and validation.
- [ ] Use `follow-arcgis-authentication-patterns` if the selected demo scene or services require a credential or sign-in decision.
