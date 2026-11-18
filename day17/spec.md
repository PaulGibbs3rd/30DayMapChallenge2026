# Day 17 · Seattle in Shadow

**Design spec · November 17, 2026**

The **Light & dark** prompt asks, “What can you map with just light and shadows?” Show which faces, blocks, and streets come into view as light turns across downtown Seattle. [Official 2026 challenge](https://30daymapchallenge.com/2026/)

## Scene and art direction

- Frame Pioneer Square, the downtown skyline and Elliott Bay from a low camera over the bay. Use Smith Tower and the shoreline as orientation points.
- Open with low northeast light and a black disk visible in the sky. Make cast shadows traceable across streets and neighboring façades. Keep enough tonal separation for the grid and shoreline to read under either preset.
- Use a pale sky, chalk-white lit faces, deep black water, and sparse labels. The high-contrast infrared look draws on the exterior photography of Giedi Prime. [American Society of Cinematographers](https://theasc.com/article/expanding-view-dune-part-two/)

## Reader interaction

Open on a still northeast view with no automatic motion. A **Light direction** slider adjusts sunlight while the camera stays fixed. **Southwest** and **Northeast** are opposite presets at 245° and 65°. Display the bearing and solar elevation. ArcGIS uses a date and time to position the sun, so elevation varies with bearing. Project the black disk in the direction of the light and let it leave the frame.

An **Eclipse** slider moves a silhouette across the sun, reports the percentage covered, and dims the city and sky without moving the camera or changing the light direction. Show a corona near totality and provide a control to go directly to full coverage.

Allow bounded orbit and zoom by pointer, touch, or keyboard. **Reset view** restores the opening camera and light and clears the eclipse. Keep controls readable and reachable on desktop and phone.

## Delivery and validation

Use the CDN starter from `@arcgis/create` for the static Day 17 route. Render the City of Seattle’s lidar-derived 2015–16 building shells in an ArcGIS Scene with a charcoal vector basemap and World Elevation terrain. Use the same opening view as a shareable still and an interactive fallback. The [project notes](readme.md) document the sources and rendering method.

Check that changing the preset alters shadows across the same streets and façades with the camera held still. Test keyboard access, reset, the phone layout, and the fallback still.
